import React from "react";
import { Container, Grid } from "./materialUIContainers";
import { Typography, Link } from "@material-ui/core";
import PreviewCompatibleImage from "./PreviewCompatibleImage";
import GatsbyLink from "gatsby-link";
import BlogRoll from "./BlogRoll";
import Img from "gatsby-image";

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
  const features = intro.blurbs.map((blurb, index) => {
    const xsWidth = 12;
    const mdWidth = 6;
    const image = (
      <Container width={300} marginBottom={1}>
        <PreviewCompatibleImage imageInfo={blurb} />
      </Container>
    );
    const text = <Typography>{blurb.text}</Typography>;
    const link = blurb.link;
    if (link) {
      if (link[0] === "/") {
        // Use gatsby link for internal links:
        return (
          <Grid item={true} xs={xsWidth} md={mdWidth} key={index}>
            <GatsbyLink to={link}>
              {image}
              {text}
            </GatsbyLink>
          </Grid>
        );
      } else {
        // Use normal anchor tag for external link:
        return (
          <Grid item={true} xs={xsWidth} md={mdWidth} key={index}>
            <Link href={link} underline="none">
              {image}
              {text}
            </Link>
          </Grid>
        );
      }
    } else {
      return (
        <Grid item={true} xs={xsWidth} md={mdWidth} key={index}>
          {image}
          {text}
        </Grid>
      );
    }
  });
  return (
    <>
      <Img fluid={image.childImageSharp.fluid} />
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
        <Grid container={true} spacing={6} marginTop={2} marginBottom={2}>
          {features}
        </Grid>
        <Typography variant="h4">News</Typography>
        <BlogRoll />
      </Container>
    </>
  );
};

export default IndexPageContent;
