import React from "react";
import Layout from "../../components/NewLayout";
import useCanonicalLinkMetaTag from "../../components/useCanonicalLinkMetaTag";
import RegisterPageContent from "../../components/RegisterPageContent";

const Index = () => {
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/register/");

  return (
    <Layout title="Register">
      {canonicalLinkMetaTag}
      <RegisterPageContent />
    </Layout>
  );
};

export default Index;
