import { format } from "d3-format";

export const formatCount = (value) => format(".2s")(value).replace("k", "m");
