import React from "react";
import PropTypes from "prop-types";
import Layout from "../components/NewLayout";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import ResultsPageContent from "../components/ResultsPageContent";
import { graphql } from "gatsby";

const ResultsPage = ({ data, release }) => {
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/results/");
  const { frontmatter } = data.markdownRemark;
  return (
    <Layout title={frontmatter.title}>
      {canonicalLinkMetaTag}
      <ResultsPageContent releases={frontmatter.releases} />
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
  query ResultsPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "results-page" } }) {
      frontmatter {
        title
        releases {
          title
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
            download {
              name
              gz_url
              tbi_url
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
