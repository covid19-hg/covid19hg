import React from "react";
import BlogItemListing from "./BlogItemListing";
import { graphql, StaticQuery } from "gatsby";

interface Props {
  maxNumItems: number | undefined;
}

export default ({ maxNumItems }: Props) => {
  return (
    <StaticQuery
      query={graphql`
        query BlogRollQuery {
          allMarkdownRemark(
            sort: { order: DESC, fields: [frontmatter___date] }
            filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
          ) {
            edges {
              node {
                excerpt(pruneLength: 400)
                id
                fields {
                  slug
                }
                frontmatter {
                  title
                  templateKey
                  date(formatString: "MMMM DD, YYYY")
                  featuredpost
                }
              }
            }
          }
        }
      `}
      render={(data) => (
        <BlogItemListing data={data} maxNumItems={maxNumItems} />
      )}
    />
  );
};
