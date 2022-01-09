import React, { useRef, useState, useEffect } from "react";
import { isUndefined } from "lodash";
import { Circle } from "@visx/shape";
import { max, extent } from "d3-array";
import { scaleLinear, scalePow } from "d3-scale";
import Tippy, { useSingleton } from "@tippyjs/react";

import { scaleColor } from "../utils/scales";
import { useOnClickOutside } from "../utils/hooks";

const WIDTH = 800;
const HEIGHT = 800 / 2;

const ScatterCircle = React.memo(
  ({ cx, cy, r, color, name, isActive, isFaded, onClick, target }) => {
    const [isOnHover, setIsOnHover] = useState(false);
    return (
      <Tippy
        content={
          <div className="border rounded border-gray-300 shadow-lg py-1 px-2 bg-white text-sm">
            {name}
          </div>
        }
        singleton={target}
        delay={500}
      >
        <g>
          <Circle
            cx={cx}
            cy={cy}
            r={r}
            fill={color}
            fillOpacity={isActive || isOnHover ? 1 : isFaded ? 0.1 : 0.3}
            stroke={isActive ? "#374151" : color}
            strokeWidth={isActive ? 2 : 0.5}
            strokeOpacity={isFaded ? 0.5 : 1}
            onClick={onClick}
            onMouseEnter={() => setIsOnHover(true)}
            onMouseLeave={() => setIsOnHover(false)}
            className="cursor-pointer"
          />
        </g>
      </Tippy>
    );
  }
);

export default function Scatterplot(props) {
  const [parishes, setParishes] = useState([]);
  const [source, target] = useSingleton();
  const containerRef = useRef();
  const pointsRef = useRef();

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
      <Tippy singleton={source} />
      <svg ref={containerRef} width={WIDTH} height={HEIGHT}>
        <g ref={pointsRef}>
          {parishes.map((d) => {
            return (
              <ScatterCircle
                key={`embedding-${d.dicofre}`}
                cx={scaleX(d.x)}
                cy={scaleY(d.y)}
                r={scaleSize(d.votes)}
                color={scaleColor(d.outlier)}
                name={d.name}
                onClick={() => props.setActiveParishId(d.dicofre)}
                isFaded={!isUndefined(props.activeParishId)}
                tooltipTarget={target}
              />
            );
          })}
          {!isUndefined(props.activeParishId) ? (
            <ScatterCircle
              cx={scaleX(activeParishDatum.x)}
              cy={scaleY(activeParishDatum.y)}
              r={scaleSize(activeParishDatum.votes)}
              color={scaleColor(activeParishDatum.outlier)}
              name={activeParishDatum.name}
              onClick={() => props.setActiveParishId(activeParishDatum.dicofre)}
              isActive
              tooltipTarget={target}
            />
          ) : null}
        </g>
      </svg>
    </div>
  );
}
