import React, { useState, useEffect } from "react";
import { AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { Bar, Line } from "@visx/shape";
import { Text } from "@visx/text";
import { scaleLinear, scaleBand } from "d3-scale";
import { isUndefined, isNull } from "lodash";

import { scaleColor } from "../utils/scales";
import { formatCount } from "../utils/formatters";

import marceloRebeloSousaImage from "../resources/marcelo-rebelo-sousa.png";
import anaGomesImage from "../resources/ana-gomes.png";
import andreVenturaImage from "../resources/andre-ventura.png";
import joaoFerreiraImage from "../resources/joao-ferreira.png";
import marisaMatiasImage from "../resources/marisa-matias.png";
import tiagoMayanGoncalvesImage from "../resources/tiago-mayan-goncalves.png";
import vitorinoSilvaImage from "../resources/vitorino-silva.png";
import portugalData from "../resources/data/total.json";

const candidateImages = {
  "Marcelo Rebelo de Sousa": marceloRebeloSousaImage,
  "Ana Gomes": anaGomesImage,
  "André Ventura": andreVenturaImage,
  "João Ferreira": joaoFerreiraImage,
  "Marisa Matias": marisaMatiasImage,
  "Tiago Mayan Gonçalves": tiagoMayanGoncalvesImage,
  "Vitorino Silva": vitorinoSilvaImage,
};

const candidates = [
  "Marcelo Rebelo de Sousa",
  "Ana Gomes",
  "André Ventura",
  "João Ferreira",
  "Marisa Matias",
  "Tiago Mayan Gonçalves",
  "Vitorino Silva",
];

const scaleX = scaleLinear().domain([0, 100]).range([0, 150]);
const scaleY = scaleBand().domain(candidates).range([0, 230]).padding(0.15);

export default function BarChart(props) {
  const [parish, setParish] = useState(null);

  const loadParishData = async () => {
    const res = await fetch("/api/getParish", {
      method: "POST",
      body: JSON.stringify({ dicofre: props.activeParishId }),
    });
    const parishData = await res.json();
    setParish(parishData);
  };

  useEffect(() => {
    if (!isUndefined(props.activeParishId)) {
      loadParishData();
    } else {
      setParish(null);
    }
  }, [props.activeParishId]);

  const renderPortugalResultsLine = (results) => {
    return (
      <Group className="portugal-lines">
        <Line
          from={{
            x: scaleX(results.votesPercentage),
            y: scaleY(results.candidate),
          }}
          to={{
            x: scaleX(results.votesPercentage),
            y: scaleY(results.candidate) + scaleY.bandwidth(),
          }}
          stroke="#111827"
          strokeWidth={2}
          strokeOpacity={0.8}
        />
      </Group>
    );
  };

  const renderCandidateBar = (candidate, results) => {
    const barColor =
      parish?.outlier === candidate ? scaleColor(candidate) : "#D1D5DB";
    return (
      <Group>
        <Bar
          width={scaleX(results.votesPercentage)}
          height={scaleY.bandwidth()}
          x={0}
          y={scaleY(results.candidate)}
          fill={barColor}
        />
        {renderVotesValues(results)}
      </Group>
    );
  };

  const renderVotesValues = (results, isTotal) => {
    const textFill = isTotal ? "#111827" : "#6B7280";
    return (
      <Group className="axis-tick-labels">
        <Text
          textAnchor="end"
          className="text-xs font-sans"
          verticalAnchor="middle"
          x={-30}
          y={scaleY(results.candidate)}
          dy={scaleY.bandwidth() / 3}
          dx={5}
          fill={textFill}
        >
          {`${results.votesPercentage}%`}
        </Text>
        <Text
          textAnchor="end"
          verticalAnchor="middle"
          x={-30}
          y={scaleY(results.candidate)}
          dy={scaleY.bandwidth() / 3 + 11}
          dx={5}
          fill={textFill}
          fontSize="8px"
        >
          {`(${formatCount(results.votes)} votos)`}
        </Text>
      </Group>
    );
  };

  return (
    <div className="m-4">
      <p>
        <strong>{isNull(parish) ? "Portugal" : parish.name}</strong>
      </p>
      <div className="text-xs">
        <p>
          {isNull(parish)
            ? "Resultados Totais"
            : `${parish.county}, ${parish.region}`}
        </p>
      </div>
      <svg width={230} height={230} className="mt-2">
        <Group left={scaleY.bandwidth() + 50}>
          {candidates.map((candidateName) => {
            const candidatePortugalResults = portugalData.results.filter(
              (d) => d.candidate === candidateName
            )[0];

            const parishResults = parish?.results.filter(
              (d) => d.candidate === candidateName
            )[0];

            return (
              <Group key={`bar-chart-${candidateName}`}>
                {!isNull(parish)
                  ? renderCandidateBar(candidateName, parishResults)
                  : renderVotesValues(candidatePortugalResults, true)}
                {renderPortugalResultsLine(candidatePortugalResults)}
              </Group>
            );
          })}
          <AxisLeft
            scale={scaleY}
            hideAxisLine
            hideTicks
            tickComponent={(props) => (
              <image
                className="candidate-avatar"
                x={props.x - scaleY.bandwidth() / 2}
                y={props.y - scaleY.bandwidth() / 2}
                href={candidateImages[props.formattedValue]}
                height={scaleY.bandwidth()}
                width={scaleY.bandwidth()}
              />
            )}
          />
        </Group>
      </svg>
    </div>
  );
}
