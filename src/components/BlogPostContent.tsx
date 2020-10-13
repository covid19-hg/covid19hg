import React from "react";
import { Container } from "../components/materialUIContainers";
import { Typography, Chip, makeStyles, Theme } from "@material-ui/core";
import { HTMLContent } from "./Content";
import { Link } from "gatsby";
const { codeToLanguage, createLanguageLink } = require("../i18n");
const { defaultLangKey } = require("../../languages");

const useStyles = makeStyles((theme: Theme) => ({
  chip: {
    marginRight: theme.spacing(1),
  },
}));

interface Props {
  content: string;
  helmet: React.ReactNode;
  tags: string[];
  title: string;
  date: string;
  slug: string;
  langKey: string;
  langs: string[] | null;
}

const BlogPostContent = ({
  content,
  tags,
  helmet,
  title,
  date,
  langKey,
  langs,
  slug,
}: Props) => {
  const classes = useStyles();
  const tagElems = tags.map((tag, index) => (
    <Chip label={tag} key={index} className={classes.chip} />
  ));

  let translationListingElem: React.ReactNode;
  if (langs === null) {
    translationListingElem = null;
  } else {
    const languageLink = createLanguageLink(slug, langKey);
    if (langKey === defaultLangKey) {
      const foreignTranslations = langs.filter(
        (lang) => lang !== defaultLangKey
      );
      const translationLinkElems = foreignTranslations.map((lang, index) => {
        const pre = index < foreignTranslations.length - 1 ? " " : " and ";
        const post = index < foreignTranslations.length - 1 ? "," : ".";
        return (
          <>
            {pre}
            <Link to={languageLink(lang)}>{codeToLanguage(lang)}</Link>
            {post}
          </>
        );
      });
      translationListingElem = (
        <Typography>
          <em>This article has been translated into {translationLinkElems}</em>
        </Typography>
      );
    } else {
      translationListingElem = (
        <Typography>
          <em>
            This is a translation in {codeToLanguage(langKey)}. You can also{" "}
            <Link to={languageLink(defaultLangKey)}>
              read the original English version
            </Link>
            .
          </em>
        </Typography>
      );
    }
  }

  return (
    <Container marginTop={2} fixed={true}>
      {helmet}
      {translationListingElem}
      <Typography variant="h4" gutterBottom={true}>
        {title}
      </Typography>
      <Typography gutterBottom={true}>{date}</Typography>
      <Typography>
        <HTMLContent content={content} className="" />
      </Typography>
      <Typography variant="h5" gutterBottom={true}>
        Tags
      </Typography>
      {tagElems}
    </Container>
  );
};

export default BlogPostContent;
