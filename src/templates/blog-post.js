import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../components/NewLayout";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import BlogPostContent from "../components/BlogPostContent";

const BlogPost = ({ data, pageContext }) => {
  const { markdownRemark: post } = data;
  const canonicalLink = pageContext.canonicalLink
    ? pageContext.canonicalLink
    : post.fields.slug;
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag(
    post.fields.slug,
    canonicalLink
  );

  return (
    <Layout title="News">
      {canonicalLinkMetaTag}
      <BlogPostContent
        title={post.frontmatter.title}
        content={post.html}
        date={post.frontmatter.date}
        langKey={post.fields.langKey}
        langs={pageContext.langs}
        slug={post.fields.slug}
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
        langKey
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
