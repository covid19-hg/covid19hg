import React from "react";
import { Container, Grid } from "./materialUIContainers";
import { Typography, Link, makeStyles, Theme, Card, CardContent } from "@material-ui/core";
import GatsbyLink from "gatsby-link";
import Box from "@material-ui/core/Box";
import BlogRoll from "./BlogRoll";
import Img from "gatsby-image";

const useStyles = makeStyles((theme: Theme) => ({
  featureItem: {
    textDecoration: "none",
    display: "block",
    marginBottom: theme.spacing(1),
    "&:hover": {
      textDecoration: "none",
    },
  },
  featureItemTitle: {
    "&:hover": {
      textDecoration: "underline",
    },
  },
  featureItemSubtitle: {
    color: theme.palette.text.primary,
  },
}));

const FeatureItem = (props: {
  title: string;
  subtitle: string;
  link: string;
}) => {
  const { title, subtitle, link } = props;
  const classes = useStyles();
  const content = (
    <>
      <Typography
        variant="h5"
        className={classes.featureItemTitle}
        color="primary"
      >
        {title}
      </Typography>
      <Typography variant="body1" className={classes.featureItemSubtitle}>
        {subtitle}
      </Typography>
    </>
  );
  if (link[0] === "/") {
    return (
      <GatsbyLink to={link} className={classes.featureItem}>
        {content}
      </GatsbyLink>
    );
  } else {
    return (
      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={classes.featureItem}
      >
        {content}
      </Link>
    );
  }
};

interface Props {
  image: any;
  learnCollaborate: { title: string; subtitle: string; link: string }[];
  dataResults: { title: string; subtitle: string; link: string }[];
}
const IndexPageContent = ({ image, learnCollaborate, dataResults }: Props) => {
  const learnCollaborateItems = learnCollaborate.map(
    ({ link, title, subtitle }) => (
      <FeatureItem title={title} subtitle={subtitle} link={link} key={title} />
    )
  );
  const learnCollaborateElem = (
    <Grid item={true} xs={12} md={6}>
      <Typography variant="h4" gutterBottom={true}>
        Learn and collaborate
      </Typography>
      <Box>{learnCollaborateItems}</Box>
    </Grid>
  );
  const dataResultsItems = dataResults.map(({ link, title, subtitle }) => (
    <FeatureItem title={title} subtitle={subtitle} link={link} key={title} />
  ));
  const dataResultsElem = (
    <Grid item={true} xs={12} md={6}>
      <Typography variant="h4" gutterBottom={true}>
        Data and results
      </Typography>
      <Box>{dataResultsItems}</Box>
    </Grid>
  );

  return (
    <>
      <Img fluid={image.childImageSharp.fluid} loading="eager" />
      <Container marginTop={5} fixed={true}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h5" align="center">Next data freeze: 30th of April</Typography>
          </CardContent>
        </Card>
        <Grid container={true} spacing={3} marginTop={2} marginBottom={2}>
          {learnCollaborateElem}
          {dataResultsElem}
        </Grid>
        <Typography variant="h4">News</Typography>
        <BlogRoll maxNumItems={4} />
      </Container>
    </>
  );
};

export default IndexPageContent;
