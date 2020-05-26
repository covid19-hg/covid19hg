import React from "react";
import { Container } from "../components/materialUIContainers";
import Release from "../components/Release";

interface Props {
  releases: any;
}

const ResultsPageContent = ({ releases }: Props) => {
  const releaseElems = releases.map((release: any, index: number) => (
    <Release {...release} key={index} />
  ));
  return (
    <Container marginTop={2} fixed={true}>
      {releaseElems}
    </Container>
  );
};

export default ResultsPageContent;
