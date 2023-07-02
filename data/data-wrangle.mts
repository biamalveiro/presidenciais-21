import { writeFileSync, readFileSync } from "fs";

import {
  deviation,
  first,
  groupBy,
  leftJoin,
  mean,
  mutate,
  rename,
  select,
  sliceMax,
  summarize,
  tidy,
} from "@tidyjs/tidy";

type Datum = {
  [key: string]: string | number;
};

const distMatrix = JSON.parse(
  readFileSync("./data/dist-matrix.json", "utf8")
) as Datum[];
const map = JSON.parse(readFileSync("./data/geo-parishes.json", "utf8"));
const results = JSON.parse(
  readFileSync("./data/results-parishes.json", "utf8")
) as Datum[];
const resultsPT = JSON.parse(readFileSync("./data/results-pt.json", "utf8"));
const embedding = JSON.parse(readFileSync("./data/umap.json", "utf8"));

function groupResults(results: Datum[]) {
  const candidateResults = tidy(
    results,
    select([
      "candidate_name",
      "candidate_votes_percentage",
      "candidate_votes_count",
    ]),
    rename({
      candidate_name: "candidate",
      candidate_votes_percentage: "votesPercentage",
      candidate_votes_count: "votes",
    }),
    mutate({
      type: "valid",
    })
  );

  const otherResults = ["null", "blank"].map((type) => {
    return {
      type,
      candidate: null,
      votesPercentage: results[0]?.[`parish_${type}_percentage`],
      votes: results[0]?.[`parish_${type}_count`],
    };
  });

  return [...candidateResults, ...otherResults];
}

let parishes = tidy(
  results,
  groupBy("parish_territory_key", [
    summarize({
      name: first("parish_name"),
      county: first("county_name"),
      region: first("region_name"),
      votes: first("parish_voters_count"),
    }),
  ]),
  rename({ parish_territory_key: "dicofre" })
);

const thresholds = tidy(
  results,
  groupBy("candidate_name", [
    summarize({
      stdev: deviation("candidate_votes_percentage"),
      mean: mean("candidate_votes_percentage"),
    }),
  ]),
  mutate({
    upperLimit: (d) => 1.5 * (d.stdev ?? 0) + (d.mean ?? 0),
  }),
  select(["candidate_name", "upperLimit"])
);

const outliers = tidy(
  results,
  groupBy("parish_territory_key", [
    leftJoin(thresholds, { by: "candidate_name" }),

    mutate({
      diff: (parish) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        parish["candidate_votes_percentage"] - parish["upperLimit"],
    }),
    sliceMax(1, "diff"),
    mutate({
      outlier: (parish) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        parish["diff"] > 0 ? parish["candidate_name"] : null,
    }),
    select(["parish_name", "outlier"]),
  ]),
  rename({ parish_territory_key: "dicofre" })
);

parishes = tidy(parishes, leftJoin(outliers, { by: "dicofre" }));

const parishTable = parishes.map((parish) => {
  const parishEmbedding = embedding.filter(
    (embeddedParish: Datum) => embeddedParish["dicofre"] === parish["dicofre"]
  )[0];

  const parishDistances = distMatrix.find(
    (distances: Datum) =>
      distances["parish_territory_key"] === parish["dicofre"]
  );

  const distanceToTotal = parishDistances?.["500000"];

  const neighbor = parishDistances
    ? Object.keys(parishDistances).reduce((key, v) =>
        v != "500000" &&
        v != parish["dicofre"] &&
        (parishDistances?.[v] ?? 0) < (parishDistances?.[key] ?? 0)
          ? v
          : key
      )
    : null;

  return {
    ...parish,
    x: parishEmbedding?.x,
    y: parishEmbedding?.y,
    neighbor,
    distanceToTotal,
  };
});

const mapsTable = parishes.map((parish) => {
  const parishMap = (map as any).features.find(
    (geoFeature: { properties: { fre_code: string } }) => {
      return geoFeature.properties["fre_code"] == parish["dicofre"];
    }
  );
  return {
    dicofre: parish["dicofre"],
    name: parish["name"],
    map: JSON.stringify(parishMap),
  };
});

const resultsTable = parishes
  .map((parish) => {
    const parishResults = results.filter(
      (result: Datum) => result["parish_territory_key"] === parish["dicofre"]
    );

    const groupedResults = groupResults(parishResults);

    return groupedResults.map((result) => ({
      ...result,
      dicofre: parish["dicofre"],
      name: parish["name"],
      id: `${parish["dicofre"]}-${result["candidate"]}`,
    }));
  })
  .flat();

const totalTable = groupResults(resultsPT).map((r) => ({
  ...r,
  id: `PT-${r["candidate"]}`,
}));

writeFileSync(
  "./data/tables/parishes.json",
  JSON.stringify(parishTable, null, 2)
);
writeFileSync(
  "./data/tables/results.json",
  JSON.stringify(resultsTable, null, 2)
);
writeFileSync("./data/tables/maps.json", JSON.stringify(mapsTable, null, 2));
writeFileSync("./data/tables/total.json", JSON.stringify(totalTable, null, 2));
