import { PrismaClient } from "@prisma/client";
import type { Parish, Result, Map, Total } from "@prisma/client";

import resultsData from "../data/tables/results.json";
import parishesData from "../data/tables/parishes.json";
import mapsData from "../data/tables/maps.json";
import totalData from "../data/tables/total.json";

const results = resultsData as Result[];
const parishes = parishesData as Parish[];
const maps = mapsData as Map[];
const total = totalData as Total[];
