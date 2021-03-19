import { scaleOrdinal } from "d3-scale";

export const scaleColor = scaleOrdinal()
  .domain([
    "Vitorino Silva",
    "Marcelo Rebelo de Sousa",
    "Ana Gomes",
    "André Ventura",
    "João Ferreira",
    "Marisa Matias",
    "Tiago Mayan Gonçalves",
    null,
  ])
  .range([
    "#50D0B0",
    "#E8B474",
    "#D889C4",
    "#1E40AF",
    "#E17560",
    "#8B5CF6",
    "#60A5FA",
    "#D1D5DB",
  ]);
