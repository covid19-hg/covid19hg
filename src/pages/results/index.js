import React from "react"
import Layout from "../../components/NewLayout";
import useCanonicalLinkMetaTag from "../../components/useCanonicalLinkMetaTag";
import ResultsPageContent from "../../components/ResultsPageContent";
import last from "lodash/last"

const LatestResultsPage = ({data}) => {
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/results/");
  const releases = data.allMarkdownRemark.edges.map(elem => elem.node)
  const latestRelease = last(releases)
  const latestReleaseData = latestRelease.frontmatter.release
  return (
    <Layout title={latestRelease.frontmatter.title}>
      {canonicalLinkMetaTag}
      <ResultsPageContent release={latestReleaseData} />
    </Layout>
  );
};

export default LatestResultsPage;

export const pageQuery = graphql`
  query LatestResultsPage {
    allMarkdownRemark(
      filter: { frontmatter: { templateKey: { eq: "results-page" } } }
    ) {
      edges {
        node {
          id
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
    }
  }
`;
