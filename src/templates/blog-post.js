import React from "react";
import PropTypes from "prop-types";
import { kebabCase } from "lodash";
import Helmet from "react-helmet";
import { graphql, Link as GatsbyLink } from "gatsby";
import Layout from "../components/NewLayout";
import Content, { HTMLContent } from "../components/Content";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import { Container, Grid } from "../components/materialUIContainers";
import { Typography, Chip } from "@material-ui/core";

export const BlogPostTemplate = ({
  content,
  contentComponent,
  description,
  tags,
  title,
  helmet,
}) => {
  const PostContent = contentComponent || Content;

  const tagElems = tags.map((tag) => (
    <Chip
      label={tag}
      component={GatsbyLink}
      to={`/tags/${kebabCase(tag)}/`}
      clickable
    />
  ));

  return (
    <Container marginTop={2}>
      {helmet || ""}
      <Typography dangerouslySetInnerHTML={{ __html: content }} />
      <Typography variant="h5" gutterBottom={true}>
        Tags
      </Typography>
      {tagElems}
    </Container>
  );
};

BlogPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
};

const BlogPost = ({ data }) => {
  const { markdownRemark: post } = data;
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag(post.fields.slug);

  return (
    <Layout title={post.frontmatter.title}>
      {canonicalLinkMetaTag}
      <BlogPostTemplate
        content={post.html}
        contentComponent={HTMLContent}
        description={post.frontmatter.description}
        helmet={
          <Helmet titleTemplate="%s | Blog">
            <title>{`${post.frontmatter.title}`}</title>
            <meta
              name="description"
              content={`${post.frontmatter.description}`}
            />
          </Helmet>
        }
        tags={post.frontmatter.tags}
        title={post.frontmatter.title}
      />
    </Layout>
  );
};

BlogPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
};

export default BlogPost;

export const pageQuery = graphql`
  query BlogPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      fields {
        slug
      }
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        title
        description
        tags
      }
    }
  }
`;
