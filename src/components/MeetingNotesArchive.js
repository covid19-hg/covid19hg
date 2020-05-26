import React from 'react'
import BlogItemListing from "./BlogItemListing"
import { graphql, StaticQuery } from 'gatsby'


export default () => (
  <StaticQuery
    query={graphql`
      query MeetingNotesArchiveQuery {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          filter: {
            frontmatter: {
              templateKey: { eq: "blog-post" }
              type: { eq: "meeting-notes" }
            }
          }
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
    render={(data, count) => <BlogItemListing data={data} count={count} />}
  />
);
