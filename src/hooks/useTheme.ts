import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config.js";

const fullConfig = resolveConfig(tailwindConfig);
const useTheme = () => {
  return fullConfig.theme;
};

export default useTheme;
