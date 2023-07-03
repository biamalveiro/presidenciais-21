import { Parish } from "@prisma/client";
import { type TRPCClientErrorLike } from "@trpc/react-query";
import { UseTRPCQueryResult } from "@trpc/react-query/shared";
import { type inferRouterOutputs } from "@trpc/server";
import localPoint from "@visx/event/lib/localPointGeneric";
import { Group } from "@visx/group";
import { withParentSize } from "@visx/responsive";
import type {
  WithParentSizeProps,
  WithParentSizeProvidedProps,
} from "@visx/responsive/lib/enhancers/withParentSize";
import { scaleLinear, scaleSqrt } from "@visx/scale";
import { defaultStyles, useTooltip, useTooltipInPortal } from "@visx/tooltip";
import { extent } from "d3-array";
import { useAtom } from "jotai";
import React, { useMemo } from "react";
import { fallbackColor, scaleColor } from "~/lib/domain";
import { AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";
import { selectedParishAtom } from "./Search";

type ScatterData = UseTRPCQueryResult<
  inferRouterOutputs<AppRouter>["results"]["getAllParishes"],
  TRPCClientErrorLike<AppRouter>
>["data"];

const PADDING = 20;

const Embedding = ({
  parentWidth = 0,
  parentHeight = 0,
}: WithParentSizeProps & WithParentSizeProvidedProps) => {
  const { data, isLoading } = api.results.getAllParishes.useQuery();
  const [selectedParish, setSelectedParish] = useAtom(selectedParishAtom);

  const {
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
    showTooltip,
    hideTooltip,
  } = useTooltip<Parish>();

  const { containerRef, TooltipInPortal } = useTooltipInPortal({
    detectBounds: true,
    scroll: true,
  });

  const handleMouseOver = (
    event:
      | React.MouseEvent<SVGCircleElement>
      | React.TouchEvent<SVGCircleElement>,
    datum: Parish
  ) => {
    const target = event.target as SVGCircleElement;
    if (!target.ownerSVGElement) return;
    const coords = localPoint(target.ownerSVGElement, event);
    if (!coords) return;
    showTooltip({
      tooltipData: datum,
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
    });
  };

  const handleClick = (datum: Parish) => {
    setSelectedParish(datum);
  };

  const scaleX = useMemo(() => {
    if (!data) return (d: number) => d;
    return scaleLinear({
      domain: extent(data, (d) => d.x) as [number, number],
      range: [0, parentWidth - 2 * PADDING],
    });
  }, [data, parentWidth]);

  const scaleY = useMemo(() => {
    if (!data) return (d: number) => d;
    return scaleLinear({
      domain: extent(data, (d) => d.y) as [number, number],
      range: [parentHeight - 2 * PADDING, 0],
    });
  }, [data, parentHeight]);

  const scaleSize = useMemo(() => {
    if (!data) return (d: number) => d;
    return scaleSqrt({
      domain: extent(data, (d) => d.votes) as [number, number],
      range: [1, 10],
    });
  }, [data]);

  if (isLoading || !data) {
    return <div>Loading...</div>;
  }

  const sortedData = data.sort((a, b) => {
    if (!selectedParish) return 0;
    return a.dicofre === selectedParish.dicofre
      ? 1
      : b.dicofre === selectedParish.dicofre
      ? -1
      : 0;
  });

  return (
    <>
      <svg width={parentWidth} height={parentHeight} ref={containerRef}>
        <Group top={PADDING} left={PADDING}>
          <rect
            x={0}
            y={0}
            width={parentWidth - 2 * PADDING}
            height={parentHeight - 2 * PADDING}
            fill="transparent"
            onClick={() => setSelectedParish(null)}
          />
          {data.map((d) => (
            <circle
              key={d.dicofre}
              cx={scaleX(d.x)}
              cy={scaleY(d.y)}
              r={scaleSize(d.votes)}
              fill={d.outlier ? scaleColor(d.outlier).main : fallbackColor.main}
              fillOpacity={d.dicofre === selectedParish?.dicofre ? 0.8 : 0.3}
              stroke={
                d.dicofre === selectedParish?.dicofre
                  ? "black"
                  : d.outlier
                  ? scaleColor(d.outlier).main
                  : fallbackColor.main
              }
              strokeOpacity={d.dicofre === selectedParish?.dicofre ? 1 : 0.5}
              strokeWidth={d.dicofre === selectedParish?.dicofre ? 2 : 1}
              onMouseOver={(event) => handleMouseOver(event, d as Parish)}
              onMouseOut={hideTooltip}
              onClick={() => handleClick(d as Parish)}
            />
          ))}
        </Group>
        {tooltipOpen && tooltipData && (
          <TooltipInPortal
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              backgroundColor: "transparent",
              boxShadow: "none",
            }}
          >
            <div className="rounded-md bg-white p-2 shadow-md">
              <p className="text-sm font-bold">{tooltipData.name}</p>
              <p className="text-xs">{tooltipData.votes} votos</p>
            </div>
          </TooltipInPortal>
        )}
      </svg>
    </>
  );
};

export default withParentSize(Embedding);
