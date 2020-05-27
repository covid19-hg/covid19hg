import React from "react";
import Layout from "../../components/NewLayout";
import useCanonicalLinkMetaTag from "../../components/useCanonicalLinkMetaTag";
import ContactPageContent from "../../components/ContactPageContent";

const Index = () => {
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/contact/");

  return (
    <Layout title="Contact">
      {canonicalLinkMetaTag}
      <ContactPageContent />
    </Layout>
  );
};

export default Index;
