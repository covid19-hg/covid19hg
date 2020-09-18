import React from "react";
import { Container, Grid } from "./materialUIContainers";
import { Typography, Card, CardContent } from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import { HTMLContent } from "./Content";

interface Props {
  projectsIntro: string;
  projects: {
    title: string;
    description: string;
    contact_persons: { name: string }[];
    slack_channel: string;
  }[];
  bodyContent: string;
}
const ProjectsPageContent = ({
  projects,
  projectsIntro,
  bodyContent,
}: Props) => {
  const projectElems = projects.map(
    ({ title, description, contact_persons, slack_channel }, index) => {
      const contactPersonsText = contact_persons.join(", ") + ".";
      return (
        <Grid item={true} xs={12} key={index}>
          <Card>
            <CardContent>
              <Typography variant="h4">{title}</Typography>
              <Typography gutterBottom={true}>
                <ReactMarkdown source={description} />
              </Typography>
              <Typography variant="h6" gutterBottom={true}>
                Contact Persons:
              </Typography>
              <Typography gutterBottom={true}>{contactPersonsText}</Typography>
              <Typography variant="h6" gutterBottom={true}>
                Slack Channel:
              </Typography>
              <Typography gutterBottom={true}>{slack_channel}</Typography>
            </CardContent>
          </Card>
        </Grid>
      );
    }
  );
  return (
    <Container marginTop={1} fixed={true}>
      <Typography>
        <ReactMarkdown source={projectsIntro} />
      </Typography>
      <Grid container={true} spacing={2}>
        {projectElems}
      </Grid>
      <Typography>
        <HTMLContent content={bodyContent} className="" />
      </Typography>
    </Container>
  );
};

export default ProjectsPageContent;
