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
import { makeStyles } from "@material-ui/core/styles";

const useMaterialStyles = makeStyles(() => ({
  panelDetailsRoot: {
    flexDirection: "column",
  },
}));

export const FaqPageTemplate = ({ title, qas }) => {
  const materialStyles = useMaterialStyles();

  const pairs = qas.map(({ question, answer }, index) => (
    <ExpansionPanel key={`pair-${index}`}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <ReactMarkdown source={question} />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails
        classes={{
          root: materialStyles.panelDetailsRoot,
        }}
      >
        <ReactMarkdown source={answer} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  ));
  return (
    <div className="content">
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
          {title}
        </h1>
      </div>
      <section className="section section--gradient">
        <div className="columns">
          <div className="column is-10 is-offset-1">
            <ul> {pairs} </ul>
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
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/data-sharing/");

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
