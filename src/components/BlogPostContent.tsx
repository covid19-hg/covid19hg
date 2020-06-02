import React from "react";
import { Container } from "../components/materialUIContainers";
import { Typography, Chip, makeStyles, Theme } from "@material-ui/core";
import { HTMLContent } from "./Content";

const useStyles = makeStyles((theme: Theme) => ({
  chip: {
    marginRight: theme.spacing(1),
  },
}));

interface Props {
  content: string;
  helmet: React.ReactNode;
  tags: string[];
  title: string;
}

const BlogPostContent = ({ content, tags, helmet, title }: Props) => {
  const classes = useStyles();
  const tagElems = tags.map((tag, index) => (
    <Chip label={tag} key={index} className={classes.chip} />
  ));

  return (
    <Container marginTop={2} fixed={true}>
      {helmet || ""}
      <Typography variant="h4">{title}</Typography>
      <Typography>
        <HTMLContent content={content} className="" />
      </Typography>
      <Typography variant="h5" gutterBottom={true}>
        Tags
      </Typography>
      {tagElems}
    </Container>
  );
};

export default BlogPostContent;
