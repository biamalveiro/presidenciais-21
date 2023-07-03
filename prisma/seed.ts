import { PrismaClient } from "@prisma/client";
import type { Parish, Result, Feature, Total } from "@prisma/client";

import resultsData from "../data/tables/results.json";
import parishesData from "../data/tables/parishes.json";
import mapsData from "../data/tables/maps.json";
import totalData from "../data/tables/total.json";

const results = resultsData as Result[];
const parishes = parishesData as Parish[];
const maps = mapsData as Feature[];
const total = totalData as Total[];

const prisma = new PrismaClient();

async function main() {
  await prisma.result.createMany({
    data: results,
    skipDuplicates: true,
  });

  await prisma.parish.createMany({
    data: parishes,
    skipDuplicates: true,
  });

  await prisma.feature.createMany({
    data: maps,
    skipDuplicates: true,
  });

  await prisma.total.createMany({
    data: total,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
