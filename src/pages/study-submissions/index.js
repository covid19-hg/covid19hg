import React from 'react'
import Layout from '../../components/Layout'
import useCanonicalLinkMetaTag from '../../components/useCanonicalLinkMetaTag'

const Index = () => {
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag('/study-submissions/')
  return (
    <Layout>
      {canonicalLinkMetaTag}
      <section className="section">
        <div className="container">
          <div className="content">
            <iframe
              class="airtable-embed"
              src="https://airtable.com/embed/shr5quu3uUDSaT5fs?backgroundColor=blue&viewControls=on"
              frameborder="0"
              onmousewheel=""
              width="100%"
              height="1000vh"
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
