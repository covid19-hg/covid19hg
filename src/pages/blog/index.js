import React from 'react'

import Layout from '../../components/Layout'
import BlogRoll from '../../components/BlogRoll'
import useCanonicalLinkMetaTag from "../../components/useCanonicalLinkMetaTag"

const BlogIndexPage = () => {
    const canonicalLinkMetaTag = useCanonicalLinkMetaTag('/blog/')
    return (
      <Layout>
        {canonicalLinkMetaTag}
        <div
        >
          <h1
            className="has-text-weight-bold is-size-1"
            style={{
              boxShadow: '0.5rem 0 0 #f40, -0.5rem 0 0 #f40',
              backgroundColor: '#142166',
              color: 'white',
              padding: '1rem',
            }}
          >
            News
          </h1>
        </div>
        <section className="section">
          <div className="container">
            <div className="content">
              <BlogRoll />
            </div>
          </div>
        </section>
      </Layout>
    )

}

export default BlogIndexPage
