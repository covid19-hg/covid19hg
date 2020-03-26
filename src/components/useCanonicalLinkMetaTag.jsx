import React, { useMemo } from "react";
import useSiteMetadata from "./SiteMetadata";
import { Helmet } from "react-helmet";

const useCanonicalLinkMetaTag = slug => {
  const { siteUrl } = useSiteMetadata();
  const result = useMemo(() => {
    const fullUrl = `${siteUrl}${slug}`
    return (
      <Helmet>
        <meta property="og:url" content={fullUrl} />
        <link rel="canonical" href={fullUrl} />
      </Helmet>
    );
  }, [slug, siteUrl]);
  return result;
};

export default useCanonicalLinkMetaTag;
