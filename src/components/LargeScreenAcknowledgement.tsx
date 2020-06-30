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
import { DisplayedStudy, RoleList } from "./AcknowlegementPageContent";
import { sortByLastName } from "./acknowledgementUtils";

interface ColumnProps {
  roleLists: RoleList[];
}

export const Column = ({ roleLists }: ColumnProps) => {
  const elems = roleLists.map(({ name: roleName, contributors }) => {
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
  return (
    <Grid item={true} xs={6}>
      {elems}
    </Grid>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
}));

interface Props {
  study: DisplayedStudy;
}

const LargeScreenAcknowledgement = ({ study }: Props) => {
  const { id: studyId, name: studyName, leftRoleLists, rightRoleLists } = study;
  const classes = useStyles();
  const leftColumn = <Column roleLists={leftRoleLists} />;
  const rightColumn = <Column roleLists={rightRoleLists} />;
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          variant="h5"
          component={GatsbyLink}
          to={getPartnerPath(studyId)}
          gutterBottom={true}
        >
          {studyName}
        </Typography>
        <Grid container={true} spacing={2}>
          {leftColumn}
          {rightColumn}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LargeScreenAcknowledgement;
