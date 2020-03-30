import React, { useReducer } from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import Map, {
  SET_SELECTED_INSTITUTION_ACTION,
  UNSET_SELECTED_INSTITUTION_ACTION
} from "../components/Map";
import InstitutionsList from "../components/InstitutionsList";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";

const data = require("../data.json");

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

export const ProductPageTemplate = ({ title }) => {
  const [state, dispatch] = useReducer(reducer, undefined);

  let details;
  if (state === undefined) {
    details = null;
  } else {
    const info = data.find(({ id }) => id === state);
    details = (
      <>
        <h2 className="title is-4">Institute</h2>
        <p>{info.study_biobank}</p>
        <h2 className="title is-4">Location</h2>
        <p>{info.city_country}</p>
        <h2 className="title is-4">Coordinators</h2>
        <p>{info.coordinator}</p>
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
                <Map dispatchMessageToParent={dispatch} />
              </div>
              <div className="column is-one-third ">{details}</div>
            </div>
          </div>
          <div className="section">
            <InstitutionsList />
          </div>
        </div>
      </section>
    </div>
  );
};

ProductPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string
};

const ProductPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark;
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/partners/");

  return (
    <Layout>
      {canonicalLinkMetaTag}
      <ProductPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
      />
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
  query ProductPage($id: String!) {
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
