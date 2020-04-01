import React, { useReducer, useEffect, useState } from "react";
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
              <div className="column is-two-thirds">
                <Map dispatchMessageToParent={dispatch} mapData={mapData} />
              </div>
              <div className="column is-one-third ">{details}</div>
            </div>
          </div>
          <div className="section">
            <InstitutionsList />
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

const getFetchURL = place =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    place
  )}.json?types=place&access_token=${
    process.env.GATSBY_MAPBOX_API_KEY
  }&limit=1`;

const ProductPage = ({ data }) => {
  const {
    markdownRemark: { frontmatter },
    allAirtable: { nodes }
  } = data;
  const mapData = nodes
    .map(
      (
        { data: { Study, Investigator, Country, City, Affiliation } },
        index
      ) => ({
        study: Study,
        investigator: Investigator,
        country: Country,
        city: City,
        affiliation: Affiliation,
        id: index.toString()
      })
    );

  const [processedMapData, setProcessedMapData] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = mapData.map(({ city, country }) =>
          fetchJSON(getFetchURL(`${city} ${country}`))
        );
        const fetchResult = await Promise.all(promises);
        const fetchedCoords = fetchResult.map(({ features }) => {
          const [lng, lat] = features[0].center;
          return { lng, lat };
        });
        const rawData = _zip(fetchedCoords, mapData).map(
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
    allAirtable(filter: { table: { eq: "Submission" } }) {
      nodes {
        data {
          Study
          Investigator
          Country
          City
          Affiliation
        }
      }
    }
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
