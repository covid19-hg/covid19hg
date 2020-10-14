/* eslint-env node */
const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");
const ForkTSCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { defaultLangKey } = require("./languages");

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "develop") {
    actions.setWebpackConfig({
      plugins: [new ForkTSCheckerWebpackPlugin()],
    });
  }
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /mapbox-gl/,
            use: loaders.null(),
          },
        ],
      },
    });
  }
};

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
              langKey
            }
            frontmatter {
              tags
              templateKey
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => console.error(e.toString()));
      return Promise.reject(result.errors);
    }

    const posts = result.data.allMarkdownRemark.edges;

    const defaultLangPosts = posts.filter(
      ({ node }) =>
        !node.fields.langKey || node.fields.langKey === defaultLangKey
    );
    const otherLangPosts = posts.filter(
      ({ node }) =>
        !!node.fields.langKey && node.fields.langKey !== defaultLangKey
    );

    defaultLangPosts.forEach((edge) => {
      const id = edge.node.id;
      const slug = edge.node.fields.slug;
      const component = path.resolve(
        `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
      );
      const translationPosts = otherLangPosts.filter((innerEdge) =>
        innerEdge.node.fields.slug.includes(slug)
      );
      const otherLanguages = translationPosts.map(
        (innerEdge) => innerEdge.node.fields.langKey
      );

      createPage({
        path: slug,
        tags: edge.node.frontmatter.tags,
        component,
        // additional data can be passed via context
        context: {
          id,
          slug: edge.node.fields.slug,
          langKey: defaultLangKey,
          langs: otherLanguages,
        },
      });
      translationPosts.forEach((innerEdge) => {
        const pagePath = innerEdge.node.fields.slug.replace(".", "/");
        const langKey = innerEdge.node.fields.langKey;
        const langs = [defaultLangKey].concat(
          otherLanguages.filter((item) => item !== langKey)
        );
        createPage({
          path: pagePath,
          component: path.resolve(
            `src/templates/${String(innerEdge.node.frontmatter.templateKey)}.js`
          ),
          context: {
            id: innerEdge.node.id,
            slug: innerEdge.node.fields.slug,
            langKey,
            langs,
            canonicalLink: slug,
          },
        });
      });
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (
    node.internal.type === `MarkdownRemark` &&
    node.internal.fieldOwners.slug !== "gatsby-plugin-i18n"
  ) {
    const value = createFilePath({ node, getNode });
    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};
