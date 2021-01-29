import React from "react";
import PropTypes from "prop-types";
import Layout from "../components/NewLayout";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import ResultsPageContent from "../components/ResultsPageContent";
import { graphql } from "gatsby";

const ResultsPage = ({data}) => {
  const {markdownRemark: {frontmatter}} = data
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag(data.markdownRemark.fields.slug);
  return (
    <Layout title={frontmatter.title}>
      {canonicalLinkMetaTag}
      <ResultsPageContent release={frontmatter.release} />
    </Layout>
  );
};

ResultsPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
};
export default ResultsPage;

export const pageQuery = graphql`
  query ResultsPageTemplate($id: String) {
    markdownRemark(id: { eq: $id }) {
      id
      fields {
        slug
      }
      frontmatter {
        title
        release {
          date
          notes
          data_columns {
            column
            description
          }
          authors {
            name
            study
            affiliation
          }
          studyAbbreviations {
            abbreviation
            full_name
          }
          analyses {
            name
            phenotype
            population
            includes23AndMe
            downloads {
              name
              description
              url
            }
            studies {
              study
              cases
              controls
            }
            manhattan {
              image {
                publicURL
              }
            }
            manhattan_loglog {
              image {
                publicURL
              }
            }
            qqplot {
              image {
                publicURL
              }
            }
          }
        }
      }
    }
  }
`;
