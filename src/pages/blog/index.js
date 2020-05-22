import React from "react";

import Layout from "../../components/NewLayout";
import BlogRoll from "../../components/BlogRoll";
import useCanonicalLinkMetaTag from "../../components/useCanonicalLinkMetaTag";

const BlogIndexPage = () => {
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/blog/");
  return (
    <Layout title="News">
      {canonicalLinkMetaTag}
      <BlogRoll />
    </Layout>
  );
};

export default BlogIndexPage;
