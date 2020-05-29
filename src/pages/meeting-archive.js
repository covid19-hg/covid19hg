import React from "react";
import Layout from "../components/NewLayout";
import MeetingNotesArchive from "../components/MeetingNotesArchive";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";
import { Container } from "../components/materialUIContainers";

const MeetingArchivePage = () => {
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/meeting-archive/");
  return (
    <Layout title="Meeting Archive">
      {canonicalLinkMetaTag}
      <Container>
        <MeetingNotesArchive />
      </Container>
    </Layout>
  );
};

export default MeetingArchivePage;
