import React, { Fragment } from "react";
import {
  Card,
  CardContent,
  Typography,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { Link as GatsbyLink } from "gatsby";
import { getPartnerPath } from "./partnersPageUtils";
import { ProcessedStudy } from "./acknowledgementUtils";
import { acknowledgementsStudyTitle } from "../cypressTestDataAttrs";

const useStyles = makeStyles((theme: Theme) => ({
  studyRoot: {
    marginTop: theme.spacing(2),
  },
  roleTitle: {
    marginTop: theme.spacing(1),
  },
  mainContent: {
    columnCount: 2,
  }
}));

type Props = {
  study: ProcessedStudy;
} & (
  {shouldLinkToPartnersPage: true, partnerId: string} |
  {shouldLinkToPartnersPage: false}
)

export const StudyAcknowledgement = (props: Props) => {
  const {contributorsByRole, name} = props.study;
  const classes = useStyles();
  let title: React.ReactElement<any>;
  if (props.shouldLinkToPartnersPage === true) {
    title = (
      <Typography
        variant="h5"
        component={GatsbyLink}
        to={getPartnerPath(props.partnerId)}
        gutterBottom={true}
        data-cy={acknowledgementsStudyTitle}
      >
        {name}
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
        {name}
      </Typography>
    );
  }

  const contentElems = [...contributorsByRole.entries()].map(([roleName, roleMembers]) => {
    const roleMemberElems = roleMembers.map((roleMemberName, index) => (
      <Typography key={index}>{roleMemberName}</Typography>
    ))
    return (
      <Fragment key={roleName}>
        <Typography variant="h6" component="h3" className={classes.roleTitle}>
          {roleName}
        </Typography>
        {roleMemberElems}
      </Fragment>
    )
  })

  return (
    <Card className={classes.studyRoot}>
      <CardContent>
        {title}
        <div className={classes.mainContent}>
          {contentElems}
        </div>
      </CardContent>
    </Card>
  );
};

