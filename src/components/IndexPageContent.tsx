import React from "react";
import { Container, Grid } from "./materialUIContainers";
import {
  Typography,
  Link,
  Card,
  CardContent,
  makeStyles,
  Theme,
} from "@material-ui/core";
import PreviewCompatibleImage from "./PreviewCompatibleImage";
import GatsbyLink from "gatsby-link";
import BlogRoll from "./BlogRoll";
import Img from "gatsby-image";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardAsLink: {
    textDecoration: "underline",
    color: theme.palette.primary.main,
    "&:visited": {
      color: theme.palette.primary.main,
    },
    "&:hover": {
      color: theme.palette.secondary.main,
    },
  },
}));

interface Props {
  image: any;
  heading: string;
  subheading: string;
  mainpitch: { title: string; description: string };
  description: string;
  intro: { blurbs: any[] };
}
const IndexPageContent = ({
  image,
  mainpitch,
  heading,
  description,
  intro,
}: Props) => {
  const classes = useStyles();
  const features = intro.blurbs.map((blurb, index) => {
    const xsWidth = 12;
    const mdWidth = 6;
    let content: React.ReactElement<any>;
    if (blurb.image === null) {
      // Must be the "see our partners" entry
      content = (
        <Container
          disableGutters={true}
          display="flex"
          justifyContent="center"
          alignItems={"center" as "center"}
        >
          <Typography variant="h4">{blurb.text}</Typography>
        </Container>
      );
    } else {
      content = (
        <>
          <Container width={300} marginBottom={1}>
            <PreviewCompatibleImage imageInfo={blurb} />
          </Container>
          <Typography>{blurb.text}</Typography>
        </>
      );
    }
    const link = blurb.link;
    if (link) {
      if (link[0] === "/") {
        // Use gatsby link for internal links:
        return (
          <Grid item={true} xs={xsWidth} md={mdWidth} key={index}>
            <Card
              className={clsx(classes.card, classes.cardAsLink)}
              to={link}
              // @ts-ignore
              component={GatsbyLink}
            >
              <CardContent>{content}</CardContent>
            </Card>
          </Grid>
        );
      } else {
        // Use normal anchor tag for external link:
        return (
          <Grid item={true} xs={xsWidth} md={mdWidth} key={index}>
            <Card
              className={clsx(classes.card, classes.cardAsLink)}
              component={Link as any}
              // @ts-ignore
              href={link}
              underline="none"
            >
              <CardContent>{content}</CardContent>
            </Card>
          </Grid>
        );
      }
    } else {
      return (
        <Grid item={true} xs={xsWidth} md={mdWidth} key={index}>
          <Card className={classes.card}>
            <CardContent>{content}</CardContent>
          </Card>
        </Grid>
      );
    }
  });
  return (
    <>
      <Img fluid={image.childImageSharp.fluid} />
        loading="eager"
      />
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
          {features}
        </Grid>
        <Typography variant="h4">News</Typography>
        <BlogRoll />
      </Container>
    </>
  );
};

export default IndexPageContent;
