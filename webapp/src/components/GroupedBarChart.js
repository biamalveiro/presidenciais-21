import React, { useMemo } from "react";
import { Group } from "@visx/group";
import { AxisLeft } from "@visx/axis";
import { scaleLinear, scaleBand } from "d3-scale";
import { Bar } from "@visx/shape";
import { find } from "lodash";
import { Text } from "@visx/text";

import { useChartDimensions } from "../utils/hooks";

import marceloRebeloSousaImage from "../resources/marcelo-rebelo-sousa.png";
import anaGomesImage from "../resources/ana-gomes.png";
import andreVenturaImage from "../resources/andre-ventura.png";
import joaoFerreiraImage from "../resources/joao-ferreira.png";
import marisaMatiasImage from "../resources/marisa-matias.png";
import tiagoMayanGoncalvesImage from "../resources/tiago-mayan-goncalves.png";
import vitorinoSilvaImage from "../resources/vitorino-silva.png";

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

const chartSettings = {
  marginLeft: 60,
};

export default function GroupedBarChart(props) {
  const [ref, dimensions] = useChartDimensions(chartSettings);

  const scaleX = useMemo(
    () => scaleLinear().domain([0, 100]).range([0, dimensions.boundedWidth]),
    [dimensions.boundedWidth]
  );

  const scaleY = useMemo(
    () =>
      scaleBand()
        .domain(candidates)
        .range([0, dimensions.boundedHeight])
        .padding(0.15),
    [dimensions.boundedHeight]
  );

  return (
    <div ref={ref} className="w-4/12 my-4">
      <svg width={dimensions.width} height={dimensions.height}>
        <Group top={dimensions.marginTop} left={dimensions.marginLeft + 5}>
          {candidates.map((candidate) => {
            const candidateParishResults = find(props.parish.results, {
              candidate,
            });
            const candidateNeighborResults = find(props.neighbor.results, {
              candidate,
            });
            return (
              <Group key={`grouped-bar-${candidate}`}>
                <Bar
                  width={scaleX(candidateParishResults.votesPercentage)}
                  height={scaleY.bandwidth() / 2}
                  x={0}
                  y={scaleY(candidate) + scaleY.bandwidth() / 2}
                  fill={props.parish.color}
                />
                <Bar
                  width={scaleX(candidateNeighborResults.votesPercentage)}
                  height={scaleY.bandwidth() / 2}
                  x={0}
                  y={scaleY(candidate) + scaleY.bandwidth()}
                  fill={props.neighbor.color}
                />
                <Text
                  textAnchor="start"
                  className="text-xs font-sans"
                  verticalAnchor="start"
                  x={scaleX(candidateParishResults.votesPercentage)}
                  y={scaleY(candidate) + scaleY.bandwidth() / 2}
                  dx={5}
                  dy={3}
                  fill={props.parish.color}
                >
                  {`${candidateParishResults.votesPercentage}%`}
                </Text>
                <Text
                  textAnchor="start"
                  className="text-xs font-sans"
                  verticalAnchor="start"
                  x={scaleX(candidateNeighborResults.votesPercentage)}
                  y={scaleY(candidate) + scaleY.bandwidth()}
                  dx={5}
                  dy={3}
                  fill={props.neighbor.color}
                >
                  {`${candidateNeighborResults.votesPercentage}%`}
                </Text>
              </Group>
            );
          })}
        </Group>

        <AxisLeft
          scale={scaleY}
          top={dimensions.marginTop}
          left={scaleY.bandwidth()}
          hideAxisLine
          hideTicks
          tickComponent={(props) => (
            <image
              className="candidate-avatar"
              x={props.x}
              y={props.y}
              href={candidateImages[props.formattedValue]}
              height={scaleY.bandwidth()}
              width={scaleY.bandwidth()}
            />
          )}
        />
      </svg>
    </div>
  );
}
