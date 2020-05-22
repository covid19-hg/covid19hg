import React from "react";
import { Container } from "./materialUIContainers";
import { Typography } from "@material-ui/core";

const ThankYouPageContent = () => (
  <Container marginTop={2}>
    <Typography variant="h4">Thank you!</Typography>
    <Typography>Thank you for your message.</Typography>
  </Container>
);

export default ThankYouPageContent;
