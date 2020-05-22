import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/NewLayout";
import Content, { HTMLContent } from "../components/Content";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import { Container } from "../components/materialUIContainers";

export const AboutPageTemplate = () => {
  return (
    <Container marginTop={1}>
      <iframe
        width="100%"
        height="1500"
        src="https://docs.google.com/document/u/1/d/e/2PACX-1vSMdfn_3ib0AusPXvXw4dKJ2tSzoyHIl1Y4oA3eDG280RwSQOXUE2wQW0hNfutrQeGoYce29vI-v65t/pub?embedded=true"
      ></iframe>
    </Container>
  );
};

const AboutPage = ({ data }) => {
  const { markdownRemark: post } = data;
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/about/");

  return (
    <Layout title={post.frontmatter.title}>
      {canonicalLinkMetaTag}
      <AboutPageTemplate />
    </Layout>
  );
};

AboutPage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default AboutPage;

export const aboutPageQuery = graphql`
  query AboutPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
