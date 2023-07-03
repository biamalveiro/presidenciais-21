import React from "react";
import { candidatesNames, scaleColor } from "../lib/domain";

export default function Legend() {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-4 text-sm text-gray-600">
      {candidatesNames.map((candidate) => (
        <div key={candidate} className="flex flex-row items-center gap-1">
          <div
            className="h-3 w-3"
            style={{
              backgroundColor: scaleColor(candidate).main,
              borderRadius: "50%",
            }}
          />
          <span>{candidate}</span>
        </div>
      ))}
    </div>
  );
}
