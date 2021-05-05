const fs = require("fs");
const {
  tidy,
  groupBy,
  summarize,
  first,
  rename,
  select,
  mutate,
  mean,
  deviation,
  leftJoin,
  sliceMax,
} = require("@tidyjs/tidy");

const results = JSON.parse(fs.readFileSync("../data/results-parishes.json"));
const resultsPT = JSON.parse(fs.readFileSync("../data/results-pt.json"));

const map = JSON.parse(fs.readFileSync("../data/geo-portugal.json"));
const embedding = JSON.parse(fs.readFileSync("../data/umap.json"));
const distMatrix = JSON.parse(fs.readFileSync("../data/dist-matrix.json"));

function groupResults(results) {
  let candidateResults = tidy(
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

  let otherResults = ["null", "blank"].map((type) => {
    return {
      type,
      candidate: null,
      votesPercentage: results[0][`parish_${type}_percentage`],
      votes: results[0][`parish_${type}_count`],
    };
  });

  return [...candidateResults, otherResults];
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
    upperLimit: (d) => 1.5 * d.stdev + d.mean,
  }),
  select(["candidate_name", "upperLimit"])
);

const outliers = tidy(
  results,
  groupBy("parish_territory_key", [
    leftJoin(thresholds, { by: "candidate_name" }),
    mutate({
      diff: (parish) =>
        parish["candidate_votes_percentage"] - parish["upperLimit"],
    }),
    sliceMax(1, "diff"),
    mutate({
      outlier: (parish) =>
        parish["diff"] > 0 ? parish["candidate_name"] : null,
    }),
    select(["parish_name", "outlier"]),
  ]),
  rename({ parish_territory_key: "dicofre" })
);

parishes = tidy(parishes, leftJoin(outliers, { by: "dicofre" }));

parishes = parishes.map((parish) => {
  const parishResults = results.filter(
    (result) => result["parish_territory_key"] === parish["dicofre"]
  );

  const parishEmbedding = embedding.filter(
    (embeddedParish) => embeddedParish["dicofre"] === parish["dicofre"]
  )[0];

  const parishMap = map.features.filter(
    (geoFeature) =>
      geoFeature.properties["DICOFRE"] == parish["dicofre"] ||
      geoFeature.properties["Dicofre"] == parish["dicofre"] ||
      geoFeature.properties["dicofre"] == parish["dicofre"]
  )[0];

  const parishDistances = distMatrix.filter(
    (distances) => distances["parish_territory_key"] === parish["dicofre"]
  )[0];

  const distanceToTotal = parishDistances["500000"];

  const neighbor = Object.keys(parishDistances).reduce((key, v) =>
    v != "500000" &&
    v != parish["dicofre"] &&
    parishDistances[v] < parishDistances[key]
      ? v
      : key
  );

  const groupedResults = groupResults(parishResults);

  return {
    results: JSON.stringify(groupedResults),
    x: parishEmbedding.x,
    y: parishEmbedding.y,
    map: JSON.stringify(parishMap),
    neighbor,
    distanceToTotal,
    ...parish,
  };
});

const total = {
  name: "Portugal",
  dicofre: "500000",
  results: groupResults(resultsPT),
};

fs.writeFileSync("../data/parishes.json", JSON.stringify(parishes));
fs.writeFileSync("../data/total.json", JSON.stringify(total));
