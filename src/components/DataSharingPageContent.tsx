import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ReactMarkdown from "react-markdown";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Img from "gatsby-image";
import Typography from "@material-ui/core/Typography";
import { Container } from "../components/materialUIContainers";

const useStyles = makeStyles(() => ({
  panelDetailsRoot: {
    flexDirection: "column",
  },
}));
interface Props {
  qas: { question: string; answer: string }[];
  dataSharingWorkflowImage: any;
}

const DataSharingPageContent = ({ qas, dataSharingWorkflowImage }: Props) => {
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
    <Container marginTop={1} fixed={true}>
      <Img
        fluid={dataSharingWorkflowImage.childImageSharp.fluid}
        loading="eager"
      />
      {pairs}
    </Container>
  );
};

export default DataSharingPageContent;
