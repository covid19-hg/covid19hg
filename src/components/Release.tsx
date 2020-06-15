import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { Container, Grid } from "../components/materialUIContainers";
import { Typography, Box } from "@material-ui/core";
import Analysis, { AlternatelyShadedTableRow } from "./Analysis";
import _sortBy from "lodash/sortBy";
import _last from "lodash/last";
import _uniq from "lodash/uniq";

const releaseLeftColumnWidthXs = 12;
const releaseRightColumnWidthXs = 12;
const releaseLeftColumnWidthMd = 3;
const releaseRightColumnWidthMd = 9;

interface Props {
  notes: string;
  title: string;
  authors: {
    affiliation: string;
    name: string;
    study: string;
  }[];
  data_columns: {
    column: string;
    description: string;
  }[];
  date: string;
  studyAbbreviations: {
    abbreviation: string;
    full_name: string;
  }[];
  analyses: {
    name: string;
    phenotype: string;
    population: string;
    download: {
      gz_url: string;
      name: string;
      tbi_url: string;
    };
    manhattan: any;
    qqplot: any;
    studies: {
      cases: number;
      controls: number;
      study: string;
    }[];
  }[];
}

const Release = (release: Props) => {
  const abbreviationRows = release.studyAbbreviations.map(
    ({ full_name, abbreviation }) => (
      <AlternatelyShadedTableRow key={abbreviation}>
        <TableCell component="th" scope="row">
          {full_name}
        </TableCell>
        <TableCell>{abbreviation}</TableCell>
      </AlternatelyShadedTableRow>
    )
  );

  const abbreviationTable = (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Full Name</TableCell>
          <TableCell>Abbreviation</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{abbreviationRows}</TableBody>
    </Table>
  );

  const dataFieldRows = release.data_columns.map(({ column, description }) => (
    <AlternatelyShadedTableRow key={column}>
      <TableCell>{column}</TableCell>
      <TableCell>{description}</TableCell>
    </AlternatelyShadedTableRow>
  ));
  const dataFieldsTable = (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell component="th" scope="row">
            Column Name
          </TableCell>
          <TableCell>Description</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>{dataFieldRows}</TableBody>
    </Table>
  );

  const analysisElems = release.analyses.map((analysis) => (
    <Analysis analysis={analysis} key={analysis.name} />
  ));

  const contributingStudies = _uniq(
    release.authors.map(({ study }) => study)
  ).filter((name) => name !== "Admin and Analysis Team");
  const contributors = _sortBy(release.authors, ({ name }) =>
    _last(name.split(" "))
  ).map(({ name }) => name);
  const contributingStudiesString = `${contributingStudies.join(", ")}.`;
  const contributorsString = `${contributors.join(", ")}.`;

  return (
    <Container disableGutters={true}>
      <Typography variant="h4">{release.title}</Typography>
      <Grid
        container={true}
        alignItems={"center" as "center"}
        spacing={2}
        marginTop={1}
      >
        <Grid
          item={true}
          xs={releaseLeftColumnWidthXs}
          md={releaseLeftColumnWidthMd}
        >
          <Typography variant="h6"> Release Date</Typography>
        </Grid>
        <Grid
          item={true}
          xs={releaseRightColumnWidthXs}
          md={releaseRightColumnWidthMd}
        >
          <Typography> {release.date}</Typography>
        </Grid>

        <Grid
          item={true}
          xs={releaseLeftColumnWidthXs}
          md={releaseLeftColumnWidthMd}
        >
          <Typography variant="h6">Study Abbreviations</Typography>
        </Grid>
        <Grid
          item={true}
          xs={releaseRightColumnWidthXs}
          md={releaseRightColumnWidthMd}
        >
          {abbreviationTable}
        </Grid>

        <Grid
          item={true}
          xs={releaseLeftColumnWidthXs}
          md={releaseLeftColumnWidthMd}
        >
          <Typography variant="h6">Release Notes</Typography>
        </Grid>
        <Grid
          item={true}
          xs={releaseRightColumnWidthXs}
          md={releaseRightColumnWidthMd}
        >
          <Typography> {release.notes}</Typography>
        </Grid>

        <Grid
          item={true}
          xs={releaseLeftColumnWidthXs}
          md={releaseLeftColumnWidthMd}
        >
          <Typography variant="h6">Data Columns</Typography>
        </Grid>
        <Grid
          item={true}
          xs={releaseRightColumnWidthXs}
          md={releaseRightColumnWidthMd}
        >
          {dataFieldsTable}
        </Grid>

        <Grid item={true} xs={12}>
          <Typography align="center">
            An interactive data browser will be available soon.
          </Typography>
        </Grid>
      </Grid>
      <Grid container={true} marginTop={2} spacing={4}>
        {analysisElems}
      </Grid>

      <Box marginTop={2} padding={1}>
        <Typography variant="h6" gutterBottom={true}>
          Contributing Studies
        </Typography>
        <Typography gutterBottom={true}>{contributingStudiesString}</Typography>
        <Typography variant="h6" gutterBottom={true}>
          Contributors
        </Typography>
        <Typography gutterBottom={true}>{contributorsString}</Typography>
      </Box>
    </Container>
  );
};

export default Release;
