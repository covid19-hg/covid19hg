import React from "react";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import Button from "@material-ui/core/Button";
import { ListDatum } from "../types";

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

const useMaterialStyles = makeStyles(() => ({
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
    margin: 2,
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
    marginLeft: "1rem",
    borderRadius: "20px",
  },
}));

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

  const materialStyles = useMaterialStyles();

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
      <Chip
        label="WES"
        className={`${materialStyles.wesChip} ${materialStyles.chip}`}
      />
    ) : null;
  const wgsChip =
    wgs === true ? (
      <Chip
        label="WGS"
        className={`${materialStyles.wgsChip} ${materialStyles.chip}`}
      />
    ) : null;
  const gwasChip =
    genotyping === true ? (
      <Chip
        label="GWAS"
        className={`${materialStyles.gwasChip} ${materialStyles.chip}`}
      />
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
          className={`${materialStyles[styleName]} ${materialStyles.chip}`}
        />
      ) : null
    );
  }

  let cardTitle;
  if (studyLink !== undefined) {
    cardTitle = (
      <a
        className="card-header-title"
        href={studyLink}
        rel="noopener noreferrer"
        target="_blank"
      >
        <div className="title is-4" style={{ marginBottom: 0 }}>
          {study}
        </div>
        <OpenInNewIcon style={{ marginLeft: "0.5rem" }} />
      </a>
    );
  } else {
    cardTitle = (
      <div className="card-header-title">
        <div className="title is-4" style={{ marginBottom: 0 }}>
          {study}
        </div>
      </div>
    );
  }

  let researchCategoriesElem;
  if (researchCategory !== undefined && researchCategory.length > 0) {
    const chips = researchCategory.map((name) => (
      <Chip key={name} label={name} className={materialStyles.chip} />
    ));
    researchCategoriesElem = (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "max-content 1fr",
          marginTop: "0.5rem",
          alignItems: "center",
          gridColumnGap: "1rem",
        }}
      >
        <div className="has-text-weight-bold">Research categories</div>
        <div style={{ justifySelf: "start" }}>{chips}</div>
      </div>
    );
  } else {
    researchCategoriesElem = null;
  }

  const contactButton =
    cardInfo.shouldShowContactButton === true ? (
      <Button
        variant="outlined"
        size="small"
        className={materialStyles.contactButtonRoot}
        onClick={() => showContactForm()}
      >
        Contact
      </Button>
    ) : null;

  return (
    <div className="card">
      <div className="card-header">{cardTitle}</div>
      <div className="card-content">
        <div className="columns">
          <div className="column is-half">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gridAutoRows: "auto",
                gridColumnGap: "1rem",
                gridRowGap: "0.5rem",
              }}
            >
              <div
                className="has-text-weight-bold"
                style={{ alignItems: "center", display: "flex" }}
              >
                <div>Investigators</div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                }}
              >
                <div>{investigator}</div>
                {contactButton}
              </div>
              <div className="has-text-weight-bold">Affiliation</div>
              <div>{affiliation}</div>
              <div className="has-text-weight-bold">Location</div>
              <div>{`${city}, ${country}`}</div>
              <div className="has-text-weight-bold">Type</div>
              <div>{studyTypeText}</div>
              <div className="has-text-weight-bold">Genetic analysis</div>
              <div>
                {wesChip} {wgsChip} {gwasChip}
              </div>
              <div className="has-text-weight-bold">Assays planned</div>
              <div>{mainAssayChips}</div>
              <div className="has-text-weight-bold">Other assays</div>
              <div>{otherAssays}</div>
            </div>
          </div>
          <div className="column is-half">
            <div className="has-text-weight-bold">Research question</div>
            <div> {researchQuestion} </div>
            <div className="has-text-weight-bold" style={{ marginTop: "1rem" }}>
              Study design
            </div>
            <div>{studyDesignUnformatted}</div>
            {researchCategoriesElem}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
