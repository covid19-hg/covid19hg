import React from "react";
import Layout from "../components/NewLayout";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import InSilicoFollowUpPageContent from "../components/InSilicoFollowUpPageContent";
import { graphql } from "gatsby";

const InSilicoFollowUpPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark;
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/in-silico-follow-up/");
  return (
    <Layout title={frontmatter.title}>
      {canonicalLinkMetaTag}
      <InSilicoFollowUpPageContent
        title={frontmatter.title}
        releases={frontmatter.releases}
      />
    </Layout>
  );
};

export const pageQuery = graphql`
  query InSilicoPageTemplate {
    markdownRemark(
      frontmatter: { templateKey: { eq: "in-silico-follow-up-page" } }
    ) {
      frontmatter {
        title
        releases {
          title
          intro
          analyses {
            title
            summary
            charts {
              title
              description
              externalImages
              internalImages {
                image {
                  publicURL
                }
              }
            }
            authors
            files {
              description
              filename
              link
            }
          }
        }
      }
    }
  }
`;

export default InSilicoFollowUpPage;
