import React, { useState } from "react";
import { Container } from "../components/materialUIContainers";
import { Typography, Link } from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import initial from "lodash/initial";
import last from "lodash/last";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

interface File {
  description: string;
  filename: string;
  link: string;
}

interface Chart {
  title: string | null;
  description: string | null;
  externalImages: string[] | null;
  internalImages: { image: { publicURL: string } }[] | null;
}

const Chart = (props: { chart: Chart }) => {
  const {
    chart: { title, description, externalImages, internalImages },
  } = props;
  const descriptionElem =
    description === null ? null : (
      <Typography>
        <ReactMarkdown source={description} />
      </Typography>
    );
  let externalImageElems: React.ReactNode;
  if (externalImages === null) {
    externalImageElems = null;
  } else {
    externalImageElems = externalImages.map((link) => (
      <img width="80%" src={link} />
    ));
  }
  let internalImageElems: React.ReactNode;
  if (internalImages === null) {
    internalImageElems = null;
  } else {
    internalImageElems = internalImages.map(({ image: { publicURL } }) => (
      <img width="80%" src={publicURL} />
    ));
  }
  const titleElem =
    title === null ? null : <Typography variant="h6">{title}</Typography>;
  return (
    <>
      {titleElem}
      {descriptionElem}
      {externalImageElems}
      {internalImageElems}
    </>
  );
};

interface Analysis {
  title: string;
  summary: string;
  charts: Chart[] | null;
  authors: string[];
  files: File[];
}

interface Release {
  title: string;
  intro: string;
  analyses: Analysis[];
}

interface Props {
  title: string;
  releases: Release[];
}

const Analysis = (props: { analysis: Analysis }) => {
  const {
    analysis: { title, summary, charts, authors, files },
  } = props;

  let authorString: string;
  if (authors.length === 1) {
    authorString = authors[0];
  } else {
    const restAuthors = initial(authors);
    const lastAuthor = last(authors);
    authorString = `${restAuthors.join(", ")} and ${lastAuthor}.`;
  }
  let chartElems: React.ReactNode;
  if (charts === null) {
    chartElems = null;
  } else {
    chartElems = charts.map((chart, index) => (
      <Chart chart={chart} key={index} />
    ));
  }
  const fileElems = files.map(({ description, filename, link }, index) => (
    <React.Fragment key={index}>
      <Typography variant="h6">{description}</Typography>
      <Typography gutterBottom={true}>
        {" "}
        <Link href={link}>{filename}</Link>{" "}
      </Typography>
    </React.Fragment>
  ));
  return (
    <Container disableGutters={true} marginTop={2}>
      <Typography variant="h4" component="h2" gutterBottom={true}>
        {title}
      </Typography>
      <Typography variant="h6" component="h3">
        Summary
      </Typography>
      <Typography>
        <ReactMarkdown source={summary} />
      </Typography>
      {chartElems}
      <Typography variant="h6" component="h3">
        Authors
      </Typography>
      <Typography gutterBottom={true}>{authorString}</Typography>
      {fileElems}
    </Container>
  );
};

const Release = (props: { release: Release }) => {
  const {
    release: { intro, analyses },
  } = props;
  const analysisElems = analyses.map((item, index) => (
    <Analysis analysis={item} key={index} />
  ));
  return (
    <>
      <Typography>{intro}</Typography>
      {analysisElems}
    </>
  );
};
const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const InSilicoFollowUpPageContent = ({ releases }: Props) => {
  const [selected, setSelected] = useState(0);
  const handleChange = (_: React.ChangeEvent<unknown>, value: number) =>
    setSelected(value);
  const tabs = releases.map(({ title }, index) => (
    <Tab label={title} {...a11yProps(index)} />
  ));
  const tabPanels = releases.map((_: unknown, index) => (
    <TabPanel value={selected} index={index}>
      <Release release={releases[index]} />
    </TabPanel>
  ));
  return (
    <>
      <Box bgcolor="primary.main" color="info.contrastText">
        <Tabs value={selected} onChange={handleChange} aria-label="releases">
          {tabs}
        </Tabs>
      </Box>

      <Container marginTop={2}>{tabPanels}</Container>
    </>
  );
};

export default InSilicoFollowUpPageContent;
