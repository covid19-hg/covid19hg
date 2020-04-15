import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import ReactMarkdown from "react-markdown";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export const FaqPageTemplate = ({ title, qas }) => {
  const pairs = qas.map(({ question, answer }, index) => (
    <ExpansionPanel key={`pair-${index}`}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <ReactMarkdown source={question} />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <ReactMarkdown source={answer} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  ));
  return (
    <div>
      <section className="section section--gradient">
        <div className="container"></div>
        <div className="section">
          <div className="columns">
            <div className="column is-10 is-offset-1">
              <div className="content">
                <div className="tile">
                  <h1 className="title">{title}</h1>
                </div>
                <ul> {pairs} </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

FaqPageTemplate.propTypes = {
  title: PropTypes.string,
  qas: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string,
      answer: PropTypes.string,
    })
  ),
};

const FaqPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark;
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/faq");

  return (
    <Layout>
      {canonicalLinkMetaTag}
      <FaqPageTemplate title={frontmatter.title} qas={frontmatter.qas} />
    </Layout>
  );
};

FaqPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
};

export default FaqPage;

export const pageQuery = graphql`
  query FaqPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "faq-page" } }) {
      frontmatter {
        title
        qas {
          question
          answer
        }
      }
    }
  }
`;
