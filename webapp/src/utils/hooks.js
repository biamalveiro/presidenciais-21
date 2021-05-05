import { useEffect, useRef, useState } from "react";

export function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

const combineChartDimensions = (dimensions) => {
  let parsedDimensions = {
    marginTop: 40,
    marginRight: 30,
    marginBottom: 40,
    marginLeft: 75,
    ...dimensions,
  };
  return {
    ...parsedDimensions,
    boundedHeight: Math.max(
      parsedDimensions.height -
        parsedDimensions.marginTop -
        parsedDimensions.marginBottom,
      0
    ),
    boundedWidth: Math.max(
      parsedDimensions.width -
        parsedDimensions.marginLeft -
        parsedDimensions.marginRight,
      0
    ),
  };
};
export const useChartDimensions = (passedSettings) => {
  const ref = useRef();
  const dimensions = combineChartDimensions(passedSettings);
  const [width, changeWidth] = useState(0);
  const [height, changeHeight] = useState(0);
  useEffect(() => {
    if (dimensions.width && dimensions.height) return;
    const element = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries)) return;
      if (!entries.length) return;
      const entry = entries[0];
      if (width != entry.contentRect.width)
        changeWidth(entry.contentRect.width);
      if (height != entry.contentRect.height)
        changeHeight(entry.contentRect.height);
    });
    resizeObserver.observe(element);
    return () => resizeObserver.unobserve(element);
  }, []);
  const newSettings = combineChartDimensions({
    ...dimensions,
    width: dimensions.width || width,
    height: dimensions.height || height,
  });
  return [ref, newSettings];
};
