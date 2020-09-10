const dotEnv = require("dotenv");
const { gatsbyRemarkAutolinkHeadersClassName } = require("./buildConstants");

const localConfig = dotEnv.config({
  path: `.env.${process.env.NODE_ENV}`,
});
if (localConfig.error) {
  console.warn(
    "Cannot load local env variables. Ignore if on CI, if no local-specifiv env variables are needed or if using netlify dev.\n",
    localConfig.error
  );
}

module.exports = {
  siteMetadata: {
    siteUrl: "https://www.covid19hg.org",
    title: "COVID-19 Host Genetics Initiative",
    description:
      "The COVID-19 host genetics initiative aims to provide support and an analytical network for studies that are broadly interested in identifying genetic determinants of COVID-19 susceptibility and severity. Such discoveries could help to generate hypotheses for drug repurposing, identify individuals at unusually high or low risk, and contribute to global knowledge of the biology of SARS-CoV-2 infection and disease.",
  },
  plugins: [
    "gatsby-plugin-favicon",
    "gatsby-plugin-typescript",
    "gatsby-plugin-material-ui",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: process.env.GOOGLE_ANLYTICS_TRACKING_ID,
        head: true,
      },
    },
    "gatsby-plugin-react-helmet",
    {
      // keep as first gatsby-source-filesystem plugin for gatsby image support
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/static/img`,
        name: "uploads",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/pages`,
        name: "pages",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/img`,
        name: "images",
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-relative-images",
          },
          {
            resolve: "gatsby-remark-images",
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 2048,
            },
          },
          {
            resolve: "gatsby-remark-copy-linked-files",
            options: {
              destinationDir: "static",
            },
          },
          {
            resolve: "gatsby-remark-autolink-headers",
            options: {
              className: gatsbyRemarkAutolinkHeadersClassName,
              enableCustomId: true,
              // This is the height of the AppBar:
              offsetY: "64",
            },
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-netlify-cms",
      options: {
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
    "gatsby-plugin-netlify", // make sure to keep it last in the array
  ],
};
