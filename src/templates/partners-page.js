import React, { useReducer, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import Map, {
  SET_SELECTED_INSTITUTION_ACTION,
  UNSET_SELECTED_INSTITUTION_ACTION
} from "../components/Map";
import InstitutionsList from "../components/InstitutionsList";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import { fetchJSON } from "../Utils";
import _zip from "lodash/zip";
import _groupBy from "lodash/groupBy";
import _partition from "lodash/partition";
import _flatten from "lodash/flatten";
import _sortBy from "lodash/sortBy";

const reducer = (state, action) => {
  switch (action.type) {
    case SET_SELECTED_INSTITUTION_ACTION:
      return action.id;
    case UNSET_SELECTED_INSTITUTION_ACTION:
      return undefined;
    default:
      return state;
  }
};

export const ProductPageTemplate = ({ title, mapData }) => {
  const [state, dispatch] = useReducer(reducer, undefined);

  let details;
  if (state === undefined) {
    details = null;
  } else {
    const info = mapData.find(({ id }) => id === state);
    details = (
      <>
        <h2 className="title is-4">Study</h2>
        <p>{info.study_biobank}</p>
        <h2 className="title is-4">Location</h2>
        <p>{info.city_country}</p>
        <h2 className="title is-4">Coordinators</h2>
        <p>{info.coordinator}</p>
        <h2 className="title is-4">Affiliation</h2>
        <p>{info.affiliation}</p>
      </>
    );
  }

  return (
    <div className="content">
      <div>
        <h1
          className="has-text-weight-bold is-size-1"
          style={{
            boxShadow: "0.5rem 0 0 #f40, -0.5rem 0 0 #f40",
            backgroundColor: "#142166",
            color: "white",
            padding: "1rem"
          }}
        >
          {title}
        </h1>
      </div>
      <section className="section section--gradient">
        <div className="container">
          <div className="section">
            <div className="columns">
              <div className="column is-three-quarters">
                <Map dispatchMessageToParent={dispatch} mapData={mapData} />
              </div>
              <div className="column is-one-quarter">{details}</div>
            </div>
          </div>
          <div className="section">
            <InstitutionsList mapData={mapData}/>
          </div>
        </div>
        <center>
          <p>
            <strong>Website team: </strong> Matthew Solomonson, Huy Nguyen
          </p>
        </center>
      </section>
    </div>
  );
};

ProductPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string
};

const getCityFetchURL = cityCountry =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    cityCountry
  )}.json?access_token=${process.env.GATSBY_MAPBOX_API_KEY}&limit=1`;

const getInstitutionFetchURL = ({ institution, cityCountry }, { lng, lat }) =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    `${institution}, ${cityCountry}`
  )}.json?access_token=${
    process.env.GATSBY_MAPBOX_API_KEY
  }&proximity=${lng},${lat}&limit=1`;

const ProductPage = ({ data }) => {
  const {
    markdownRemark: { frontmatter }
  } = data;

  const [processedMapData, setProcessedMapData] = useState(undefined);

  const extractCoordFromFetchResult = ({ features }) => {
    const [lng, lat] = features[0].center;
    return { lng, lat };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const airtableData = await fetchJSON("/.netlify/functions/partners");
        const withIds = airtableData.data.map(
          ({ Study, Investigator, Affiliation, City, Country }, index) => ({
            study: Study,
            investigator: Investigator,
            country: Country,
            city: City,
            affiliation: Affiliation,
            id: index.toString()
          })
        );
        const groupedByCity = _groupBy(
          withIds,
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
        const singlesFetchResult = await Promise.all(
          singles.map(({ city, country }) =>
            fetchJSON(getCityFetchURL(`${city} ${country}`))
          )
        );
        const singlesCoords = singlesFetchResult.map(elem =>
          extractCoordFromFetchResult(elem)
        );
        const singlesData = _zip(singlesCoords, singles).map(
          ([
            { lng, lat },
            { affiliation, city, country, id, investigator, study }
          ]) => ({
            lng,
            lat,
            study_biobank: study,
            coordinator: investigator,
            city_country: `${city}, ${country}`,
            id,
            affiliation
          })
        );
        const multiplesDataNested = await Promise.all(
          multiplesKeyValuePairs.map(
            async ([cityCountry, placesInSameCity]) => {
              const cityFetchResult = await fetchJSON(
                getCityFetchURL(cityCountry)
              );
              const cityCoords = extractCoordFromFetchResult(cityFetchResult);
              return await Promise.all(
                placesInSameCity.map(
                  async ({
                    affiliation,
                    city,
                    country,
                    id,
                    investigator,
                    study
                  }) => {
                    let coords;
                    try {
                      const fetchResult = await fetchJSON(
                        getInstitutionFetchURL(
                          { institution: affiliation, cityCountry },
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
                      lng: coords.lng,
                      lat: coords.lat,
                      study_biobank: study,
                      coordinator: investigator,
                      city_country: `${city}, ${country}`,
                      id,
                      affiliation
                    };
                  }
                )
              );
            }
          )
        );
        const multiplesData = _flatten(multiplesDataNested);
        const rawData = _sortBy(
          [...singlesData, ...multiplesData],
          ({ id }) => id
        );

        setProcessedMapData(rawData);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  let mainContent;
  if (processedMapData === undefined) {
    mainContent = null;
  } else {
    mainContent = (
      <ProductPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
        mapData={processedMapData}
      />
    );
  }

  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/partners/");

  return (
    <Layout>
      {canonicalLinkMetaTag}
      {mainContent}
    </Layout>
  );
};

ProductPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object
    })
  })
};

export default ProductPage;

export const productPageQuery = graphql`
  query PartnersPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        image {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        heading
        description
        intro {
          blurbs {
            image {
              childImageSharp {
                fluid(maxWidth: 240, quality: 64) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            text
          }
          heading
          description
        }
      }
    }
  }
`;
