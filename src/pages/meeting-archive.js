import React from "react";
import Layout from "../components/NewLayout";
import MeetingNotesArchive from "../components/MeetingNotesArchive";
import useCanonicalLinkMetaTag from "../components/useCanonicalLinkMetaTag";

const MeetingArchivePage = () => {
  const canonicalLinkMetaTag = useCanonicalLinkMetaTag("/meeting-archive/");
  return (
    <Layout title="Meeting Archive">
      {canonicalLinkMetaTag}
      <MeetingNotesArchive />
    </Layout>
  );
};

export default MeetingArchivePage;
