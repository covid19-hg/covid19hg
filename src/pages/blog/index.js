import React from "react";

import Layout from "../../components/NewLayout";
import BlogRoll from "../../components/BlogRoll";
import useCanonicalLinkMetaTag from "../../components/useCanonicalLinkMetaTag";
import { Container } from "../../components/materialUIContainers";

const BlogIndexPage = () => {
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/blog/");
  return (
    <Layout title="News">
      {canonicalLinkMetaTag}
      <Container>
        <BlogRoll />
      </Container>
    </Layout>
  );
};

export default BlogIndexPage;
