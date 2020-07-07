import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/NewLayout";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import { Container } from "../components/materialUIContainers";
import { HTMLContent } from "../components/Content";
import { Typography } from "@material-ui/core";

export const AboutPageTemplate = ({ content }) => {
  return (
    <Container fixed={true} marginTop={1}>
      <Typography>
        <HTMLContent content={content} />
      </Typography>
    </Container>
  );
};

AboutPageTemplate.propTypes = {
  content: PropTypes.string,
};

const AboutPage = ({ data }) => {
  const { markdownRemark: post } = data;
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/about/");

  return (
    <Layout title="About">
      {canonicalLinkMetaTag}
      <AboutPageTemplate content={post.html} />
    </Layout>
  );
};

AboutPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      html: PropTypes.string,
      frontmatter: PropTypes.shape({
        title: PropTypes.string,
      }),
    }),
  }),
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
