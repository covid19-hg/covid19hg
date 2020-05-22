import React from "react";
import clsx from "clsx";
import Chip from "@material-ui/core/Chip";
import { makeStyles, Theme } from "@material-ui/core/styles";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Button from "@material-ui/core/Button";
import { ListDatum } from "../types";
import Typography from "@material-ui/core/Typography";
import { Grid } from "./materialUIContainers";
import { ExtractProps } from "./partnersPageStylingParams";
import Link from "@material-ui/core/Link";
import MuiCard from "@material-ui/core/Card";
import { CardContent, Divider } from "@material-ui/core";

const viralSequencingColor = "rgb(204, 223, 254)";
const transcriptomicsColor = "rgb(193, 244, 233)";
const proteomicsColor = "rgb(210, 246, 197)";
const metabolomicsColor = "rgb(255, 232, 182)";
const antibodyProfilingColor = "rgb(206, 240, 253)";
const immuneProfilingColor = "rgb(254, 225, 212)";

const viralSequencingStyleName = "viralSequencing";
const transcriptomicsStyleName = "transcriptomics";
const proteomicsStyleName = "proteomics";
const metabolomicsStyleName = "metabolomics";
const antibodyProfilingStyleName = "antibodyProfiling";
const immuneProfilingStyleName = "immuneProfiling";

