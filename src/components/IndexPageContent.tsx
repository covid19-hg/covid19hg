import React from "react";
import { Container, Grid } from "./materialUIContainers";
import { Typography, Link, makeStyles, Theme } from "@material-ui/core";
import GatsbyLink from "gatsby-link";
import Box from "@material-ui/core/Box";
import BlogRoll from "./BlogRoll";
import Img from "gatsby-image";

const useStyles = makeStyles((theme: Theme) => ({
  featureItem: {
    textDecoration: "none",
    display: "block",
    marginBottom: theme.spacing(1),
  },
  featureItemTitle: {
    color: theme.palette.primary.main,
    textDecoration: "underline",
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
  if (link[0] === "/") {
    return (
      <GatsbyLink to={link} className={classes.featureItem}>
        <Typography variant="h6" className={classes.featureItemTitle}>
          {title}
        </Typography>
        <Typography variant="body1" className={classes.featureItemSubtitle}>
          {subtitle}
        </Typography>
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
        <Typography variant="h6" className={classes.featureItemTitle}>
          {title}
        </Typography>
        <Typography variant="body1" className={classes.featureItemSubtitle}>
          {subtitle}
        </Typography>
      </Link>
    );
  }
};

interface Props {
  image: any;
  heading: string;
  subheading: string;
  mainpitch: { title: string; description: string };
  description: string;
  learnCollaborate: { title: string; subtitle: string; link: string }[];
  dataResults: { title: string; subtitle: string; link: string }[];
}
const IndexPageContent = ({
  image,
  mainpitch,
  heading,
  description,
  learnCollaborate,
  dataResults,
}: Props) => {
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
      <Container marginTop={2} fixed={true}>
        <Grid container={true} spacing={2} marginTop={10}>
          <Grid item={true} xs={12}>
            <Typography variant="h4" gutterBottom={true}>
              {mainpitch.title}
            </Typography>
            <Typography gutterBottom={true}>{mainpitch.description}</Typography>
          </Grid>
          <Grid item={true} xs={12}>
            <Typography variant="h4" gutterBottom={true}>
              {heading}
            </Typography>
            <Typography gutterBottom={true}>{description}</Typography>
          </Grid>
        </Grid>
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
