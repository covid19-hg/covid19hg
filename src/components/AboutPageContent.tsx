import React from "react";
import { Container } from "../components/materialUIContainers";

const AboutPageContent = () => {
  return (
    <Container marginTop={1} fixed={true}>
      <iframe
        width="100%"
        height="1500"
        src="https://docs.google.com/document/u/1/d/e/2PACX-1vSMdfn_3ib0AusPXvXw4dKJ2tSzoyHIl1Y4oA3eDG280RwSQOXUE2wQW0hNfutrQeGoYce29vI-v65t/pub?embedded=true"
      ></iframe>
    </Container>
  );
};

export default AboutPageContent;
