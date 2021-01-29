import React from "react";
import AcknowledgementPageContent from "../components/AcknowlegementPageContent";
import Layout from "../components/NewLayout";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";

const AcknowledgementPage = () => {
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/acknowledgements/");
  return (
    <Layout title="Acknowledgements">
      {canonicalLinkMetaTag}
      <AcknowledgementPageContent />
    </Layout>
  );
};

export default AcknowledgementPage;
