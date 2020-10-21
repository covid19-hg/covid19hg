import React from "react";
import { Container } from "../components/materialUIContainers";
import { Typography, Chip, makeStyles, Theme } from "@material-ui/core";
import { HTMLContent } from "./Content";
import { Link } from "gatsby";
import sortBy from "lodash/sortBy";
const {
  createLanguageLink,
  defaultLangKey,
  languages,
  rightToLeft,
} = require("../i18n");

enum LanguageDirection {
  LeftToRight = "ltr",
  RightToLeft = "rtl",
}

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

  let translationListingElem: React.ReactNode,
    languageDirection: LanguageDirection;
  if (langs === null) {
    translationListingElem = null;
    languageDirection = LanguageDirection.LeftToRight;
  } else {
    const languageLink = createLanguageLink(slug, langKey);
    if (langKey === defaultLangKey) {
      languageDirection = LanguageDirection.LeftToRight;
      const foreignTranslations = sortBy(
        langs.filter((lang) => lang !== defaultLangKey)
      );

      const translationLinkElems = foreignTranslations.map((lang, index) => {
        const pre = index < foreignTranslations.length - 1 ? " " : " and ";
        const post =
          index < foreignTranslations.length - 2
            ? ", "
            : index === foreignTranslations.length - 2
            ? " "
            : ".";
        return (
          <>
            {pre}
            <Link to={languageLink(lang)}>
              {languages.get(lang).nativeName}
            </Link>
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
      languageDirection =
        languages.get(langKey).direction === rightToLeft
          ? LanguageDirection.RightToLeft
          : LanguageDirection.LeftToRight;
      translationListingElem = (
        <Typography>
          <em>
            This is a translation in {languages.get(langKey).englishName}. You
            can also{" "}
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
      <Typography variant="h4" gutterBottom={true} dir={languageDirection}>
        {title}
      </Typography>
      <Typography gutterBottom={true} dir={languageDirection}>
        {date}
      </Typography>
      <Typography dir={languageDirection}>
        <HTMLContent content={content} className="" />
      </Typography>
      <Typography variant="h5" gutterBottom={true} dir={languageDirection}>
        Tags
      </Typography>
      {tagElems}
    </Container>
  );
};

export default BlogPostContent;
