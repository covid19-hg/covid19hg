import React, { useCallback, useRef } from "react";
import { Map as MapboxMap, Marker, Popup, NavigationControl } from "mapbox-gl";
import _min from "lodash/min";
import _max from "lodash/max";
import "../mapbox-gl.css";

export const SET_SELECTED_INSTITUTION_ACTION = "setSelectedInstitution";
export const UNSET_SELECTED_INSTITUTION_ACTION = "unsetSelectedInstitution";

const initializeMap = (el, data) => {
  const lats = data.map(({ lat }) => lat);
  const lngs = data.map(({ lng }) => lng);
  const southWest = [_min(lngs), _min(lats)];
  const northEast = [_max(lngs), _max(lats)];

  const mapboxMap = new MapboxMap({
    container: el,
    style: "mapbox://styles/huy-nguyen/ck8aqzc8n0x4d1int7403icph",
    accessToken: process.env.GATSBY_MAPBOX_API_KEY,
    renderWorldCopies: false,
    bounds: [southWest, northEast],
    minZoom: 1.2,
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

const addCollaborators = async (
  rawData,
  mapboxMap,
  dispatchMessageToParent
) => {
  // These sizes are obtained by inspecting the actual SVG created by Mapbox:
  const defaultWidth = 27;
  const defaultHeight = 41;

  rawData.forEach(({ lat, lng, study_biobank, id }) => {
    const popup = new Popup({ closeButton: false });
    popup.setLngLat([lng, lat]).setText(study_biobank);

    // Use the default marker but halve the size:
    const marker = new Marker();
    const markerElement = marker.getElement();
    markerElement.style.cursor = "pointer";
    const svg = markerElement.querySelector("svg");
    svg.setAttribute("width", `${defaultWidth / 2}px`);
    svg.setAttribute("height", `${defaultHeight / 2}px`);

    markerElement.addEventListener("click", event => {
      // Need to `stopPropagation` so that it doesn't bubble up to the map and
      // dispatch the "unsetSelectedInstitution" action
      event.stopPropagation();
      dispatchMessageToParent({
        type: SET_SELECTED_INSTITUTION_ACTION,
        id
      });
    });

    marker.setLngLat([lng, lat]).setPopup(popup);
    marker.addTo(mapboxMap);
  });

  mapboxMap.on("click", event => {
    // Any click that bubbles up here means it must not have originated inside a marker:
    dispatchMessageToParent({
      type: UNSET_SELECTED_INSTITUTION_ACTION
    });
  });
};

const Map = ({ dispatchMessageToParent, mapData }) => {
  const mapboxMapRef = useRef(undefined);
  const mapElRef = useCallback(
    el => {
      if (el !== null) {
        const mapboxMap = initializeMap(el, mapData);
        mapboxMapRef.current = mapboxMap;
        addCollaborators(mapData, mapboxMap, dispatchMessageToParent);
      }
    },
    [dispatchMessageToParent, mapData]
  );
  return <div style={{ height: "50vh" }} ref={mapElRef}></div>;
};

export default Map;
