import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/NewLayout";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import {
  partnersRoute,
  getSelectedPartner,
  setSelectedPartner,
} from "../components/partnersPageUtils";
import PartnersPageContent from "../components/PartnersPageContent";

const ProductPage = ({ data, location }) => {
  const {
    markdownRemark: { frontmatter },
  } = data;

  const selectedPartner = getSelectedPartner(location);
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag(`/${partnersRoute}/`);

  return (
    <Layout title="Partners">
      {canonicalLinkMetaTag}
      <PartnersPageContent
        selectedPartner={selectedPartner}
        setSelectedPartner={setSelectedPartner}
      />
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
