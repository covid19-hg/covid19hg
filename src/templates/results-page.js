import React from "react";
import PropTypes from "prop-types";
import Img from "gatsby-image";
import Layout from "../components/NewLayout";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import { Link as GatsbyLink } from "gatsby";
import { Container, Grid } from "../components/materialUIContainers";
import {
  Card,
  CardContent,
  Typography,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
import Release from "../components/Release";

const useStyles = makeStyles(() => ({
  miniTitle: {},
}));

// const Analysis = (analysis) => {
//   console.log("release", analysis);
//   // const tableRows = analysis.studies.map(study => (
//   //   <TableRow key={study.study}>
//   //     <TableCell>{study.study}</TableCell>
//   //     <TableCell>{study.cases}</TableCell>
//   //     <TableCell>{study.controls}</TableCell>
//   //   </TableRow>
//   // ))
//   return (
//     <Card>
//       <CardContent>
//         <Typography variant="h5">{title}</Typography>
//         <Grid container={true} alignItems={"center"}>
//           <Grid item={true} xs={releaseLeftColumnWidthXs} md={releaseLeftColumnWidthMd}>
//             <Typography variant="h6" >Release date</Typography>
//           </Grid>
//           <Grid item={true} xs={releaseRightColumnWidthXs} md={releaseRightColumnWidthMd}>
//             <Typography >{date}</Typography>
//           </Grid>
//           <Grid item={true} xs={releaseLeftColumnWidthXs} md={releaseLeftColumnWidthMd}>
//             <Typography variant="h6">Contributing Studies</Typography>
//           </Grid>
//           <Grid item={true} xs={releaseRightColumnWidthXs} md={releaseRightColumnWidthMd}>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Name</TableCell>
//                     <TableCell>n_cases</TableCell>
//                     <TableCell>n_controls</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 {/* <TableBody> {tableRows} </TableBody> */}
//               </Table>
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   )
// }

const ResultsPageTemplate = ({ title, releases }) => {
  const releaseElems = releases.map((release, index) => (
    <Release {...release} key={index} />
  ));
  return <Container marginTop={2}>{releaseElems}</Container>;
};

const ResultsPage = ({ data, release }) => {
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/results/");
  const { frontmatter } = data.markdownRemark;
  return (
    <Layout title={frontmatter.title}>
      {canonicalLinkMetaTag}
      <ResultsPageTemplate releases={frontmatter.releases} />
    </Layout>
  );
};

ResultsPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
};
export default ResultsPage;

export const pageQuery = graphql`
  query ResultsPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "results-page" } }) {
      frontmatter {
        title
        releases {
          title
          date
          notes
          data_columns {
            column
            description
          }
          authors {
            name
            study
            affiliation
          }
          studyAbbreviations {
            abbreviation
            full_name
          }
          analyses {
            name
            phenotype
            population
            download {
              name
              gz_url
              tbi_url
            }
            studies {
              study
              cases
              controls
            }
            manhattan {
              image {
                publicURL
              }
            }
            qqplot {
              image {
                publicURL
              }
            }
          }
        }
      }
    }
  }
`;
