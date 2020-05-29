import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../components/NewLayout";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import BlogPostContent from "../components/BlogPostContent";

const BlogPost = ({ data }) => {
  const { markdownRemark: post } = data;
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag(post.fields.slug);

  return (
    <Layout title="News">
      {canonicalLinkMetaTag}
      <BlogPostContent
        title={post.frontmatter.title}
        content={post.html}
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
