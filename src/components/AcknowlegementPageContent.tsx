import React, { useEffect, useState } from "react";
import { Container, Grid } from "../components/materialUIContainers";
import { fetchJSON } from "../Utils";
import _sortBy from "lodash/sortBy";
import _last from "lodash/last";
import _uniq from "lodash/uniq";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import {
  Typography,
  CircularProgress,
  Box,
  CardContent,
  Card,
  makeStyles,
  Theme,
} from "@material-ui/core";
import {
  splitIntoTwoBalancedLists,
  getPartitionPointToMinimizeDifferences,
  getRoleListApproxHeight,
  adminTeamName,
} from "./acknowledgementUtils";
import _sumBy from "lodash/sumBy";
import LargeScreenAcknowledgement from "./LargeScreenAcknowledgement";
import SmallScreenAcknowledgement from "./SmallScreenAcknowledgement";
import _zip from "lodash/zip";
import LargeScreenAdminTeamAcknowledgement from "./LargeScreenAdminTeamAcknowledgement";

const useStyles = makeStyles((theme: Theme) => ({
  citation: {
    marginTop: theme.spacing(2),
  },
}));

interface Contributor {
  contributor: string;
  role: string;
  studyIds: string[] | undefined;
  affiliation: string;
  affiliationLink: string | undefined;
  id: string;
}

interface Study {
  id: string;
  name: string;
}

interface FetchedData {
  data: {
    contributors: Contributor[];
    studies: Study[];
  };
}

interface ProcessedStudy {
  name: string;
  contributorsByRole: Map<string, string[]>;
}

type ProcessedStudies = Map<string, ProcessedStudy>;

export interface RoleList {
  name: string;
  contributors: string[];
}
export interface DisplayedStudy {
  name: string;
  id: string;
  approxRoleListsHeight: number;
  leftRoleLists: RoleList[];
  rightRoleLists: RoleList[];
}

