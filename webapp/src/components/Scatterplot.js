import React, { useRef, useState, useEffect } from "react";
import { isUndefined } from "lodash";
import { Circle } from "@visx/shape";
import { useTooltip, TooltipWithBounds } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { max, extent } from "d3-array";
import { scaleLinear, scalePow } from "d3-scale";

import { scaleColor } from "../utils/scales";
import { useOnClickOutside } from "../utils/hooks";

const WIDTH = 800;
const HEIGHT = 800 / 2;

const ScatterCircle = (props) => {
  return (
    <Circle
      cx={props.cx}
      cy={props.cy}
      r={props.r}
      fill={props.color}
      fillOpacity={
        props.isActive || props.isHover ? 1 : props.isFaded ? 0.1 : 0.3
      }
      stroke={props.isActive ? "#374151" : props.color}
      strokeWidth={props.isActive ? 2 : 0.5}
      strokeOpacity={props.isFaded ? 0.5 : 1}
      onClick={() => props.setActiveParishId(props.parishId)}
      onMouseOver={props.onMouseOver}
      onMouseOut={props.onMouseOut}
    />
  );
};

export default function Scatterplot(props) {
  const [parishes, setParishes] = useState([]);
  const [hoverParish, setHoverParish] = useState();
  const containerRef = useRef();
  const pointsRef = useRef();
  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip({
    detectBounds: true,
    scroll: true,
    containerRef,
  });
  useOnClickOutside(pointsRef, () => props.setActiveParishId());

  const loadParishes = async () => {
    const res = await fetch("/api/getParishesScatter");
    const parishes = await res.json();
    setParishes(parishes);
  };

  useEffect(() => {
    loadParishes();
  }, []);

  const activeParishDatum = parishes.filter(
    (parish) => parish.dicofre === props.activeParishId
  )[0];

  const handleMouseOver = (event, datum) => {
    setHoverParish(datum.dicofre);
    const coords = localPoint(containerRef.current, event);
    showTooltip({
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
      tooltipData: datum,
    });
  };

  const scaleX = scaleLinear()
    .domain(extent(parishes, (d) => d.x))
    .range([0, WIDTH])
    .nice();
  const scaleY = scaleLinear()
    .domain(extent(parishes, (d) => d.y))
    .range([HEIGHT, 0])
    .nice();

  const scaleSize = scalePow()
    .exponent(0.5)
    .domain([0, max(parishes, (d) => d.votes)])
    .range([2, 10]);

  return (
    <div>
      <svg ref={containerRef} width={WIDTH} height={HEIGHT}>
        <g ref={pointsRef}>
          {parishes.map((d) => {
            const isHover = d.dicofre === hoverParish;
            return (
              <ScatterCircle
                key={`embedding-${d.dicofre}`}
                cx={scaleX(d.x)}
                cy={scaleY(d.y)}
                r={scaleSize(d.votes)}
                color={scaleColor(d.outlier)}
                parishId={d.dicofre}
                setActiveParishId={props.setActiveParishId}
                onMouseOver={(event) => handleMouseOver(event, d)}
                onMouseOut={hideTooltip}
                isHover={isHover}
                isFaded={!isUndefined(props.activeParishId)}
              />
            );
          })}
          {!isUndefined(props.activeParishId) ? (
            <ScatterCircle
              cx={scaleX(activeParishDatum.x)}
              cy={scaleY(activeParishDatum.y)}
              r={scaleSize(activeParishDatum.votes)}
              color={scaleColor(activeParishDatum.outlier)}
              parishId={activeParishDatum.dicofre}
              setActiveParishId={props.setActiveParishId}
              isActive
              onMouseOver={(event) => handleMouseOver(event, activeParishDatum)}
              onMouseOut={hideTooltip}
            />
          ) : null}
        </g>
      </svg>
      {tooltipOpen && (
        <TooltipWithBounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
        >
          {tooltipData.name}
        </TooltipWithBounds>
      )}
    </div>
  );
}
