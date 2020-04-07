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
import { useEffect } from "react";

export const SET_SELECTED_INSTITUTION_ACTION = "setSelectedInstitution";
export const UNSET_SELECTED_INSTITUTION_ACTION = "unsetSelectedInstitution";

const markersSourceId = "markers-source";
const streetMapSourceId = "mapbox-streets";
const terrainSourceId = "mapbox-terrain";
const markerLayerId = "markers-layer";
const visibilityFeatureStateName = "isVisible";

const initializeMap = (el, data, dispatchMessageToParent) => {
  const lats = data.map(({ lat }) => lat);
  const lngs = data.map(({ lng }) => lng);
  const southWest = [_min(lngs), _min(lats)];
  const northEast = [_max(lngs), _max(lats)];

  const mapboxStyleGeoJsonFeatures = data.map(
    ({ lat, lng, geoJsonId, study, id }) => ({
      type: "Feature",
      // Note: ID of GeoJSON feature has to be an integer or string convertible
      // to an integer for feature-state to work
      // https://docs.mapbox.com/mapbox-gl-js/style-spec/expressions/#feature-state
      id: geoJsonId,
      properties: {
        study,
        recordId: id,
      },
      geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
    })
  );
  const mapboxStyle = {
    version: 8,
    glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    sources: {
      [streetMapSourceId]: {
        type: "vector",
        url: "mapbox://mapbox.mapbox-streets-v8",
      },
      [terrainSourceId]: {
        type: "vector",
        url: "mapbox://mapbox.mapbox-terrain-v2",
      },
      [markersSourceId]: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: mapboxStyleGeoJsonFeatures,
        },
      },
    },
    layers: [
      ...getLandWaterLandMapboxLayer(streetMapSourceId, terrainSourceId),
      ...getLandWaterWaterMapboxLayer(streetMapSourceId),
      ...getLandWaterBuiltMapboxLayer(streetMapSourceId),
      ...getPlaceLabelsPlaceLabelsMapboxLayer(streetMapSourceId),
      ...getAdministrativeBoundariesAdminMapboxLayer(streetMapSourceId),
      {
        id: markerLayerId,
        type: "symbol",
        source: markersSourceId,
        layout: {
          "text-field": ["to-string", ["get", "study"]],
          "text-size": 14,
          "text-justify": "left",
          "text-anchor": "bottom-left",
        },
        paint: {
          "text-translate": [9, 0],
          "text-opacity": [
            "case",
            ["boolean", ["feature-state", visibilityFeatureStateName]],
            1,
            0,
          ],
        },
      },
    ],
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
        bottom: 50,
      },
    },
  });
  // Add zoom controls
  mapboxMap.addControl(
    new NavigationControl({
      showCompass: false,
    })
  );

  // Disable map rotation with touch gesture
  mapboxMap.dragRotate.disable();
  mapboxMap.touchZoomRotate.disableRotation();

  mapboxMap.on("click", (event) => {
    // Any click that bubbles up here means it must not have originated inside a marker:
    dispatchMessageToParent({
      type: UNSET_SELECTED_INSTITUTION_ACTION,
    });
  });


  const markers = new Map();

  const popup = new Popup({
    closeButton: false,
    closeOnClick: false,
  });

  data.forEach(({ lat, lng, study, id }) => {
    // Use the default marker but halve the size:
    const marker = new Marker();
    marker.setPopup(popup);
    const markerElement = marker.getElement();
    markerElement.style.cursor = "pointer";
    const svg = markerElement.querySelector("svg");

    // These sizes are obtained by inspecting the actual SVG created by Mapbox:
    const defaultWidth = 27;
    const defaultHeight = 41;
    svg.setAttribute("width", `${defaultWidth / 2}px`);
    svg.setAttribute("height", `${defaultHeight / 2}px`);

    markerElement.addEventListener("click", (event) => {
      // Need to `stopPropagation` so that it doesn't bubble up to the map and
      // dispatch the "unsetSelectedInstitution" action
      event.stopPropagation();
      dispatchMessageToParent({
        type: SET_SELECTED_INSTITUTION_ACTION,
        payload: {
          id,
        },
      });
    });
    markerElement.addEventListener("mouseenter", (event) => {
      event.stopPropagation();
      popup
        .setLngLat([lng, lat])
        .setHTML(study)
        .addTo(mapboxMap);
    });
    markerElement.addEventListener("mouseleave", (event) => {
      event.stopPropagation();
      popup.remove();
    });

    marker.setLngLat([lng, lat]).setPopup(popup);
    markers.set(id, {
      marker,
      isInMap: false,
    });
  });

  const labelInfo = new Map(
    data.map(({ id, geoJsonId }) => [id, { geoJsonId, isVisible: false }])
  );

  const mapboxInfo = {
    map: mapboxMap,
    markers,
    labelInfo,
    isStyleLoaded: false,
  };

  return mapboxInfo;
};

const adjustVisibleMarkers = (mapboxInfoRef, visibleIds) => {
  const { current: mapboxInfo } = mapboxInfoRef;
  for (const [id, markerInfo] of mapboxInfo.markers.entries()) {
    if (visibleIds.includes(id) === true && markerInfo.isInMap === false) {
      markerInfo.marker.addTo(mapboxInfo.map);
      markerInfo.isInMap = true;
    } else if (
      visibleIds.includes(id) === false &&
      markerInfo.isInMap === true
    ) {
      markerInfo.marker.remove();
      markerInfo.isInMap = false;
    }
  }

  const { labelInfo, map, isStyleLoaded } = mapboxInfo;
  if (isStyleLoaded === true) {
    for (const [id, info] of labelInfo.entries()) {
      if (visibleIds.includes(id) === true && info.isVisible === false) {
        map.setFeatureState(
          { source: markersSourceId, id: info.geoJsonId },
          { [visibilityFeatureStateName]: true }
        );
        info.isVisible = true;
      } else if (visibleIds.includes(id) === false && info.isVisible === true) {
        map.setFeatureState(
          { source: markersSourceId, id: info.geoJsonId },
          { [visibilityFeatureStateName]: false }
        );
        info.isVisible = false;
      }
    }
  }
};

const MapComponent = ({ dispatchMessageToParent, mapData, filteredData }) => {
  const mapboxInfoRef = useRef(undefined);
  const visibleIds = filteredData.map(({ id }) => id).sort();

  const mapElRef = useCallback(
    (el) => {
      if (el !== null) {
        const mapboxInfo = initializeMap(el, mapData, dispatchMessageToParent);
        mapboxInfoRef.current = mapboxInfo;
        adjustVisibleMarkers(mapboxInfoRef, visibleIds);
        mapboxInfo.map.on("load", () => {
          mapboxInfo.isStyleLoaded = true;
          adjustVisibleMarkers(mapboxInfoRef, visibleIds);
        });
      }
    },
    [dispatchMessageToParent, mapData, visibleIds]
  );

  useEffect(() => {
    adjustVisibleMarkers(mapboxInfoRef, visibleIds);
  }, [visibleIds]);

  return <div style={{ height: "50vh" }} ref={mapElRef}></div>;
};

export default MapComponent;
