import React, { useState, useMemo } from "react";
import ReactMapGL, { Source, Layer } from "react-map-gl";
import { createFilter } from "react-select";
import WindowedSelect from "react-windowed-select";

import { selectOptionsParish } from "../utils/transformations";

const parishBoundsLayer = {
  id: "pt-parish-outline",
  type: "line",
  paint: {
    "line-width": 1,
    "line-color": "#0080ef",
  },
};

export default function Map() {
  const [selectedParishId, setSelectedParishId] = useState();
  /* const parishGeo = useMemo(
    () =>
      function () {
        const geoSelection = geoPortugal.features.filter(
          (parish) => parish.properties["Dicofre"] === selectedParishId
        )[0];
        console.log(geoSelection);
      },
    selectedParishId
  ); */

  const [viewport, setViewport] = useState({
    latitude: 38.7223,
    longitude: -9.1393,
    zoom: 9,
    bearing: 0,
    pitch: 0,
  });

  const handleSelectChange = (option) => {
    setSelectedParishId(option?.value);
  };

  return (
    <div>
      <div className="flex-row">
        <WindowedSelect
          className="m-4"
          onChange={handleSelectChange}
          isClearable
          isSearchable
          value={
            selectOptionsParish.filter(
              (parish) => parish.value === selectedParishId
            )[0]
          }
          name="map"
          options={selectOptionsParish}
          placeholder="Encontrar uma freguesia"
          filterOption={createFilter({ ignoreAccents: false })}
        />
        {/* <ReactMapGL
          {...viewport}
          width="500px"
          height="500px"
          mapStyle="mapbox://styles/mapbox/light-v10"
          onViewportChange={setViewport}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        >
          <Source id="parish-outline" type="geojson" data={ptGeo}>
            <Layer {...parishBoundsLayer} />
          </Source>
        </ReactMapGL> */}
      </div>
    </div>
  );
}
