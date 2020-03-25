import React, { useCallback, useRef } from "react";
import { Map as MapboxMap, Marker, Popup } from "mapbox-gl";
import _min from "lodash/min";
import _max from "lodash/max";
import "../mapbox-gl.css"

const data = require("../data.json");

const initializeMap = el => {
  const lats = data.map(({ lat }) => lat);
  const lngs = data.map(({ lng }) => lng);
  const southWest = [_min(lngs), _min(lats)];
  const northEast = [_max(lngs), _max(lats)];

  const mapboxMap = new MapboxMap({
    container: el,
    style: "mapbox://styles/mapbox/light-v10",
    accessToken: process.env.GATSBY_MAPBOX_API_KEY,
    bounds: [southWest, northEast],
    fitBoundsOptions: {
      padding: {
        top: 50,
        right: 50,
        left: 50,
        bottom: 50
      }
    }
  });

  return mapboxMap;
};

const addCollaborators = (rawData, mapboxMap) => {
  rawData.map(({ lat, lng, study_biobank }) => {
    const popup = new Popup({ closeButton: false });
    popup.setLngLat([lng, lat]).setText(study_biobank);

    const marker = new Marker();
    marker.setLngLat([lng, lat]).setPopup(popup);
    marker.addTo(mapboxMap);
  });
};

const App = () => {
  const mapboxMapRef = useRef(undefined);
  const mapElRef = useCallback(el => {
    if (el !== null) {
      const mapboxMap = initializeMap(el);
      mapboxMapRef.current = mapboxMap;
      addCollaborators(data, mapboxMap);
    }
  }, []);
  return (
    <div
      style={{height: "50vh"}}
      ref={mapElRef}
    ></div>
  );
};

export default App;
