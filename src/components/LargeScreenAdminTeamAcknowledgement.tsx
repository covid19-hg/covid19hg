import React from "react";
import { RoleList } from "./AcknowlegementPageContent";
import { Card, CardContent, Typography } from "@material-ui/core";
import {
  adminTeamName,
  getRoleListApproxHeight,
  splitIntoTwoBalancedLists,
} from "./acknowledgementUtils";
import { Column } from "./LargeScreenAcknowledgement";
import { Grid } from "./materialUIContainers";

interface Props {
  roleLists: RoleList[];
}

const LargeScreenAdminTeamAcknowledgement = ({ roleLists }: Props) => {
  const [leftRoleLists, rightRoleLists] = splitIntoTwoBalancedLists(
    roleLists,
    getRoleListApproxHeight
  );
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h3">
          {adminTeamName}
        </Typography>
        <Grid container={true}>
          <Column roleLists={leftRoleLists} />
          <Column roleLists={rightRoleLists} />
        </Grid>
      </CardContent>
    </Card>
  );
};

export default LargeScreenAdminTeamAcknowledgement;
