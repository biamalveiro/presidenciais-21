import { isUndefined } from "lodash";
import React, { useState, useEffect } from "react";
import { createFilter } from "react-select";
import WindowedSelect from "react-windowed-select";

import Map from "./Map";
import GroupedBarChart from "./GroupedBarChart";
import { scaleColor, scaleColorDarker } from "../utils/scales";

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
      <h3 className="font-semibold text-2xl mx-4 mb-2">
        🏡 Encontrar um vizinho eleitoral
      </h3>
      <p className="mx-4 text-gray-600 text-sm w-1/2 mb-4">
        Escolhe uma freguesia e descobre qual é o seu vizinho eleitoral mais
        próximo - a freguesia com a distribuição de votos mais parecida à
        distribuição da freguesia escolhida.
      </p>
      <div className=" flex flex-col w-4/12">
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
          <Map parish={parish} color={scaleColor(parish.outlier)} />
          <GroupedBarChart
            parish={{ color: scaleColor(parish.outlier), ...parish }}
            neighbor={{
              color: scaleColorDarker(neighbor.outlier),
              ...neighbor,
            }}
          />
          <Map parish={neighbor} color={scaleColorDarker(neighbor.outlier)} />
        </div>
      ) : null}
    </div>
  );
}
