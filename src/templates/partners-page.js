import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import { fetchJSON } from "../Utils";
import _zip from "lodash/zip";
import _groupBy from "lodash/groupBy";
import _partition from "lodash/partition";
import _flatten from "lodash/flatten";
import Partners from "../components/Partners";

const getCityFetchURL = (cityCountry) =>
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
    markdownRemark: { frontmatter },
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
        const groupedByCity = _groupBy(
          airtableData.data,
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
        const singlesCoords = singlesFetchResult.map((elem) =>
          extractCoordFromFetchResult(elem)
        );
        const singlesData = _zip(
          singlesCoords,
          singles
        ).map(([{ lng, lat }, datum]) => ({ ...datum, lng, lat }));
        const multiplesDataNested = await Promise.all(
          multiplesKeyValuePairs.map(
            async ([cityCountry, placesInSameCity]) => {
              const cityFetchResult = await fetchJSON(
                getCityFetchURL(cityCountry)
              );
              const cityCoords = extractCoordFromFetchResult(cityFetchResult);
              return await Promise.all(
                placesInSameCity.map(async (datum) => {
                  let coords;
                  try {
                    const fetchResult = await fetchJSON(
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
        const merged = [...singlesData, ...multiplesData].map((elem, index) => {
          const allText = _flatten([
            ("investigator" in elem) ? elem.investigator.toLowerCase() : [],
            ("studyDesignUnformatted" in elem) ? elem.studyDesignUnformatted.toLowerCase() : [],
            ("affiliation" in elem) ? elem.affiliation.toLowerCase() : [],
            ("city" in elem) ? elem.city.toLowerCase() : [],
            ("country" in elem) ? elem.country.toLowerCase() : [],
            ("country" in elem) ? elem.country.toLowerCase() : [],
            "researchQuestion" in elem
              ? elem.researchQuestion.toLowerCase()
              : [],
            elem.study.toLowerCase(),
            "assaysPlanned" in elem
              ? elem.assaysPlanned.map((assay) => assay.toLowerCase())
              : [],
            "otherAssays" in elem ? elem.otherAssays.toLowerCase() : [],
          ]).join(" ");
          return {
            ...elem,
            geoJsonId: index,
            allText,
          };
        });

        setProcessedMapData(merged);
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
      <Partners title={frontmatter.title} mapData={processedMapData} />
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
      frontmatter: PropTypes.object,
    }),
  }),
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
