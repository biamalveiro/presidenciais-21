import { isUndefined } from "lodash";
import React, { useState, useEffect } from "react";
import ReactMapGL, { Source, Layer, WebMercatorViewport } from "react-map-gl";
import { createFilter } from "react-select";
import WindowedSelect from "react-windowed-select";
import * as turf from "@turf/turf";

import { scaleColor } from "../utils/scales";

export default function Map(props) {
  const parishBoundsLayer = {
    id: `%{props.parish.name}-outline`,
    type: "line",
    paint: {
      "line-width": 1,
      "line-color": props.color,
    },
  };

  const parishFillLayer = {
    id: `%{props.parish.name}-fill`,
    type: "fill",
    paint: {
      "fill-opacity": 0.1,
      "fill-color": props.color,
      "fill-outline-color": props.color,
    },
  };

  const [viewport, setViewport] = useState({
    latitude: 38.7223,
    longitude: -9.1393,
    zoom: 9,
    bearing: 0,
    pitch: 0,
    width: window.innerWidth * 0.15 * 1.8,
    height: window.innerWidth * 0.15,
  });

  const moveViewport = () => {
    const [minLng, minLat, maxLng, maxLat] = turf.bbox(
      JSON.parse(props.parish.map)
    );
    const vp = new WebMercatorViewport(viewport);
    const { longitude, latitude, zoom } = vp.fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat],
      ],
      {
        padding: 20,
      }
    );

    setViewport({
      ...viewport,
      longitude,
      latitude,
      zoom,
    });
  };

  useEffect(() => {
    moveViewport();
  }, []);

  useEffect(() => {
    moveViewport();
  }, [props.parish]);

  return (
    <div className="flex flex-col">
      <div className="my-2">
        <h1 className="font-bold">{props.parish.name}</h1>
        <p className="text-xs	">
          {props.parish.county}, {props.parish.region}
        </p>
      </div>
      <ReactMapGL
        {...viewport}
        mapStyle="mapbox://styles/mapbox/light-v10"
        onViewportChange={setViewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      >
        <Source
          id={`parish-source`}
          type="geojson"
          data={JSON.parse(props.parish.map)}
        >
          <Layer {...parishFillLayer} />
          <Layer {...parishBoundsLayer} />
        </Source>
      </ReactMapGL>
    </div>
  );
}
