import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Map from '../components/Map'
import InstitutionsList from '../components/InstitutionsList'
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag"

export const ProductPageTemplate = ({ image, title }) => (
  <div className="content">
    <div
    >
      <h1
        className="has-text-weight-bold is-size-1"
        style={{
          boxShadow: "0.5rem 0 0 #f40, -0.5rem 0 0 #f40",
          backgroundColor: "#142166",
          color: "white",
          padding: "1rem"
        }}
      >
        {title}
      </h1>
    </div>
    <section className="section section--gradient">
      <div className="container">
        <div className="section">
          <Map />
        </div>
        <div className="section">
          <InstitutionsList />
        </div>
      </div>
    </section>
  </div>
)

ProductPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
}

const ProductPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag('/partners/')

  return (
    <Layout>
      {canonicalLinkMetaTag}
      <ProductPageTemplate
        image={frontmatter.image}
        title={frontmatter.title}
      />
    </Layout>
  )
}

ProductPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default ProductPage

export const productPageQuery = graphql`
  query ProductPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        image {
          childImageSharp {
            fluid(maxWidth: 2048, quality: 100) {
              ...GatsbyImageSharpFluid
            }
          }
        }
        heading
        description
        intro {
          blurbs {
            image {
              childImageSharp {
                fluid(maxWidth: 240, quality: 64) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            text
          }
          heading
          description
        }
      }
    }
  }
`
