import React, { useEffect, useState, useMemo } from "react";
import { Container, Grid } from "../components/materialUIContainers";
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
import { processContributorList, splitProcessedStudiesIntoTwoBalancedLists } from "./acknowledgementUtils";
import {  StudyAcknowledgement } from "./StudyAcknowledgement";
import { AirtableDatum, ContributorDatum as RawContributor } from "../types";

const useStyles = makeStyles((theme: Theme) => ({
  citation: {
    marginTop: theme.spacing(2),
  },
}));

interface FetchedContributorData {
  default: RawContributor[];
}

interface FetchedData {
  contributors: RawContributor[];
  studies: AirtableDatum[];
}

interface FetchedPartnersData {
  default: AirtableDatum[];
}

const AcknowledgementPageContent = () => {
  const [data, setData] = useState<FetchedData | undefined>(undefined);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const classes = useStyles();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedContributors, FetchedPartnersData] = await Promise.all([
          import("../acknowledgement.json") as unknown as Promise<FetchedContributorData>,
          import("../partners.json") as unknown as Promise<FetchedPartnersData>
        ]);
        const { default: contributors} = fetchedContributors;
        const { default: studies } = FetchedPartnersData;
        setData({ contributors, studies });
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const [studyElems, adhocGroupElems] = useMemo(() => {
    let studyElems: React.ReactElement<any> | null;
    let adhocGroupElems: React.ReactElement<any> | null;
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
      adhocGroupElems = null;
    } else {
      const { contributors, studies } = data;
      const {
        processedStudies,
        processedAdhocGroups,
      } = processContributorList(contributors, studies);

      if (isLargeScreen) {
        const [leftColumnStudies, rightColumnStudies] = splitProcessedStudiesIntoTwoBalancedLists(processedStudies)
        const leftColumnStudyElems = leftColumnStudies.map(([id, processedStudy], index) => {
          return (
            <StudyAcknowledgement
              key={index}
              study={processedStudy}
              partnerId={id}
              shouldLinkToPartnersPage={true}
            />
          )
        })
        const rightColumnStudyElems = rightColumnStudies.map(([id, processedStudy], index) => {
          return (
            <StudyAcknowledgement
              key={index}
              study={processedStudy}
              partnerId={id}
              shouldLinkToPartnersPage={true}
            />
          )
        })
        studyElems = (
          <Grid container={true} spacing={2}>
            <Grid item={true} xs={6}>
              {leftColumnStudyElems}
            </Grid>
            <Grid item={true} xs={6}>
              {rightColumnStudyElems}
            </Grid>
          </Grid>
        )
        const [leftColumnAdhocGroups, rightColumnAdhocGroups] = splitProcessedStudiesIntoTwoBalancedLists( [...processedAdhocGroups.entries()])
        const leftColumnAdhocGroupElems = leftColumnAdhocGroups.map(([, processedStudy], index) => {
          return (
            <StudyAcknowledgement
              key={index}
              study={processedStudy}
              shouldLinkToPartnersPage={false}
            />
          )
        })
        const rightColumnAdhocGroupElems = rightColumnAdhocGroups.map(([, processedStudy], index) => {
          return (
            <StudyAcknowledgement
              key={index}
              study={processedStudy}
              shouldLinkToPartnersPage={false}
            />
          )
        })
        adhocGroupElems = (
          <Grid container={true} spacing={2}>
            <Grid item={true} xs={6}>
              {leftColumnAdhocGroupElems}
            </Grid>
            <Grid item={true} xs={6}>
              {rightColumnAdhocGroupElems}
            </Grid>
          </Grid>
        )
      } else {
        const individualStudyElems = processedStudies.map(([id, processedStudy], index) => {
          return (
            <StudyAcknowledgement
              key={index}
              study={processedStudy}
              partnerId={id}
              shouldLinkToPartnersPage={true}
            />
          )
        })
        studyElems = (
          <Grid container={true} spacing={2}>
            {individualStudyElems}
          </Grid>
        )
        const individualAdhocGroupElems = [...processedAdhocGroups.entries()].map(([, adhocGroup], index) => {
          return (
            <StudyAcknowledgement
              key={index}
              study={adhocGroup}
              shouldLinkToPartnersPage={false}
            />
          )
        })
        adhocGroupElems = (
          <Grid container={true} spacing={2}>
            {individualAdhocGroupElems}
          </Grid>
        );
      }
    }
    return [studyElems, adhocGroupElems] as const;
  }, [data]);

  return (
    <Container marginTop={2}>
      {studyElems}
      {adhocGroupElems}
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
