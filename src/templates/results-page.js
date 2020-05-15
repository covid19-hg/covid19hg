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

const Affiliations = styled.p`
  font-size: 12px;
  margin-bottom: 20px;
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

const formatAuthorList = authors => {
  let affiliations = []
  authors.forEach(author => {
    if (!affiliations.includes(author.affiliation)) {
      affiliations.push(author.affiliation)
    }
  })

  affiliations = affiliations.sort()

  const subscripts = affiliations.reduce((acc, affiliation, i) => {
    return {
      [affiliation]: i + 1,
      ...acc,
    }
  }, {})

  let authorsByStudy = authors.reduce((acc, author) => {
    if (author.study in acc) {
      const sortedAuthors = [author, ...acc[author.study]]
      return {
        ...acc,
        [author.study]: sortedAuthors,
      }
    }
    return {
      ...acc,
      [author.study]: [author],
    }
  }, {})

  return (
    <div>
      <p>
        <strong>Contributors: </strong>
        {Object.keys(authorsByStudy).map(study => {
          return (
            <span>
              <strong>{study}: </strong>
              {authorsByStudy[study].map((author, i) => {
                return (
                  <span>
                    {author.name} <sup>{subscripts[author.affiliation]}</sup>
                    {authorsByStudy[study].length - 1 === i ? '.' : ','}{' '}
                  </span>
                )
              })}
            </span>
          )
        })}
      </p>
      <Affiliations>
        {Object.keys(subscripts).sort().map(s => (
          <span>
            <sup>{subscripts[s]}</sup>
            {s}{' '}
          </span>
        ))}
      </Affiliations>
    </div>
  )
}

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
            <strong>Release date</strong>: {release.date}.
          </p>
          {formatAuthorList(release.authors)}
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

          <p>An interactive data browser will be available soon.</p>
          {release.analyses.map(analysis => (
            <Analysis key={analysis.name}>
              <AnalysisInfo>
                <h2>{analysis.name}</h2>
                <p>
                  <strong>Phenotype</strong>: {analysis.phenotype}. <strong>Population</strong>:{' '}
                  {analysis.population}.
                </p>
                <p>
                  <strong>Total cases</strong>: {analysis.studies.reduce((acc, v) => acc + v.cases, 0)}.{' '}
                  <strong>Total controls</strong>: {analysis.studies.reduce((acc, v) => acc + v.controls, 0)}.
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
                  <a href={analysis.download.gz_url}>{analysis.download.name}</a>
                  <br />
                  <a href={analysis.download.tbi_url}>{analysis.download.name}.tbi</a>
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
          authors {
            name
            study
            affiliation
          }
          studyAbbreviations {
            abbreviation
            full_name
          }
          analyses {
            name
            phenotype
            population
            download {
              name
              gz_url
              tbi_url
            }
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
