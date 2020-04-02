import React, { useCallback, useRef } from "react";
import { Map as MapboxMap, Marker, Popup, NavigationControl } from "mapbox-gl";
import _min from "lodash/min";
import _max from "lodash/max";
import "../mapbox-gl.css";
import getPlaceLabelsPlaceLabelsMapboxLayer from "../mapboxLayers/place-labels-place-labels-mapbox-layer";
import getAdministrativeBoundariesAdminMapboxLayer from "../mapboxLayers/administrative-boundaries-admin-mapbox-layer";
import getLandWaterLandMapboxLayer from "../mapboxLayers/land-water-land-mapbox-layer.js";
import getLandWaterWaterMapboxLayer from "../mapboxLayers/land-water-water-mapbox-layer.js";
import getLandWaterBuiltMapboxLayer from "../mapboxLayers/land-water-built-mapbox-layer.js";

export const SET_SELECTED_INSTITUTION_ACTION = "setSelectedInstitution";
export const UNSET_SELECTED_INSTITUTION_ACTION = "unsetSelectedInstitution";

const initializeMap = (el, data) => {
  const lats = data.map(({ lat }) => lat);
  const lngs = data.map(({ lng }) => lng);
  const southWest = [_min(lngs), _min(lats)];
  const northEast = [_max(lngs), _max(lats)];

  const mapboxStyleGeoJsonFeatures = data.map(
    ({ lat, lng, id, study_biobank }) => ({
      type: "Feature",
      id,
      properties: {
        study_biobank
      },
      geometry: {
        type: "Point",
        coordinates: [lng, lat]
      }
    })
  );
  const markersSourceId = "markers-source";
  const streetMapSourceId = "mapbox-streets"
  const terrainSourceId = "mapbox-terrain"
  const mapboxStyle = {
    version: 8,
    glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    sources: {
      [streetMapSourceId]: {
        type: "vector",
        url: "mapbox://mapbox.mapbox-streets-v8"
      },
      [terrainSourceId]: {
        type: "vector",
        url: "mapbox://mapbox.mapbox-terrain-v2"
      },
      [markersSourceId]: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: mapboxStyleGeoJsonFeatures
        }
      }
    },
    layers: [
      ...getLandWaterLandMapboxLayer(streetMapSourceId, terrainSourceId),
      ...getLandWaterWaterMapboxLayer(streetMapSourceId),
      ...getLandWaterBuiltMapboxLayer(streetMapSourceId),
      ...getPlaceLabelsPlaceLabelsMapboxLayer(streetMapSourceId),
      ...getAdministrativeBoundariesAdminMapboxLayer(streetMapSourceId),
      {
        id: "mapbox-studio-data-ch3fyp",
        type: "symbol",
        source: markersSourceId,
        layout: {
          "text-field": ["to-string", ["get", "study_biobank"]],
          "text-size": 14,
          "text-justify": "left",
          "text-anchor": "bottom-left"
        },
        paint: { "text-translate": [9, 0] }
      }
    ]
  };

  const mapboxMap = new MapboxMap({
    container: el,
    style: mapboxStyle,
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
