import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { Link as GatsbyLink } from "gatsby";
import { getPartnerPath } from "./partnersPageUtils";
import { DisplayedStudy, RoleList } from "./acknowledgementUtils";
import { sortByLastName } from "./acknowledgementUtils";
import { acknowledgementsStudyTitle } from "../cypressTestDataAttrs";

const useStyles = makeStyles((theme: Theme) => ({
  studyRoot: {
    marginTop: theme.spacing(2),
  },
  roleTitle: {
    marginTop: theme.spacing(1),
  },
}));

interface LargeScreenColumnProps {
  roleLists: RoleList[];
}

export const LargeScreenColumn = ({ roleLists }: LargeScreenColumnProps) => {
  const classes = useStyles();
  const elems = roleLists.map(({ name: roleName, contributors }) => {
    const sorted = sortByLastName(contributors).map((name, index) => (
      <Typography key={index}>{name}</Typography>
    ));
    return (
      <React.Fragment key={roleName}>
        <Typography variant="h6" component="h3" className={classes.roleTitle}>
          {roleName}
        </Typography>
        {sorted}
      </React.Fragment>
    );
  });
  return (
    <Grid item={true} xs={6}>
      {elems}
    </Grid>
  );
};

interface Props {
  study: DisplayedStudy;
  linkToPartnersPage: boolean;
  isLargeScreen: boolean;
}

const StudyAcknowledgement = ({
  study,
  linkToPartnersPage,
  isLargeScreen,
}: Props) => {
  const { id: studyId, name: studyName, leftRoleLists, rightRoleLists } = study;
  const classes = useStyles();
  let title: React.ReactElement<any>;
  if (linkToPartnersPage === true) {
    title = (
      <Typography
        variant="h5"
        component={GatsbyLink}
        to={getPartnerPath(studyId)}
        gutterBottom={true}
        data-cy={acknowledgementsStudyTitle}
      >
        {studyName}
      </Typography>
    );
  } else {
    title = (
      <Typography
        variant="h5"
        component="h3"
        gutterBottom={true}
        data-cy={acknowledgementsStudyTitle}
      >
        {studyName}
      </Typography>
    );
  }

  let content: React.ReactNode;
  if (isLargeScreen) {
    const leftColumn = <LargeScreenColumn roleLists={leftRoleLists} />;
    const rightColumn = <LargeScreenColumn roleLists={rightRoleLists} />;
    content = (
      <Grid container={true} spacing={2}>
        {leftColumn}
        {rightColumn}
      </Grid>
    );
  } else {
    content = leftRoleLists.map(({ name: roleName, contributors }) => {
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
  }
  return (
    <Card className={classes.studyRoot}>
      <CardContent>
        {title}
        {content}
      </CardContent>
    </Card>
  );
};

export default StudyAcknowledgement;
