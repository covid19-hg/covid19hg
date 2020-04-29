import React, { useRef, useEffect, MutableRefObject } from "react";
import {
  Map as MapboxMap,
  Marker,
  Popup,
  NavigationControl,
  LngLatLike,
  Style as MapboxStyle,
} from "mapbox-gl";
import _min from "lodash/min";
import _max from "lodash/max";
import "../mapbox-gl.css";
import { MapDatum } from "../types";
import MapMarker, {
  defaultMarkerWidth,
  defaultMarkerHeight,
  defaultMarkerColor,
  highlightedMarkerColor,
  submittedDataMarkerColor,
} from "./MapMarker";
const mapboxStyles = require("./map.module.css");

const getPlaceLabelsPlaceLabelsMapboxLayer = require("../mapboxLayers/place-labels-place-labels-mapbox-layer");
const getAdministrativeBoundariesAdminMapboxLayer = require("../mapboxLayers/administrative-boundaries-admin-mapbox-layer");
const getLandWaterLandMapboxLayer = require("../mapboxLayers/land-water-land-mapbox-layer.js");
const getLandWaterWaterMapboxLayer = require("../mapboxLayers/land-water-water-mapbox-layer.js");
const getLandWaterBuiltMapboxLayer = require("../mapboxLayers/land-water-built-mapbox-layer.js");

export const SET_SELECTED_INSTITUTION_ACTION = "setSelectedInstitution";
export const UNSET_SELECTED_INSTITUTION_ACTION = "unsetSelectedInstitution";

const markersSourceId = "markers-source";
const streetMapSourceId = "mapbox-streets";
const terrainSourceId = "mapbox-terrain";
const markerLayerId = "markers-layer";
const visibilityFeatureStateName = "isVisible";
export const legendContainerHeight = 3; // in

const createMarker = (args: {
  lng: number;
  lat: number;
  study: string;
  dispatchMessageToParent: any;
  popup: Popup;
  id: string;
  mapboxMap: MapboxMap;
  hasSubmittedData: boolean;
}) => {
  const {
    lng,
    lat,
    study,
    dispatchMessageToParent,
    popup,
    id,
    mapboxMap,
  } = args;
  // Use the default marker but halve the size:
  const marker = new Marker();
  const markerElement = marker.getElement();
  markerElement.style.cursor = "pointer";
  const svg = markerElement.querySelector("svg")!;

  svg.setAttribute("width", `${defaultMarkerWidth / 2}px`);
  svg.setAttribute("height", `${defaultMarkerHeight / 2}px`);

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
  return marker;
};

interface MapboxInfo {
  map: MapboxMap;
  markers: Map<string, MarkerInfo>;
  labelInfo: Map<string, LabelInfo>;
  isStyleLoaded: boolean;
  popup: Popup;
}
interface MarkerInfo {
  marker: Marker;
  lng: number;
  lat: number;
  study: string;
  isInMap: boolean;
  isMarkedAsSelected: boolean;
  hasSubmittedData: boolean;
}
interface LabelInfo {
  geoJsonId: number;
  isVisible: boolean;
}

