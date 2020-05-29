import React from "react";
import Layout from "../components/Layout";
import { graphql } from "gatsby";
import PropTypes from "prop-types";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import ProjectsPageContent from "../components/ProjectsPageContent";

const ProjectsPage = ({ data }) => {
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/projects/");
  const {
    markdownRemark: {
      frontmatter: { title, projectsIntro, projects },
    },
  } = data;
  console.log("data", data);
  return (
    <Layout title={title}>
      {canonicalLinkMetaTag}
      <ProjectsPageContent projects={projects} projectsIntro={projectsIntro} />
    </Layout>
  );
};

ProjectsPage.propTypes = {
  data: PropTypes.object,
};

export default ProjectsPage;

export const pageQuery = graphql`
  query ProjectsPage {
    markdownRemark(frontmatter: { templateKey: { eq: "projects-page" } }) {
      frontmatter {
        title
        projectsIntro
        projects {
          title
          description
          contact_persons {
            name
          }
          slack_channel
        }
      }
    }
  }
`;
