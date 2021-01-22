import React from "react";
import { Container } from "../components/materialUIContainers";
import Release from "../components/Release";

interface Props {
  release: any;
}

const ResultsPageContent = ({ release }: Props) => {
  return (
    <Container marginTop={2} fixed={true}>
      <Release {...release} />
    </Container>
  );
};

export default ResultsPageContent;
