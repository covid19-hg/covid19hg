import React from "react";
import { kebabCase } from "lodash";
import { Link as GatsbyLink } from "gatsby";
import { Container } from "../components/materialUIContainers";
import { Typography, Chip } from "@material-ui/core";

interface Props {
  content: string;
  helmet: React.ReactNode;
  tags: string[];
  title: string;
}

const BlogPostContent = ({ content, tags, helmet, title }: Props) => {
  const tagElems = tags.map((tag) => (
    <Chip
      label={tag}
      component={GatsbyLink}
      to={`/tags/${kebabCase(tag)}/`}
      clickable
    />
  ));

  return (
    <Container marginTop={2} fixed={true}>
      {helmet || ""}
      <Typography variant="h4">{title}</Typography>
      <Typography dangerouslySetInnerHTML={{ __html: content }} />
      <Typography variant="h5" gutterBottom={true}>
        Tags
      </Typography>
      {tagElems}
    </Container>
  );
};

export default BlogPostContent;
