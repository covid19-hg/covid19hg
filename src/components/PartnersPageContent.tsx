import {
  MapboxGeocodingResponse,
  AirtableDatum,
  MapDatum,
  ListDatum,
} from "../types";
import React, { useEffect, useState } from "react";
import { fetchJSON } from "../Utils";
import _zip from "lodash/zip";
import _groupBy from "lodash/groupBy";
import _partition from "lodash/partition";
import _flatten from "lodash/flatten";
import Partners from "./Partners";
import _sortBy from "lodash/sortBy";

const getSimpleLocationFetchURL = (locationName: string) =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    locationName.replace(/;/g, " ")
  )}.json?access_token=${process.env.GATSBY_MAPBOX_API_KEY}&limit=1`;

const getInstitutionFetchURL = (
  location: { institution: string; cityCountry: string },
  coords: { lng: number; lat: number }
) => {
  const { institution, cityCountry } = location;
  const { lng, lat } = coords;
  return `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    `${institution}, ${cityCountry}`.replace(/;/g, " ")
  )}.json?access_token=${
    process.env.GATSBY_MAPBOX_API_KEY
  }&proximity=${lng},${lat}&limit=1`;
};

const extractCoordFromFetchResult = ({ features }: MapboxGeocodingResponse) => {
  const [lng, lat] = features[0].center;
  return { lng, lat };
};

interface FetchedPartnersData {
  default: AirtableDatum[];
}

interface Props {
  selectedPartner: string | undefined;
  setSelectedPartner: (selected: string | undefined) => void;
}

const PartnersPageContent = ({
  selectedPartner,
  setSelectedPartner,
}: Props) => {
  const [mapData, setMapData] = useState<MapDatum[] | undefined>(undefined);
  const [listData, setListData] = useState<ListDatum[] | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const airtableData = await (import("../partners.json") as unknown as Promise<FetchedPartnersData>)

        const unsortedListData = airtableData.default.map((elem) => {
          const allTextElems = [];
          if (elem.investigator !== undefined) {
            allTextElems.push(elem.investigator.toLowerCase());
          }
          if (elem.studyDesignUnformatted !== undefined) {
            allTextElems.push(elem.studyDesignUnformatted.toLowerCase());
          }
          if (elem.affiliation !== undefined) {
            allTextElems.push(elem.affiliation.toLowerCase());
          }
          if (elem.city !== undefined) {
            allTextElems.push(elem.city.toLowerCase());
          }
          if (elem.country !== undefined) {
            allTextElems.push(elem.country.toLowerCase());
          }
          if (elem.researchQuestion !== undefined) {
            allTextElems.push(elem.researchQuestion.toLowerCase());
          }
          if (elem.assaysPlanned !== undefined) {
            const allAssaysPlanned = elem.assaysPlanned.map((assay) =>
              assay.toLowerCase()
            );
            allTextElems.push(allAssaysPlanned);
          }
          if (elem.otherAssays !== undefined) {
            allTextElems.push(elem.otherAssays.toLowerCase());
          }
          const allText = _flatten(allTextElems).join(" ");
          return {
            ...elem,
            allText,
          };
        });
        const listData = _sortBy(
          unsortedListData,
          ({ timeCreated }) => timeCreated
        );
        setListData(listData);

        const [
          withExplicitMapLocation,
          withoutExplicitMapLocation,
        ] = _partition(
          listData,
          ({ mapLocation }) => mapLocation !== undefined
        );

        const withExplicitMapLocationFetchResult = await Promise.all<
          MapboxGeocodingResponse
        >(
          withExplicitMapLocation.map(({ mapLocation }) =>
            fetchJSON(getSimpleLocationFetchURL(mapLocation!))
          )
        );
        const withExplicitMapLocationCoords = withExplicitMapLocationFetchResult.map(
          (elem) => extractCoordFromFetchResult(elem)
        );
        const withExplicitMapLocationData = _zip(
          withExplicitMapLocationCoords,
          withExplicitMapLocation
        ).map(([lngLat, datum]) => ({
          ...datum!,
          lng: lngLat!.lng,
          lat: lngLat!.lat,
        }));

        const groupedByCity = _groupBy(
          withoutExplicitMapLocation,
          ({ city, country }) => `${city} ${country}`
        );
        // Split records into cities with one or multiple records. Records in
        // cities that have only one record take the coords of that city.
        // Records in cities with multiple records take the location of the
        // institution (with priority given to coords close to corresponding
        // cities' coords) with fallback to the city if the institution cannot
        // be resolved.
        const [singlesKeyValuePairs, multiplesKeyValuePairs] = _partition(
          Object.entries(groupedByCity),
          ([, value]) => value.length === 1
        );
        const singles = singlesKeyValuePairs.map(([, elem]) => elem[0]);
        const singlesFetchResult = await Promise.all<MapboxGeocodingResponse>(
          singles.map(({ city, country }) =>
            fetchJSON(getSimpleLocationFetchURL(`${city} ${country}`))
          )
        );
        const singlesCoords = singlesFetchResult.map((elem) =>
          extractCoordFromFetchResult(elem)
        );
        const singlesData = _zip(singlesCoords, singles).map(
          ([lngLat, datum]) => ({
            ...datum!,
            lng: lngLat!.lng,
            lat: lngLat!.lat,
          })
        );
        const multiplesDataNested = await Promise.all(
          multiplesKeyValuePairs.map(
            async ([cityCountry, placesInSameCity]) => {
              const cityFetchResult = await fetchJSON<MapboxGeocodingResponse>(
                getSimpleLocationFetchURL(cityCountry)
              );
              const cityCoords = extractCoordFromFetchResult(cityFetchResult);
              return await Promise.all(
                placesInSameCity.map(async (datum) => {
                  let coords;
                  try {
                    const fetchResult = await fetchJSON<
                      MapboxGeocodingResponse
                    >(
                      getInstitutionFetchURL(
                        { institution: datum.affiliation, cityCountry },
                        { lng: cityCoords.lng, lat: cityCoords.lat }
                      )
                    );
                    if (fetchResult.features.length > 0) {
                      coords = extractCoordFromFetchResult(fetchResult);
                    } else {
                      coords = cityCoords;
                    }
                  } catch (e) {
                    coords = cityCoords;
                  }
                  return {
                    ...datum,
                    lng: coords.lng,
                    lat: coords.lat,
                  };
                })
              );
            }
          )
        );
        const multiplesData = _flatten(multiplesDataNested);
        const unsortedMapData = [
          ...withExplicitMapLocationData,
          ...singlesData,
          ...multiplesData,
        ].map((elem, index) => ({ ...elem, geoJsonId: index }));
        const mapData = _sortBy(
          unsortedMapData,
          ({ timeCreated }) => timeCreated
        );
        setMapData(mapData);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  if (selectedPartner !== undefined && listData !== undefined) {
    // Reset selected selected partner id if it's invalid:
    const found = listData.find(({ id }) => id === selectedPartner);
    if (found === undefined) {
      setSelectedPartner(undefined);
    }
  }

  return (
    <Partners
      listData={listData}
      mapData={mapData}
      selectedPartner={selectedPartner}
      setSelectedPartner={setSelectedPartner}
    />
  );
};

export default PartnersPageContent;
