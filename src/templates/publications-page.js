import React from "react";
import Layout from "../components/NewLayout";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import PublicationsPageContent from "../components/PublicationsPageContent";

import { graphql } from "gatsby";

const PublicationsPage = ({ data }) => {
  const {
    frontmatter: { title, publications_page_intro, studies },
  } = data.markdownRemark;
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/publications/");
  return (
    <Layout title={title}>
      {canonicalLinkMetaTag}
      <PublicationsPageContent
        intro={publications_page_intro}
        publications={studies}
      />
    </Layout>
  );
};

export const pageQuery = graphql`
  query PublicationsPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "publications-page" } }) {
      frontmatter {
        title
        publications_page_intro
        studies {
          posted_date
          name
          links {
            description
            url
          }
          cases_description
          controls_description
          genome_wide_significant_loci
          first_publication
        }
      }
    }
  }
`;

export default PublicationsPage;
