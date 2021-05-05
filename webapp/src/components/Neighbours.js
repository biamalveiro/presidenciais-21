import { isUndefined } from "lodash";
import React, { useState, useEffect } from "react";
import { createFilter } from "react-select";
import WindowedSelect from "react-windowed-select";

import Map from "./Map";
import GroupedBarChart from "./GroupedBarChart";

export default function Neighbours(props) {
  const [selectedParishId, setSelectedParishId] = useState("110660");
  const [parish, setParish] = useState();
  const [neighbor, setNeighbor] = useState();

  const selectOptions = props.parishesList.map((parish) => {
    return {
      value: parish.dicofre,
      label: `${parish.name}, ${parish.county}, ${parish.region}`,
    };
  });

  const loadParishMap = async (dicofre, callback) => {
    const res = await fetch("/api/getParishMap", {
      method: "POST",
      body: JSON.stringify({ dicofre }),
    });
    const parishData = await res.json();
    callback(parishData);
  };

  useEffect(() => {
    if (!isUndefined(selectedParishId)) {
      loadParishMap(selectedParishId, setParish);
    }
  }, [selectedParishId]);

  useEffect(() => {
    if (!isUndefined(parish)) {
      loadParishMap(parish.neighbor, setNeighbor);
    }
  }, [parish]);

  const handleSelectChange = (option) => {
    setSelectedParishId(option?.value);
  };

  return (
    <div className="m-auto w-9/12 mt-28 mb-10">
      <div className=" flex flex-col w-4/12">
        <h3 className="font-bold text-2xl mx-4">Encontrar um vizinho</h3>
        <WindowedSelect
          className="m-4"
          onChange={handleSelectChange}
          isClearable
          isSearchable
          value={
            selectOptions.filter(
              (parish) => parish.value === selectedParishId
            )[0]
          }
          name="map"
          options={selectOptions}
          placeholder="Escolher uma freguesia"
          filterOption={createFilter({ ignoreAccents: false })}
        />
      </div>
      {!isUndefined(parish) && !isUndefined(neighbor) ? (
        <div className="flex flex-row ml-4 justify-center">
          <Map parish={parish} color={"#3B82F6"} />
          <GroupedBarChart
            parish={{ color: "#3B82F6", ...parish }}
            neighbor={{ color: "#7C3AED", ...neighbor }}
          />
          <Map parish={neighbor} color={"#7C3AED"} />
        </div>
      ) : null}
    </div>
  );
}
