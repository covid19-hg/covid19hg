import React, { useState, useEffect } from "react";
import Layout from "../../components/NewLayout";
import useCanonicalLinkMetaTag from "../../components/useCanonicalLinkMetaTag";
import { Container } from "../../components/materialUIContainers";

const Index = () => {
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/register/");
  const [airTable, setAirTable] = useState(null);
  useEffect(() => {
    setAirTable(
      <iframe
        class="airtable-embed airtable-dynamic-height"
        src="https://airtable.com/embed/shrzIhb1Ih1XqNalH?backgroundColor=blue"
        frameborder="0"
        onmousewheel=""
        width="100%"
        height="4200px"
        style={{
          background: "transparent",
          border: "1px solid #ccc",
        }}
      ></iframe>
    );
  }, []);

  return (
    <Layout>
      {canonicalLinkMetaTag}
      <Container>{airTable}</Container>
    </Layout>
  );
};

export default Index;
