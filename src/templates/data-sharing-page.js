import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/NewLayout";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import ReactMarkdown from "react-markdown";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";
import Img from "gatsby-image";
import { Container } from "../components/materialUIContainers";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(() => ({
  panelDetailsRoot: {
    flexDirection: "column",
  },
}));

export const FaqPageTemplate = ({ qas, dataSharingWorkflowImage }) => {
  const classes = useStyles();

  const pairs = qas.map(({ question, answer }, index) => (
    <ExpansionPanel key={`pair-${index}`}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <ReactMarkdown source={question} />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.panelDetailsRoot}>
        <Typography>
          <ReactMarkdown source={answer} />
        </Typography>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  ));
  return (
    <Container marginTop={1}>
      <Img fluid={dataSharingWorkflowImage.childImageSharp.fluid} />
      {pairs}
    </Container>
  );
};

FaqPageTemplate.propTypes = {
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
    <Layout title={frontmatter.title}>
      {canonicalLinkMetaTag}
      <FaqPageTemplate
        qas={frontmatter.qas}
        dataSharingWorkflowImage={data.dataSharingWorkflowImage}
      />
    </Layout>
  );
};

FaqPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
    dataSharingWorkflowImage: PropTypes.object,
  }),
};

export default FaqPage;

export const pageQuery = graphql`
  query FaqPageTemplate {
    dataSharingWorkflowImage: file(relativePath: { eq: "data_sharing.png" }) {
      childImageSharp {
        fluid(maxWidth: 1000) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    markdownRemark(frontmatter: { templateKey: { eq: "data-sharing-page" } }) {
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
