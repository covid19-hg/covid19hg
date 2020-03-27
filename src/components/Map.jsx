import React, { useCallback, useRef } from "react";
import { Map as MapboxMap, Marker, Popup, NavigationControl } from "mapbox-gl";
import _min from "lodash/min";
import _max from "lodash/max";
import "../mapbox-gl.css";

const data = require("../data.json");

const initializeMap = el => {
  const lats = data.map(({ lat }) => lat);
  const lngs = data.map(({ lng }) => lng);
  const southWest = [_min(lngs), _min(lats)];
  const northEast = [_max(lngs), _max(lats)];

  const mapboxMap = new MapboxMap({
    container: el,
    style: "mapbox://styles/huy-nguyen/ck8alo7ay0uck1ipbpmdwggyz",
    accessToken: process.env.GATSBY_MAPBOX_API_KEY,
    renderWorldCopies: false,
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
  // Add zoom controls
  mapboxMap.addControl(
    new NavigationControl({
      showCompass: false
    })
  );

  // Disable map rotation with touch gesture
  mapboxMap.dragRotate.disable();
  mapboxMap.touchZoomRotate.disableRotation();

  return mapboxMap;
};

const addCollaborators = (rawData, mapboxMap) => {
  // These sizes are obtained by inspecting the actual SVG created by Mapbox:
  const defaultWidth = 27;
  const defaultHeight = 41;

  rawData.forEach(({ lat, lng, study_biobank }) => {
    const popup = new Popup({ closeButton: false });
    popup.setLngLat([lng, lat]).setText(study_biobank);

    // Use the default marker but halve the size:
    const marker = new Marker();
    const defaultElement = marker.getElement();
    const svg = defaultElement.querySelector("svg");
    svg.setAttribute("width", `${defaultWidth / 2}px`);
    svg.setAttribute("height", `${defaultHeight / 2}px`);

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
  return <div style={{ height: "50vh" }} ref={mapElRef}></div>;
};

export default App;
