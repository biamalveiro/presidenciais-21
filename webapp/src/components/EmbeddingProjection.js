import React, { useState } from "react";
import { createFilter } from "react-select";
import WindowedSelect from "react-windowed-select";

import Scatterplot from "./Scatterplot";
import BarChart from "./BarChart";

function EmbeddingProjection(props) {
  const [activeParishId, setActiveParishId] = useState();

  const handleSelectChange = (option) => {
    setActiveParishId(option?.value);
  };

  const selectOptions = props.parishesList.map((parish) => {
    return {
      value: parish.dicofre,
      label: `${parish.name}, ${parish.county}, ${parish.region}`,
    };
  });

  return (
    <div className="relative w-9/12 m-auto mt-12">
      <div className="flex flex-row">
        <div className=" w-3/4">
          <Scatterplot
            activeParishId={activeParishId}
            setActiveParishId={setActiveParishId}
          />
        </div>
        <div className="shadow rounded border w-1/4">
          <WindowedSelect
            className="m-4"
            onChange={handleSelectChange}
            isClearable
            isSearchable
            value={
              selectOptions.filter(
                (parish) => parish.value === activeParishId
              )[0]
            }
            name="parish"
            options={selectOptions}
            placeholder="Encontrar uma freguesia"
            filterOption={createFilter({ ignoreAccents: false })}
          />
          <BarChart activeParishId={activeParishId} />
        </div>
      </div>
    </div>
  );
}

export default EmbeddingProjection;
