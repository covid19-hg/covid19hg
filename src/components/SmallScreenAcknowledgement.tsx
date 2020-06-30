import React from "react";
import { DisplayedStudy } from "./AcknowlegementPageContent";
import { Card, Theme, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { Link as GatsbyLink } from "gatsby";
import { getPartnerPath } from "./partnersPageUtils";
import { sortByLastName } from "./acknowledgementUtils";
import { Grid } from "./materialUIContainers";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
}));

interface Props {
  study: DisplayedStudy;
  linkToPartnersPage: boolean;
}
const SmallScreenAcknowledgement = ({ study, linkToPartnersPage }: Props) => {
  const classes = useStyles();
  const { name: studyName, id: studyId, leftRoleLists } = study;
  const roleElems = leftRoleLists.map(({ name: roleName, contributors }) => {
    const sorted = sortByLastName(contributors).map((name, index) => (
      <Typography key={index}>{name}</Typography>
    ));
    return (
      <React.Fragment key={roleName}>
        <Typography variant="h6" component="h3" gutterBottom={true}>
          {roleName}
        </Typography>
        {sorted}
      </React.Fragment>
    );
  });
  let title: React.ReactElement<any>;
  if (linkToPartnersPage === true) {
    title = (
      <Typography
        variant="h5"
        component={GatsbyLink}
        to={getPartnerPath(studyId)}
        gutterBottom={true}
      >
        {studyName}
      </Typography>
    );
  } else {
    title = (
      <Typography variant="h5" component="h3" gutterBottom={true}>
        {studyName}
      </Typography>
    );
  }
  return (
    <Grid item={true} xs={12}>
      <Card className={classes.root}>
        <CardContent>
          {title}
          {roleElems}
        </CardContent>
      </Card>
    </Grid>
  );
};

export default SmallScreenAcknowledgement;
