import React from "react";
import { Link as GatsbyLink } from "gatsby";
import { Grid, Container } from "./materialUIContainers";
import {
  Card,
  Typography,
  CardContent,
  CardActions,
  Button,
  makeStyles,
  Theme,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

const useStyles = makeStyles((theme: Theme) => ({
  post: {
    padding: theme.spacing(2),
  },
  readMore: {
    backgroundColor: theme.palette.background.default,
  },
}));

interface Props {
  data: {
    allMarkdownRemark: {
      edges: any[];
    };
  };
}
const BlogItemListing = ({ data }: Props) => {
  const classes = useStyles();
  const { edges: posts } = data.allMarkdownRemark;
  const postElems = posts.map(({ node: post }) => (
    <Grid item={true} xs={12} md={6} key={post.fields.slug}>
      <Card className={classes.post}>
        <CardContent>
          <Typography variant="h5" component={GatsbyLink} to={post.fields.slug}>
            {post.frontmatter.title}
          </Typography>
          <Typography variant="h6"> {post.frontmatter.date} </Typography>

          <Typography> {post.excerpt} </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            component={GatsbyLink}
            to={post.fields.slug}
            className={classes.readMore}
            endIcon={<ArrowForwardIcon />}
          >
            Keep Reading
          </Button>
        </CardActions>
      </Card>
    </Grid>
  ));
  return (
    <Container fixed={true} disableGutters={true}>
      <Grid container={true} spacing={3} marginTop={2}>
        {postElems}
      </Grid>
    </Container>
  );
};

export default BlogItemListing;
