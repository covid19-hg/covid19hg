import React from "react";
import Layout from "../components/NewLayout";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import MediaPageContent from "../components/MediaPageContent";

const MediaPage = ({ data }) => {
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/media/");
  const {
    markdownRemark: {
      frontmatter: { title, articles },
    },
  } = data;
  return (
    <Layout title={title}>
      {canonicalLinkMetaTag}
      <MediaPageContent articles={articles} />
    </Layout>
  );
};

MediaPage.propTypes = {
  data: PropTypes.object,
};

export default MediaPage;

export const pageQuery = graphql`
  query MediaPage {
    markdownRemark(frontmatter: { templateKey: { eq: "media-page" } }) {
      frontmatter {
        title
        articles {
          title
          url
          source
          date
        }
      }
    }
  }
`;
