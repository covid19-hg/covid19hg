import React from "react"
import Layout from '../components/Layout'
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag"

const DownloadPage = () => {
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag('/download/')
  return (
    <Layout>
      {canonicalLinkMetaTag}
      <section className="content">
        <div>
          <h1
            className="has-text-weight-bold is-size-1"
            style={{
              boxShadow: "0.5rem 0 0 #f40, -0.5rem 0 0 #f40",
              backgroundColor: "#142166",
              color: "white",
              padding: "1rem",
            }}
          >
            Data Download
          </h1>
        </div>
      </section>
    </Layout>

  )
}

export default DownloadPage