const initializeMap = (
  el: HTMLDivElement,
  data: MapDatum[],
  dispatchMessageToParent: any
) => {
  const lats = data.map(({ lat }) => lat);
  const lngs = data.map(({ lng }) => lng);
  const southWest: LngLatLike = [_min(lngs)!, _min(lats)!];
  const northEast: LngLatLike = [_max(lngs)!, _max(lats)!];

  const mapboxStyleGeoJsonFeatures: GeoJSON.Feature[] = data.map(
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
    style: mapboxStyle as MapboxStyle,
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

  mapboxMap.on("click", () => {
    // Any click that bubbles up here means it must not have originated inside a marker:
    dispatchMessageToParent({
      type: UNSET_SELECTED_INSTITUTION_ACTION,
    });
  });

  const markers: Map<string, MarkerInfo> = new Map();

  const popup = new Popup({
    closeButton: false,
    closeOnClick: false,
    className: mapboxStyles["mapboxPopup"],
  });

  data.forEach(({ lat, lng, study, id, hasSubmittedData }) => {
    const marker = createMarker({
      lng,
      lat,
      study,
      dispatchMessageToParent,
      popup,
      id,
      mapboxMap,
      hasSubmittedData,
    });
    setMarkerVisibleProperties({ marker, isSelected: false, hasSubmittedData });
    marker.addTo(mapboxMap);
    markers.set(id, {
      marker,
      lng,
      lat,
      study,
      hasSubmittedData,
      isInMap: true,
      isMarkedAsSelected: false,
    });
  });

  const labelInfo = new Map(
    data.map(({ id, geoJsonId }) => [id, { geoJsonId, isVisible: false }])
  );

  const mapboxInfo: MapboxInfo = {
    map: mapboxMap,
    markers,
    labelInfo,
    isStyleLoaded: false,
    popup,
  };

  return mapboxInfo;
};

const selectedMarkerZIndex = 20;
const hasSubmittedDataMarkerZIndex = 10;
const normalMarkerZIndex = 0;

const setMarkerVisibleProperties = (args: {
  marker: Marker;
  isSelected: boolean;
  hasSubmittedData: boolean;
}) => {
  const { marker, isSelected, hasSubmittedData } = args;
  const element = marker.getElement();
  const zIndex = isSelected
    ? selectedMarkerZIndex
    : hasSubmittedData
    ? hasSubmittedDataMarkerZIndex
    : normalMarkerZIndex;
  const color = isSelected
    ? highlightedMarkerColor
    : hasSubmittedData
    ? submittedDataMarkerColor
    : defaultMarkerColor;
  element.querySelector("path")!.parentElement!.setAttribute("fill", color);
  element.style.zIndex = zIndex.toString();
};

const adjustMarkerVisibility = (
  mapboxInfoRef: MutableRefObject<MapboxInfo | undefined>,
  visibleIds: string[],
  dispatchMessageToParent: any,
  selectedId: string | undefined
) => {
  const { current: mapboxInfo } = mapboxInfoRef;
  if (mapboxInfo !== undefined) {
    const { map, popup, markers } = mapboxInfo;

    for (const [id, markerInfo] of markers.entries()) {
      // First reconcile the visibility of the marker:
      if (visibleIds.includes(id) === true && markerInfo.isInMap === false) {
        const { lng, lat, study, hasSubmittedData } = markerInfo;
        const marker = createMarker({
          lng,
          lat,
          study,
          dispatchMessageToParent,
          popup,
          id,
          mapboxMap: map,
          hasSubmittedData,
        });
        marker.addTo(map);
        setMarkerVisibleProperties({
          marker,
          isSelected: selectedId === id,
          hasSubmittedData,
        });
        markerInfo.marker = marker;
        markerInfo.isInMap = true;
      } else if (
        visibleIds.includes(id) === false &&
        markerInfo.isInMap === true
      ) {
        markerInfo.marker.remove();
        markerInfo.isInMap = false;
        markerInfo.isMarkedAsSelected = false;
      }
      // Then reconcile whether the marker is selected:
      if (
        markerInfo.isMarkedAsSelected === false &&
        selectedId === id &&
        markerInfo.isInMap === true
      ) {
        setMarkerVisibleProperties({
          marker: markerInfo.marker,
          isSelected: true,
          hasSubmittedData: markerInfo.hasSubmittedData,
        });
        markerInfo.isMarkedAsSelected = true;
      } else if (
        markerInfo.isMarkedAsSelected === true &&
        selectedId !== id &&
        markerInfo.isInMap === true
      ) {
        setMarkerVisibleProperties({
          marker: markerInfo.marker,
          isSelected: false,
          hasSubmittedData: markerInfo.hasSubmittedData,
        });
        markerInfo.isMarkedAsSelected = false;
      }
    }
  }
};

const adjustLabelVisibility = (
  mapboxInfoRef: MutableRefObject<MapboxInfo | undefined>,
  visibleIds: string[]
) => {
  const { current: mapboxInfo } = mapboxInfoRef;
  if (mapboxInfo !== undefined) {
    const { labelInfo, map, isStyleLoaded } = mapboxInfo;
    if (isStyleLoaded === true) {
      for (const [id, info] of labelInfo.entries()) {
        if (visibleIds.includes(id) === true && info.isVisible === false) {
          map.setFeatureState(
            { source: markersSourceId, id: info.geoJsonId },
            { [visibilityFeatureStateName]: true }
          );
          info.isVisible = true;
        } else if (
          visibleIds.includes(id) === false &&
          info.isVisible === true
        ) {
          map.setFeatureState(
            { source: markersSourceId, id: info.geoJsonId },
            { [visibilityFeatureStateName]: false }
          );
          info.isVisible = false;
        }
      }
    }
  }
};

interface Props {
  dispatchMessageToParent: any;
  mapData: MapDatum[];
  filteredData: MapDatum[];
  selected: string | undefined;
}
const MapComponent = ({
  dispatchMessageToParent,
  mapData,
  filteredData,
  selected,
}: Props) => {
  const mapboxInfoRef = useRef<MapboxInfo | undefined>(undefined);
  const visibleIds = filteredData.map(({ id }) => id).sort();
  const mapElRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const { current: el } = mapElRef;
    if (el !== null) {
      const mapboxInfo = initializeMap(el, mapData, dispatchMessageToParent);
      mapboxInfoRef.current = mapboxInfo;
      mapboxInfo.map.on("load", () => {
        mapboxInfo.isStyleLoaded = true;
        adjustLabelVisibility(mapboxInfoRef, visibleIds);
      });
    }
  }, []);

  useEffect(() => {
    const { current: mapboxInfo } = mapboxInfoRef;
    if (selected !== undefined && mapboxInfo !== undefined) {
      const { map } = mapboxInfo;
      const zoomLevel = map.getZoom();
      const defaultFlyToZoomLevel = 6;
      const { lng, lat } = mapData.find(({ id }) => id === selected)!;
      if (zoomLevel > defaultFlyToZoomLevel) {
        mapboxInfo.map.flyTo({ center: [lng, lat] });
      } else {
        mapboxInfo.map.flyTo({ center: [lng, lat], zoom: 6 });
      }
    }
  }, [selected]);

  useEffect(() => {
    adjustMarkerVisibility(
      mapboxInfoRef,
      visibleIds,
      dispatchMessageToParent,
      selected
    );
    adjustLabelVisibility(mapboxInfoRef, visibleIds);
  }, [visibleIds]);

  const legend = (
    <div
      style={{
        height: `${legendContainerHeight}rem`,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <MapMarker color={defaultMarkerColor} />
      </div>
      <div style={{ marginLeft: "0.5rem" }}> Registered Study </div>

      <div style={{ marginLeft: "1.5rem" }}>
        <MapMarker color={submittedDataMarkerColor} />
      </div>
      <div style={{ marginLeft: "0.5rem" }}>Data Contributor </div>
    </div>
  );

  return (
    <div
      style={{
        height: `calc(${legendContainerHeight}rem + 40vh)`,
        position: "relative",
      }}
    >
      {legend}
      <div style={{ height: "40vh" }} ref={mapElRef} />
    </div>
  );
};

export default MapComponent;
