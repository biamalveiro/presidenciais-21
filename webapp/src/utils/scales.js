import { scaleOrdinal } from "d3-scale";

export const candidates = [
  "Marcelo Rebelo de Sousa",
  "Ana Gomes",
  "André Ventura",
  "João Ferreira",
  "Marisa Matias",
  "Tiago Mayan Gonçalves",
  "Vitorino Silva",
];

export const scaleColor = scaleOrdinal()
  .domain([...candidates, null])
  .range([
    "#E8B474",
    "#D889C4",
    "#1E40AF",
    "#E17560",
    "#8B5CF6",
    "#60A5FA",
    "#50D0B0",
    "#D1D5DB",
  ]);

export const scaleColorDarker = scaleOrdinal()
  .domain([...candidates, null])
  .range([
    "#dd9132",
    "#c550a7",
    "#13286e",
    "#ce4227",
    "#5714f2",
    "#167bf8",
    "#2da788",
    "#a6aeb9",
  ]);
