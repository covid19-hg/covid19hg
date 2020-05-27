import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/NewLayout";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import { Container } from "../components/materialUIContainers";
import { HTMLContent } from "../components/Content";
import { Typography } from "@material-ui/core";

const AboutPage = ({ data }) => {
  const { markdownRemark: post } = data;
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/about/");

  return (
    <Layout title="About">
      {canonicalLinkMetaTag}
      <Container fixed={true} marginTop={1}>
        <Typography>
          <HTMLContent content={post.html} />
        </Typography>
      </Container>
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
