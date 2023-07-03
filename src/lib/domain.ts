import { scaleOrdinal } from "@visx/scale";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config.js";

import marceloImage from "../../assets/marcelo-rebelo-sousa.png";
import andreImage from "../../assets/andre-ventura.png";
import anaImage from "../../assets/ana-gomes.png";
import joaoImage from "../../assets/joao-ferreira.png";
import marisaImage from "../../assets/marisa-matias.png";
import tiagoImage from "../../assets/tiago-mayan-goncalves.png";
import vitorinoImage from "../../assets/vitorino-silva.png";

export const candidates = {
  "Marcelo Rebelo de Sousa": {
    image: marceloImage,
    color: { main: "#f97316" },
  },
  "Ana Gomes": {
    image: anaImage,
    color: { main: "#ec4899" },
  },
  "André Ventura": {
    image: andreImage,
    color: { main: "#1e40af" },
  },
  "João Ferreira": {
    image: joaoImage,
    color: { main: "#dc2626" },
  },
  "Marisa Matias": {
    image: marisaImage,
    color: { main: "#9333ea" },
  },
  "Tiago Mayan Gonçalves": {
    image: tiagoImage,
    color: { main: "#0ea5e9" },
  },
  "Vitorino Silva": {
    image: vitorinoImage,
    color: { main: "#059669" },
  },
};

export const candidatesNames = Object.keys(candidates);

export const scaleColor = scaleOrdinal({
  domain: Object.keys(candidates),
  range: Object.values(candidates).map((c) => c.color),
});

export const fallbackColor = {
  main: "#94a3b8",
};
