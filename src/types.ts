export interface AirtableDatum {
  study: string;
  investigator: string;
  affiliation: string;
  country: string;
  city: string;
  studyLink: string;
  retrospective: boolean | undefined;
  prospective: boolean | undefined;
  retrospectiveSampleSize: number | undefined;
  prospectiveSampleSize: number | undefined;
  genotyping: boolean;
  wes: boolean;
  wgs: boolean;
  assaysPlanned: string[];
  otherAssays: string;
  researchQuestion: string;
  studyDesignUnformatted: string;
  researchCategory: string[];
  timeCreated: number;
  mapLocation: string | undefined;
  id: string;
  shouldShowContactButton: boolean;
  hasSubmittedData: boolean;
}

export interface ListDatum extends AirtableDatum {
  allText: string;
}

export interface MapDatum extends ListDatum {
  lng: number;
  lat: number;
  geoJsonId: number;
}

// https://docs.mapbox.com/api/search/#geocoding-response-object
export interface MapboxGeocodingResponse {
  type: string;
  query: string[];
  attribution: string;
  features: MapboxGeocodingFeature[];
}

interface MapboxGeocodingFeature {
  id: string;
  type: string;
  place_type: string;
  relevance: number;
  center: [number, number];
}

export type ContributorDatum = {
  contributor: string;
  role: string;
  affiliation: string;
  affiliationLink: string | undefined;
  id: string;
} & ({ studyIds: string[] } | { adhocGroup: string });
