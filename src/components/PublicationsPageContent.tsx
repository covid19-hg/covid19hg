import React from "react";
import { Typography, Card, CardContent, Theme, Link } from "@material-ui/core";
import { Container, Grid } from "./materialUIContainers";
import { makeStyles } from "@material-ui/styles";
import { Link as GatsbyLink } from "gatsby";

interface Publication {
  name: string;
  posted_date: string;
  links: { description: string; url: string }[];
  cases_description: string | null;
  controls_description: string | null;
  genome_wide_significant_loci: string | null;
  first_publication: string | null;
}

const useStyles = makeStyles((theme: Theme) => ({
  leftColumn: {
    textAlign: "right",
    fontWeight: "bold",
  },
  grid: {
    alignItems: "center",
  },
  card: {
    margin: theme.spacing(2, 0),
  },
  link: {
    textDecoration: "underline",
    marginRight: theme.spacing(1),
  },
}));

interface Props {
  title: string;
  intro: string;
  publications: Publication[];
}

const PublicationsPageContent = ({ intro, publications }: Props) => {
  const classes = useStyles();
  // TODO: need to allow multiple links for each study (preprint vs published paper)
  const publicationElems = publications.map(
    ({
      name,
      posted_date,
      cases_description,
      controls_description,
      genome_wide_significant_loci,
      first_publication,
      links,
    }) => {
      const leftColumnSize = 2;
      const rightColumnSize = 10;
      const linkElems = links && links.map(({ description, url }) => {
        const urlElem = url.startsWith("/") ? (
          <GatsbyLink key={url} className={classes.link} to={url}>
            {description}
          </GatsbyLink>
        ) : (
          <Link key={url} href={url} className={classes.link}>
            {description}
          </Link>
        );
        return urlElem;
      });
      const casesDescriptionElem =
        cases_description === null ? null : (
          <>
            <Grid
              item={true}
              xs={leftColumnSize}
              className={classes.leftColumn}
            >
              Cases:
            </Grid>
            <Grid item={true} xs={rightColumnSize}>
              {cases_description}
            </Grid>
          </>
        );
      const controlsDescriptionElem =
        controls_description === null ? null : (
          <>
            <Grid
              item={true}
              xs={leftColumnSize}
              className={classes.leftColumn}
            >
              Controls:
            </Grid>
            <Grid item={true} xs={rightColumnSize}>
              {controls_description}
            </Grid>
          </>
        );
      const lociElem =
        genome_wide_significant_loci === null ? null : (
          <>
            <Grid
              item={true}
              xs={leftColumnSize}
              className={classes.leftColumn}
            >
              Genome-wide significant loci:
            </Grid>
            <Grid item={true} xs={rightColumnSize}>
              {genome_wide_significant_loci}
            </Grid>
          </>
        );
      const firstPublicationElem =
        first_publication === null ? null : (
          <>
            <Grid
              item={true}
              xs={leftColumnSize}
              className={classes.leftColumn}
            >
              First publication:
            </Grid>
            <Grid item={true} xs={rightColumnSize}>
              {first_publication}
            </Grid>
          </>
        );
      return (
        <Card key={name} className={classes.card}>
          <CardContent>
            <Typography variant="h5" gutterBottom={true}>
              {name}
            </Typography>
            <Grid container={true} spacing={2} className={classes.grid}>
              <Grid
                item={true}
                xs={leftColumnSize}
                className={classes.leftColumn}
              >
                Posted date:
              </Grid>
              <Grid item={true} xs={rightColumnSize}>
                {posted_date}
              </Grid>
              <Grid
                item={true}
                xs={leftColumnSize}
                className={classes.leftColumn}
              >
                Links:
              </Grid>
              <Grid item={true} xs={rightColumnSize}>
                {linkElems}
              </Grid>
              {casesDescriptionElem}
              {controlsDescriptionElem}
              {lociElem}
              {firstPublicationElem}
            </Grid>
          </CardContent>
        </Card>
      );
    }
  );
  return (
    <Container marginTop={1} fixed={true}>
      <Typography>{intro}</Typography>
      {publicationElems}
    </Container>
  );
};

export default PublicationsPageContent;
