import React from "react";
import { candidates, scaleColor } from "../utils/scales";

export default function Legend() {
  return (
    <div className="flex flex-row flex-wrap gap-4 text-gray-600 text-sm justify-center">
      {candidates.map((candidate) => (
        <div className="flex flex-row gap-1 items-center">
          <div
            className="h-3 w-3"
            style={{
              backgroundColor: scaleColor(candidate),
              borderRadius: "50%",
            }}
          />
          <span>{candidate}</span>
        </div>
      ))}
    </div>
  );
}
