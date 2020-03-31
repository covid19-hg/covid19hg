import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag"


export const AboutPageTemplate = ({ title, content, contentComponent }) => {
  const PageContent = contentComponent || Content

  return (
    <section className="section section--gradient">
      <div className="container">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <div className="section">
              <h2 className="title is-size-3 has-text-weight-bold is-bold-light">
                {title}
              </h2>
              {/* <PageContent className="content" content={content} /> */}
              <iframe
                width='100%'
                height='1500'
                src="https://docs.google.com/document/u/1/d/e/2PACX-1vSCBpAFs6kaJ0qWhH2eD_ZL0f6T7cHhwFKUnFkHWCnm7lFYOjas-VpCgi6Y5iACYDk3Sf44YLgYd9_h/pub"
                >
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

AboutPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
}

const AboutPage = ({ data }) => {
  const { markdownRemark: post } = data
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag('/about/')

  return (
    <Layout>
      {canonicalLinkMetaTag}
      <AboutPageTemplate
        contentComponent={HTMLContent}
        title={post.frontmatter.title}
        content={post.html}
      />
    </Layout>
  )
}

AboutPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default AboutPage

export const aboutPageQuery = graphql`
  query AboutPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
  }
`
