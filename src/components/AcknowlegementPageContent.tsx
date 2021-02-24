import React, { useEffect, useState, useMemo } from "react";
import { Container, Grid } from "../components/materialUIContainers";
import { fetchJSON } from "../Utils";
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
import { processContributorList } from "./acknowledgementUtils";
import Study from "./StudyAcknowledgement";
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
  data: AirtableDatum[];
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
          import("../acknowledgement.json"),
          fetchJSON<FetchedPartnersData>("/.netlify/functions/partners"),
        ]);
        const { default: contributors} = fetchedContributors;
        const { data: studies } = FetchedPartnersData;
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
        leftColumnStudies,
        rightColumnStudies,
        adhocGroups,
      } = processContributorList(contributors, studies, isLargeScreen);

      if (isLargeScreen) {
        const leftColumnElems = leftColumnStudies.map((study, index) => (
          <Study
            study={study}
            key={index}
            linkToPartnersPage={true}
            isLargeScreen={true}
          />
        ));
        const rightColumnElems = rightColumnStudies.map((study, index) => (
          <Study
            study={study}
            key={index}
            linkToPartnersPage={true}
            isLargeScreen={true}
          />
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

        const adhocItems = adhocGroups.map((group, index) => (
          <Grid item={true} xs={6} key={index}>
            <Study
              study={group}
              linkToPartnersPage={false}
              isLargeScreen={true}
            />
          </Grid>
        ));
        adhocGroupElems = (
          <Grid container={true} spacing={2}>
            {adhocItems}
          </Grid>
        );
      } else {
        const elems = leftColumnStudies.map((study, index) => (
          <Study
            study={study}
            key={index}
            linkToPartnersPage={true}
            isLargeScreen={false}
          />
        ));
        studyElems = (
          <Grid container={true} spacing={2}>
            {elems}
          </Grid>
        );
        const adhocItems = adhocGroups.map((group, index) => (
          <Grid item={true} xs={12} key={index}>
            <Study
              study={group}
              linkToPartnersPage={false}
              isLargeScreen={false}
            />
          </Grid>
        ));
        adhocGroupElems = (
          <Grid container={true} spacing={2}>
            {adhocItems}
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
