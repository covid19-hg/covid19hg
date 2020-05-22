import React from "react";
import ScopedCssBaseline from "@material-ui/core/ScopedCssBaseline";
import { Helmet } from "react-helmet";
import Navbar from "../components/NewNavbar";
import useSiteMetadata from "./SiteMetadata";
import { withPrefix } from "gatsby";
import { Container } from "./materialUIContainers";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import "typeface-roboto";
import { Toolbar, AppBar, Typography } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#262262",
    },
    text: {
      primary: "hsl(0, 0%, 29%)",
    },
    error: {
      main: "hsl(348, 86%, 61%)",
    },
    warning: {
      main: "hsl(48, 100%, 67%)",
    },
    info: {
      main: "hsl(204, 71%, 53%)",
    },
    success: {
      main: "hsl(141, 53%, 53%)",
    },
    background: {
      paper: "rgb(245, 245, 245)", // $white-ter in bulma
    },
  },
});

interface Props {
  children: React.ReactNode;
  title: string;
}

const TemplateWrapper = ({ children, title }: Props) => {
  const { title: siteTitle, description, siteUrl } = useSiteMetadata();
  const titleBar =
    title !== undefined ? (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h4" component="h1">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
    ) : null;
  return (
    <ScopedCssBaseline>
      <ThemeProvider theme={theme}>
        <Container fixed={true}>
          <Helmet>
            <html lang="en" />
            <title>{title}</title>
            <meta name="description" content={description} />

            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href={`${withPrefix("/")}img/apple-touch-icon.png`}
            />
            <link
              rel="icon"
              type="image/png"
              href={`${withPrefix("/")}img/favicon-32x32.png`}
              sizes="32x32"
            />
            <link
              rel="icon"
              type="image/png"
              href={`${withPrefix("/")}img/favicon-16x16.png`}
              sizes="16x16"
            />

            <link
              rel="mask-icon"
              href={`${withPrefix("/")}img/safari-pinned-tab.svg`}
              color="#ff4400"
            />
            <meta name="theme-color" content="#fff" />

            <meta property="og:type" content="business.business" />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:url" content="/" />
            <meta property="og:image" content={`${siteUrl}/img/header-4.png`} />
            <meta property="twitter:card" content="summary_large_image" />
            <meta
              property="twitter:image"
              content={`${siteUrl}/img/twitter-summary-large.png`}
            />
            <meta
              property="twitter:title"
              content="COVID-19 Host Genetics Initiative"
            />
            <meta
              property="twitter:description"
              content="The COVID-19 host genetics initiative aims to provide support and an analytical network for studies that are broadly interested in identifying genetic determinants of COVID-19 susceptibility and severity. Such discoveries could help to generate hypotheses for drug repurposing, identify individuals at unusually high or low risk, and contribute to global knowledge of the biology of SARS-CoV-2 infection and disease."
            />
          </Helmet>
          <Navbar />
          <Container>
            {titleBar}
            {children}
          </Container>
        </Container>
      </ThemeProvider>
    </ScopedCssBaseline>
  );
};

export default TemplateWrapper;
