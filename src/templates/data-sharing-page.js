import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/NewLayout";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import DataSharingPageContent from "../components/DataSharingPageContent";

const FaqPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark;
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/data-sharing/");

  return (
    <Layout title={frontmatter.title}>
      {canonicalLinkMetaTag}
      <DataSharingPageContent
        qas={frontmatter.qas}
        dataSharingWorkflowImage={data.dataSharingWorkflowImage}
      />
    </Layout>
  );
};

FaqPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
    dataSharingWorkflowImage: PropTypes.object,
  }),
};

export default FaqPage;

export const pageQuery = graphql`
  query FaqPageTemplate {
    dataSharingWorkflowImage: file(relativePath: { eq: "data_sharing.png" }) {
      childImageSharp {
        fluid(maxWidth: 1000) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    markdownRemark(frontmatter: { templateKey: { eq: "data-sharing-page" } }) {
      frontmatter {
        title
        qas {
          question
          answer
        }
      }
    }
  }
`;