const AcknowledgementPageContent = () => {
  const [data, setData] = useState<FetchedData["data"] | undefined>(undefined);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const classes = useStyles();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetched: FetchedData = await fetchJSON(
          "/.netlify/functions/acknowledgement"
        );
        setData(fetched.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  // TODO: add unit test for this:
  let studyElems: React.ReactElement<any> | null;
  let adminTeamElems: React.ReactElement<any> | null;
  if (data === undefined) {
    studyElems = (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="30vh"
      >
        <CircularProgress />
      </Box>
    );
    adminTeamElems = null;
  } else {
    const unsortedOutput: ProcessedStudies = new Map();
    const { contributors, studies } = data;
    const studyLookup = new Map(
      studies.map(({ id, name }) => [id, name] as const)
    );
    const adminTeamMembersByRole = new Map<string, string[]>();
    for (const { contributor, role, studyIds } of contributors) {
      if (studyIds === undefined) {
        const retrievedContributorsInThisRole = adminTeamMembersByRole.get(
          role
        );
        let contributorsInThisRole: string[];
        if (retrievedContributorsInThisRole === undefined) {
          contributorsInThisRole = [];
          adminTeamMembersByRole.set(role, contributorsInThisRole);
        } else {
          contributorsInThisRole = retrievedContributorsInThisRole;
        }
        contributorsInThisRole.push(contributor);
      } else {
        for (const studyId of studyIds) {
          const studyName = studyLookup.get(studyId);
          if (studyName !== undefined) {
            const retrievedStudy = unsortedOutput.get(studyId);
            let study: ProcessedStudy;
            if (retrievedStudy === undefined) {
              study = {
                name: studyName,
                contributorsByRole: new Map(),
              };
              unsortedOutput.set(studyId, study);
            } else {
              study = retrievedStudy;
            }

            const retrievedContributorsInThisRole = study.contributorsByRole.get(
              role
            );
            let contributorsInThisRole: string[];
            if (retrievedContributorsInThisRole === undefined) {
              contributorsInThisRole = [];
              study.contributorsByRole.set(role, contributorsInThisRole);
            } else {
              contributorsInThisRole = retrievedContributorsInThisRole;
            }
            contributorsInThisRole.push(contributor);
          }
        }
      }
    }
    const sortedOutput = _sortBy(
      [...unsortedOutput.entries()],
      ([, { name }]) => name.toLowerCase()
    );

    const studiesWithRoleListLayout: DisplayedStudy[] = [];
    for (const [id, { name: studyName, contributorsByRole }] of sortedOutput) {
      const unprocessedRoleList: RoleList[] = _sortBy(
        [...contributorsByRole.entries()].map(([role, contributors]) => ({
          name: role,
          contributors: _uniq(contributors),
        })),
        ({ name }) => name
      );
      let leftRoleLists: RoleList[];
      let rightRoleLists: RoleList[];
      if (isLargeScreen) {
        const [left, right] = splitIntoTwoBalancedLists(
          unprocessedRoleList,
          getRoleListApproxHeight
        );
        leftRoleLists = left;
        rightRoleLists = right;
      } else {
        leftRoleLists = unprocessedRoleList;
        rightRoleLists = [];
      }
      const approxRoleListsHeight = Math.max(
        _sumBy(leftRoleLists, getRoleListApproxHeight),
        _sumBy(rightRoleLists, getRoleListApproxHeight)
      );
      studiesWithRoleListLayout.push({
        approxRoleListsHeight,
        id,
        leftRoleLists,
        rightRoleLists,
        name: studyName,
      });
    }

    const approxHeightOfStudyTitle = 4;
    const getStudyAprpoxHeight = ({ approxRoleListsHeight }: DisplayedStudy) =>
      approxRoleListsHeight + approxHeightOfStudyTitle;
    let leftColumnStudies: DisplayedStudy[],
      rightColumnStudies: DisplayedStudy[];
    if (isLargeScreen) {
      const [left, right] = getPartitionPointToMinimizeDifferences(
        studiesWithRoleListLayout,
        getStudyAprpoxHeight
      );
      const joined = [...left, ...right];
      leftColumnStudies = [];
      rightColumnStudies = [];
      for (let i = 0; i < joined.length; i += 1) {
        const study = joined[i];
        if (i % 2 == 0) {
          leftColumnStudies.push(study);
        } else {
          rightColumnStudies.push(study);
        }
      }
    } else {
      leftColumnStudies = studiesWithRoleListLayout;
      rightColumnStudies = [];
    }

    const adminTeamRoleLists: RoleList[] = [
      ...adminTeamMembersByRole.entries(),
    ].map(([role, contributors]) => ({
      name: role,
      contributors: _uniq(contributors),
    }));
    if (isLargeScreen) {
      const leftColumnElems = leftColumnStudies.map((study, index) => (
        <LargeScreenAcknowledgement study={study} key={index} />
      ));
      const rightColumnElems = rightColumnStudies.map((study, index) => (
        <LargeScreenAcknowledgement study={study} key={index} />
      ));
      const leftColumn = (
        <Grid item={true} xs={6}>
          {leftColumnElems}
        </Grid>
      );
      const rightColumn = (
        <Grid item={true} xs={6}>
          {rightColumnElems}
        </Grid>
      );
      studyElems = (
        <Grid container={true} spacing={2}>
          {leftColumn}
          {rightColumn}
        </Grid>
      );
      adminTeamElems = (
        <Container marginTop={2} disableGutters={true}>
          <LargeScreenAdminTeamAcknowledgement roleLists={adminTeamRoleLists} />
        </Container>
      );
    } else {
      const elems = leftColumnStudies.map((study, index) => (
        <SmallScreenAcknowledgement
          study={study}
          key={index}
          linkToPartnersPage={true}
        />
      ));
      studyElems = (
        <Grid container={true} spacing={2}>
          {elems}
        </Grid>
      );
      adminTeamElems = (
        <Grid container={true} marginTop={2}>
          <SmallScreenAcknowledgement
            study={{
              name: adminTeamName,
              approxRoleListsHeight: 0,
              id: "",
              leftRoleLists: adminTeamRoleLists,
              rightRoleLists: [],
            }}
            linkToPartnersPage={false}
          />
        </Grid>
      );
    }
  }

  return (
    <Container marginTop={2}>
      {studyElems}
      {adminTeamElems}
      <Card className={classes.citation}>
        <CardContent>
          <Typography variant="h5" component="h2">
            Citation
          </Typography>

          <Typography>
            The COVID-19 Host Genetics Initiative. The COVID-19 Host Genetics
            Initiative, a global initiative to elucidate the role of host
            genetic factors in susceptibility and severity of the SARS-CoV-2
            virus pandemic. Eur. J. Hum. Genet. 28, 715–718 (2020).{" "}
            <a
              href="https://doi.org/10.1038/s41431-020-0636-6"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://doi.org/10.1038/s41431-020-0636-6
            </a>
            .
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AcknowledgementPageContent;
