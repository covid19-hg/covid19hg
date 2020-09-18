import React, { useState, useEffect, useRef } from "react";
import { Container } from "./materialUIContainers";
import { makeStyles, Theme } from "@material-ui/core";

const contentTopMargin = 2;
const toolbarMinHeightToContentHeight = (toolbarHeight: number, theme: Theme) =>
  `calc(99vh - ${toolbarHeight}px - ${theme.spacing(contentTopMargin)}px)`;
const useStyles = makeStyles((theme: Theme) => {
  const { minHeight, ...rest } = theme.mixins.toolbar;
  const rootStyle: any = {
    height: toolbarMinHeightToContentHeight(minHeight as number, theme),
  };
  for (const [key, value] of Object.entries(rest)) {
    rootStyle[key] = {
      height: toolbarMinHeightToContentHeight(value as number, theme),
    };
  }
  return {
    root: rootStyle,
  };
});

const RegisterPageContent = () => {
  const [airTable, setAirTable] = useState<React.ReactElement<any>>(<div />);
  const containerElRef = useRef<HTMLDivElement | null>(null);
  const classes = useStyles();
  useEffect(() => {
    const { current: containerEl } = containerElRef;
    if (containerEl !== null) {
      const { height } = containerEl.getBoundingClientRect();
      console.log("height", height);
      setAirTable(
        <iframe
          className="airtable-embed"
          src="https://airtable.com/embed/shrzIhb1Ih1XqNalH?backgroundColor=blue"
          frameBorder="0"
          width="100%"
          height={height}
          style={{ background: "transparent", border: "1px solid #ccc" }}
        ></iframe>
      );
    }
  }, []);

  return (
    <Container
      ref={containerElRef}
      fixed={true}
      className={classes.root}
      marginTop={contentTopMargin}
    >
      {airTable}
    </Container>
  );
};
export default RegisterPageContent;
