import { useAtomValue } from "jotai";
import { useTranslation } from "next-i18next";
import { selectedParishAtom } from "./Search";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import withParentSize from "@visx/responsive/lib/enhancers/withParentSizeModern";
import { WithParentSizeProvidedProps } from "@visx/responsive/lib/enhancers/withParentSize";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { candidates, candidatesNames, fallbackColor } from "~/lib/domain";
import { AxisLeft } from "@visx/axis";
import { api } from "~/utils/api";
import { motion } from "framer-motion";
import { Line } from "@visx/shape";
import { Text } from "@visx/text";
import { format } from "d3-format";
import { cn } from "~/lib/utils";

const PADDING_LEFT = 80;

export const formatCount = (value: number) =>
  format(".2s")(value).replace("k", "m");

export default function Panel() {
  const selectedParish = useAtomValue(selectedParishAtom);
  const { t } = useTranslation("common");

  return (
    <Card className="flex min-h-[300px] w-1/3 flex-col ">
      <CardHeader className=" h-[100px]">
        <CardTitle>{selectedParish?.name ?? "Portugal"}</CardTitle>
        <CardDescription>
          {selectedParish
            ? `${selectedParish.county}, ${selectedParish.region}`
            : t("national-results")}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-full">
        <BarChart />
      </CardContent>
    </Card>
  );
}

const BarChart = withParentSize(
  ({ parentHeight, parentWidth }: WithParentSizeProvidedProps) => {
    const { t } = useTranslation("common");
    const scaleY = scaleBand({
      domain: candidatesNames,
      range: [0, parentHeight ?? 0],
      padding: 0.15,
    });

    const scaleX = scaleLinear({
      domain: [0, 100],
      range: [0, (parentWidth ?? 0) - PADDING_LEFT],
    });

    const selectedParish = useAtomValue(selectedParishAtom);

    const { data: totals } = api.results.getTotalResults.useQuery();
    const { data: parishResults } = api.results.getParishResults.useQuery({
      dicofre: selectedParish?.dicofre,
    });

    return (
      <svg width={parentWidth} height={parentHeight}>
        <Group left={PADDING_LEFT}>
          {totals &&
            scaleY.domain().map((candidate, i) => {
              const candidateTotalResult = totals?.find(
                (t) => t.candidate === candidate
              );
              const candidateParishResult = parishResults?.find(
                (t) => t.candidate === candidate
              );

              const totalPosition = scaleX(
                candidateTotalResult?.votesPercentage ?? 0
              );
              const barLength = scaleX(
                candidateParishResult?.votesPercentage ?? 0
              );

              const textResults =
                selectedParish && candidateParishResult
                  ? candidateParishResult
                  : !selectedParish
                  ? candidateTotalResult
                  : null;

              const color =
                selectedParish?.outlier === candidate
                  ? (candidates[candidate].color.main as string)
                  : fallbackColor.main;

              return (
                <Group key={candidate}>
                  {selectedParish && (
                    <motion.rect
                      animate={{
                        width: barLength,
                        fill: color,
                      }}
                      x={0}
                      y={scaleY(candidate) ?? 0}
                      height={scaleY.bandwidth()}
                      opacity={0.6}
                    />
                  )}
                  <Line
                    x1={totalPosition}
                    x2={totalPosition}
                    y1={scaleY(candidate) ?? 0}
                    y2={(scaleY(candidate) ?? 0) + scaleY.bandwidth()}
                    stroke={"black"}
                    strokeWidth={2}
                  />
                  {!selectedParish && (
                    <motion.rect
                      animate={{
                        width: totalPosition,
                        stroke: "black",
                      }}
                      x={0}
                      y={scaleY(candidate) ?? 0}
                      height={scaleY.bandwidth()}
                      opacity={0.5}
                      fill={"transparent"}
                    />
                  )}
                  {textResults && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Text
                        textAnchor="end"
                        verticalAnchor="middle"
                        x={-30}
                        y={scaleY(candidate)}
                        dy={scaleY.bandwidth() / 3}
                        dx={5}
                        className={cn(
                          selectedParish ? "fill-slate-600" : " fill-black",
                          "font-sans text-xs"
                        )}
                      >
                        {`${textResults.votesPercentage}%`}
                      </Text>
                      <Text
                        textAnchor="end"
                        verticalAnchor="middle"
                        x={-30}
                        y={scaleY(candidate)}
                        dy={scaleY.bandwidth() / 3 + 11}
                        dx={5}
                        className={
                          selectedParish ? "fill-slate-600" : " fill-black"
                        }
                        fontSize="8px"
                      >
                        {`(${formatCount(textResults.votes)} ${t("votes")})`}
                      </Text>
                    </motion.g>
                  )}
                </Group>
              );
            })}
        </Group>
        <AxisLeft
          scale={scaleY}
          hideAxisLine
          hideTicks
          tickComponent={(props) => {
            return (
              <image
                className=" grayscale"
                x={props.x + PADDING_LEFT - scaleY.bandwidth() / 2}
                y={props.y - scaleY.bandwidth() / 2}
                href={candidates[props.formattedValue as unknown].image.src}
                height={scaleY.bandwidth()}
                width={scaleY.bandwidth()}
              />
            );
          }}
        />
      </svg>
    );
  }
);
