import React from "react";
import { Container, Grid } from "./materialUIContainers";
import { Card, CardContent, Typography, Link } from "@material-ui/core";

interface Article {
  title: string;
  url: string;
  source: string;
  date: string;
}

interface Props {
  articles: Article[];
}

const MediaPageContent = ({ articles }: Props) => {
  const articleElems = articles.map(({ title, url, source, date }, index) => (
    <Grid item={true} xs={12} md={6} key={index}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom={true}>
            <Link href={url} target="_blank" rel="noopener noreferrer"> {title}</Link>
          </Typography>
          <Typography>{source}</Typography>
          <Typography>{date}</Typography>
        </CardContent>
      </Card>
    </Grid>
  ));
  return (
    <Container marginTop={2}>
      <Grid container={true} spacing={2}>
        {articleElems}
      </Grid>
    </Container>
  );
};

export default MediaPageContent;
