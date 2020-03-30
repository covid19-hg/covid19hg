import React from 'react'
import Layout from '../../components/Layout'
import useCanonicalLinkMetaTag from '../../components/useCanonicalLinkMetaTag'

const Index = () => {
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag('/register/')
  return (
    <Layout>
      {canonicalLinkMetaTag}
    <section className="section" style={{ height: '4500px' }}>
        <div className="container">
          <div className="content">
            <script src="https://static.airtable.com/js/embed/embed_snippet_v1.js"></script>
            <iframe
              class="airtable-embed airtable-dynamic-height"
              src="https://airtable.com/embed/shrzIhb1Ih1XqNalH?backgroundColor=blue"
              frameborder="0"
              onmousewheel=""
              width="100%"
              height="4200px"
              style={{
                background: 'transparent',
                border: '1px solid #ccc',
              }}
            ></iframe>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Index
