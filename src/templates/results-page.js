import React from 'react'
import PropTypes from 'prop-types'
import Img from 'gatsby-image'
import Layout from '../components/Layout'
import useCanonicalLinkMetaTag from '../components/useCanonicalLinkMetaTag'
import styled from 'styled-components'
import { Link } from 'gatsby'

const Analysis = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  height: 100%;
  width: 100%;
  padding: 10px 10px 10px 10px;
  margin-bottom: 50px;
`

const AnalysisInfo = styled.div`
  margin-bottom: 30px;
  h3,
  h4 {
    font-weight: bold;
    margin-top: 30px;
  }
`

const Plots = styled.div`
  display: flex;
  flex-direction: row;

  .manhattan {
    width: 70%;
    height: auto;
  }

  .qqplot {
    width: 30%;
    height: auto;
  }
`

const ResultsPageTemplate = ({ title, releases }) => {
  return (
    <section className="content">
      <div>
        <h1
          className="has-text-weight-bold is-size-1"
          style={{
            boxShadow: '0.5rem 0 0 #f40, -0.5rem 0 0 #f40',
            backgroundColor: '#142166',
            color: 'white',
            padding: '1rem',
          }}
        >
          {title}
        </h1>
      </div>

      {releases.map(release => (
        <div key={release.title} className="column is-10 is-offset-1">
          <h1>{release.title}</h1>
          <p>
            <strong>Study abbreviations</strong>:{' '}
            {release.studyAbbreviations.map((abv, i) => (
              <span>
                {' '}
                <strong>{abv.abbreviation}</strong>: {abv.full_name}
                {release.studyAbbreviations.length - 1 === i ? '.' : ','}
              </span>
            ))}
          </p>
          <p>{release.notes}</p>

          <p>
            An interactive data browser will be available soon.
          </p>
          {release.analyses.map(analysis => (
            <Analysis key={analysis.name}>
              <AnalysisInfo>
                <h2>{analysis.name}</h2>
                <p>
                  <strong>Phenotype</strong>: {analysis.phenotype}.
                </p>
                <p>
                  <strong>Population</strong>: {analysis.population}.
                </p>
                <p>
                  <span>
                    <strong>Contributing studies </strong> (n_cases, n_controls):{' '}
                  </span>
                  {analysis.studies.map((study, i) => {
                    return (
                      <span>
                        {' '}
                        <strong>{study.study}</strong> ({study.cases}, {study.controls})
                        {analysis.studies.length - 1 === i ? '.' : ','}
                      </span>
                    )
                  })}
                </p>
                <strong>
                  <p>Downloads</p>
                </strong>
                <p>
                  <Link>{analysis.gz}</Link>
                  <br />
                  <Link>{analysis.tbi}</Link>
                </p>
              </AnalysisInfo>

              <strong>
                <p>Plots</p>
              </strong>
              <Plots>
                <img className="manhattan" src={analysis.manhattan.image.publicURL} />
                <img className="qqplot" src={analysis.qqplot.image.publicURL} />
              </Plots>
            </Analysis>
          ))}
        </div>
      ))}
    </section>
  )
}

const ResultsPage = ({ data, release }) => {
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag('/results/')
  const { frontmatter } = data.markdownRemark
  console.log(frontmatter)
  return (
    <Layout>
      {canonicalLinkMetaTag}
      <ResultsPageTemplate title={frontmatter.title} releases={frontmatter.releases} />
    </Layout>
  )
}

ResultsPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}
export default ResultsPage

export const pageQuery = graphql`
  query ResultsPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "results-page" } }) {
      frontmatter {
        title
        releases {
          title
          date
          notes
          studyAbbreviations {
            abbreviation
            full_name
          }
          analyses {
            name
            phenotype
            population
            gz
            tbi
            studies {
              study
              cases
              controls
            }
            manhattan {
              image {
                publicURL
              }
            }
            qqplot {
              image {
                publicURL
              }
            }
          }
        }
      }
    }
  }
`