export const assayOptions = [
  {
    name: "Viral sequencing",
    styleName: viralSequencingStyleName,
    color: viralSequencingColor,
  },
  {
    name: "Transcriptomics",
    styleName: transcriptomicsStyleName,
    color: transcriptomicsColor,
  },
  {
    name: "Proteomics",
    styleName: proteomicsStyleName,
    color: proteomicsColor,
  },
  {
    name: "Metabolomics",
    styleName: metabolomicsStyleName,
    color: metabolomicsColor,
  },
  {
    name: "Antibody profiling",
    styleName: antibodyProfilingStyleName,
    color: antibodyProfilingColor,
  },
  {
    name: "Immune profiling",
    styleName: immuneProfilingStyleName,
    color: immuneProfilingColor,
  },
];
const useMaterialStyles = makeStyles((theme: Theme) => ({
  titleContainerWithLink: {
    display: "flex",
    alignItems: "center",
  },
  openInNewIcon: {
    marginLeft: theme.spacing(1),
  },
  miniTitle: {
    ...theme.typography.h6,
    fontSize: theme.typography.body1.fontSize,
  },
  miniTitleRightColumn: {
    marginTop: theme.spacing(1),
  },
  wesChip: {
    backgroundColor: "rgb(120, 166, 215)",
  },
  wgsChip: {
    backgroundColor: "rgb(163, 209, 157)",
  },
  gwasChip: {
    backgroundColor: "rgb(255, 245, 155)",
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  researchCategoryChip: {
    margin: theme.spacing(0.5, 0.5, 0.5, 0),
  },
  [viralSequencingStyleName]: {
    backgroundColor: viralSequencingColor,
  },
  [transcriptomicsStyleName]: {
    backgroundColor: transcriptomicsColor,
  },
  [proteomicsStyleName]: {
    backgroundColor: proteomicsColor,
  },
  [metabolomicsStyleName]: {
    backgroundColor: metabolomicsColor,
  },
  [antibodyProfilingStyleName]: {
    backgroundColor: antibodyProfilingColor,
  },
  [immuneProfilingStyleName]: {
    backgroundColor: immuneProfilingColor,
  },
  contactButtonRoot: {
    marginLeft: theme.spacing(1),
    borderRadius: 20,
    alignSelf: "center",
  },
}));

const LeftHalfLeftColumnItem = (props: { children: React.ReactNode }) => (
  <Grid item={true} md={3} display="flex" alignItems={"center" as "center"}>
    {" "}
    {props.children}{" "}
  </Grid>
);
const LeftHalfRightColumnItem = ({
  children,
  ...rest
}: ExtractProps<typeof Grid>) => (
  <Grid
    item={true}
    md={9}
    display="flex"
    alignItems={"center" as "center"}
    {...rest}
  >
    {" "}
    {children}{" "}
  </Grid>
);

interface Props {
  cardInfo: ListDatum;
  showContactForm: VoidFunction;
}
const Card = ({ cardInfo, showContactForm }: Props) => {
  const {
    study,
    investigator,
    affiliation,
    city,
    country,
    retrospective,
    prospective,
    retrospectiveSampleSize,
    prospectiveSampleSize,
    researchQuestion,
    studyDesignUnformatted,
    wes,
    wgs,
    genotyping,
    assaysPlanned,
    otherAssays,
    studyLink,
    researchCategory,
  } = cardInfo;

  const classes = useMaterialStyles();

  let cardTitle: React.ReactElement<any>;
  if (studyLink === undefined) {
    cardTitle = (
      <Typography variant="h5" component="h4" gutterBottom={true}>
        {study}{" "}
      </Typography>
    );
  } else {
    cardTitle = (
      <Link
        href={studyLink}
        rel="noopener noreferrer"
        target="_blank"
        underline="none"
        className={classes.titleContainerWithLink}
      >
        <Typography
          variant="h5"
          component="h4"
          color="inherit"
          gutterBottom={true}
        >
          {" "}
          {study}{" "}
        </Typography>
        <OpenInNewIcon className={classes.openInNewIcon} />
      </Link>
    );
  }

  let studyTypeText;
  if (
    retrospective === true &&
    (prospective === false || prospective === undefined)
  ) {
    const retrospectiveSampleSizeText =
      retrospectiveSampleSize === undefined
        ? ""
        : `(n=${retrospectiveSampleSize})`;
    studyTypeText = `Retrospective${retrospectiveSampleSizeText}`;
  } else if (
    (retrospective === false || retrospective === undefined) &&
    prospective === true
  ) {
    const prospectiveSampleSizeText =
      prospectiveSampleSize === undefined ? "" : `(n=${prospectiveSampleSize})`;
    studyTypeText = `Prospective ${prospectiveSampleSizeText}`;
  } else if (retrospective === true && prospective === true) {
    const prospectiveSampleSizeText =
      prospectiveSampleSize === undefined ? "" : `(n=${prospectiveSampleSize})`;
    const retrospectiveSampleSizeText =
      retrospectiveSampleSize === undefined
        ? ""
        : `(n=${retrospectiveSampleSize})`;
    studyTypeText = `Retrospective${retrospectiveSampleSizeText}, Prospective${prospectiveSampleSizeText}`;
  }

  const wesChip =
    wes === true ? (
      <Chip label="WES" className={`${classes.wesChip} ${classes.chip}`} />
    ) : null;
  const wgsChip =
    wgs === true ? (
      <Chip label="WGS" className={`${classes.wgsChip} ${classes.chip}`} />
    ) : null;
  const gwasChip =
    genotyping === true ? (
      <Chip label="GWAS" className={`${classes.gwasChip} ${classes.chip}`} />
    ) : null;

  let mainAssayChips;
  if (assaysPlanned === undefined) {
    mainAssayChips = null;
  } else {
    mainAssayChips = assayOptions.map(({ name, styleName }) =>
      assaysPlanned.includes(name) ? (
        <Chip
          key={name}
          label={name}
          // @ts-ignore Temporary fix b/c the loop loops through object's
          // property names and TypeScript can't reason through that
          className={`${classes[styleName]} ${classes.chip}`}
        />
      ) : null
    );
  }
  const contactButton =
    cardInfo.shouldShowContactButton === true ? (
      <Button
        variant="outlined"
        size="small"
        className={classes.contactButtonRoot}
        onClick={() => showContactForm()}
      >
        Contact
      </Button>
    ) : null;
  let researchCategoriesElem;
  if (researchCategory !== undefined && researchCategory.length > 0) {
    const chips = researchCategory.map((name) => (
      <Chip key={name} label={name} className={classes.researchCategoryChip} />
    ));
    researchCategoriesElem = (
      <>
        <Grid
          container={true}
          display="flex"
          alignItems={"center" as "center"}
          marginTop={1}
        >
          <Grid item={true} md={4}>
            <Typography className={classes.miniTitle}>
              Research Categories
            </Typography>
          </Grid>
          <Grid item={true} md={8}>
            {chips}
          </Grid>
        </Grid>
      </>
    );
  } else {
    researchCategoriesElem = null;
  }

  return (
    <MuiCard>
      <CardContent>
        {cardTitle}
        <Divider />
        <Grid container={true} spacing={2} marginTop={1}>
          <Grid item={true} md={6}>
            <Grid container={true}>
              <LeftHalfLeftColumnItem>
                <Typography className={classes.miniTitle}>
                  Investigators
                </Typography>
              </LeftHalfLeftColumnItem>
              <LeftHalfRightColumnItem display="flex">
                <Typography>{investigator}</Typography>
                {contactButton}
              </LeftHalfRightColumnItem>

              <LeftHalfLeftColumnItem>
                <Typography className={classes.miniTitle}>
                  Affiliation{" "}
                </Typography>
              </LeftHalfLeftColumnItem>
              <LeftHalfRightColumnItem>
                <Typography>{affiliation} </Typography>
              </LeftHalfRightColumnItem>

              <LeftHalfLeftColumnItem>
                <Typography className={classes.miniTitle}>Location </Typography>
              </LeftHalfLeftColumnItem>
              <LeftHalfRightColumnItem>
                <Typography>{`${city}, ${country}`}</Typography>
              </LeftHalfRightColumnItem>

              <LeftHalfLeftColumnItem>
                <Typography className={classes.miniTitle}>Type </Typography>
              </LeftHalfLeftColumnItem>
              <LeftHalfRightColumnItem>
                <Typography>{studyTypeText} </Typography>
              </LeftHalfRightColumnItem>

              <LeftHalfLeftColumnItem>
                <Typography className={classes.miniTitle}>
                  Genetic Analysis{" "}
                </Typography>
              </LeftHalfLeftColumnItem>
              <LeftHalfRightColumnItem>
                {wesChip} {wgsChip} {gwasChip}
              </LeftHalfRightColumnItem>

              <LeftHalfLeftColumnItem>
                <Typography className={classes.miniTitle}>
                  Assays Planned
                </Typography>
              </LeftHalfLeftColumnItem>
              <LeftHalfRightColumnItem flexWrap="wrap">
                {" "}
                {mainAssayChips}{" "}
              </LeftHalfRightColumnItem>

              <LeftHalfLeftColumnItem>
                <Typography className={classes.miniTitle}>
                  Other Assays
                </Typography>
              </LeftHalfLeftColumnItem>
              <LeftHalfRightColumnItem> {otherAssays} </LeftHalfRightColumnItem>
            </Grid>
          </Grid>
          <Grid item={true} md={6}>
            <Typography className={classes.miniTitle}>
              Research Question
            </Typography>
            <Typography>{researchQuestion}</Typography>

            <Typography
              className={clsx(classes.miniTitle, classes.miniTitleRightColumn)}
            >
              Study Design
            </Typography>
            <Typography>{studyDesignUnformatted}</Typography>

            {researchCategoriesElem}
          </Grid>
        </Grid>
      </CardContent>
    </MuiCard>
  );
};

export default Card;
