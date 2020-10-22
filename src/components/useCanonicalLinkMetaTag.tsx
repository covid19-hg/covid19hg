import React, { useMemo } from "react";
import useSiteMetadata from "./SiteMetadata";
import { Helmet } from "react-helmet";

const useCanonicalLinkMetaTag = (slug: string, canonicalSlug = slug) => {
  const { siteUrl } = useSiteMetadata();
  const result = useMemo(() => {
    const ogUrl = `${siteUrl}${slug}`;
    const canonicalUrl = `${siteUrl}${canonicalSlug}`;
    return (
      <Helmet>
        <meta property="og:url" content={ogUrl} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
    );
  }, [slug, siteUrl]);
  return result;
};

export default useCanonicalLinkMetaTag;
