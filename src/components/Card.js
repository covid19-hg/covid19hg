import React from "react"
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";

const viralSequencingColor = "rgb(204, 223, 254)"
const transcriptomicsColor = "rgb(193, 244, 233)"
const proteomicsColor = "rgb(210, 246, 197)"
const metabolomicsColor = "rgb(255, 232, 182)"
const antibodyProfilingColor = "rgb(206, 240, 253)"
const immuneProfilingColor = "rgb(254, 225, 212)"

const viralSequencingStyleName = "viralSequencing"
const transcriptomicsStyleName = "transcriptomics"
const proteomicsStyleName = "proteomics"
const metabolomicsStyleName = "metabolomics"
const antibodyProfilingStyleName = "antibodyProfiling"
const immuneProfilingStyleName = "immuneProfiling"

export const assayOptions = [
  {name: "Viral sequencing", styleName: viralSequencingStyleName, color: viralSequencingColor},
  {name: "Transcriptomics", styleName: transcriptomicsStyleName, color: transcriptomicsColor},
  {name: "Proteomics", styleName: proteomicsStyleName, color: proteomicsColor},
  {name: "Metabolomics", styleName: metabolomicsStyleName, color: metabolomicsColor},
  {name: "Antibody profiling", styleName: antibodyProfilingStyleName, color: antibodyProfilingColor},
  {name: "Immune profiling", styleName: immuneProfilingStyleName, color: immuneProfilingColor},
]

const useMaterialStyles = makeStyles(() => ({
  wesChip: {
    backgroundColor: "rgb(120, 166, 215)"
  },
  wgsChip: {
    backgroundColor: "rgb(163, 209, 157)"
  },
  gwasChip: {
    backgroundColor: "rgb(255, 245, 155)"
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
}));

const Card = ({cardInfo }) => {
  const {
    study, investigator, affiliation, city, country, retrospective, prospective,
    retrospectiveSampleSize, prospectiveSampleSize, researchQuestion, studyDesign,
    wes, wgs, genotyping, assaysPlanned, otherAssays
  } = cardInfo;

  const materialStyles = useMaterialStyles()

  let studyTypeText
  if (retrospective === true && prospective === false) {
    studyTypeText = `Retrospective (n=${retrospectiveSampleSize})`
  } else if (retrospective === false && prospective === true){
    studyTypeText = `Prospective (n=${prospectiveSampleSize})`
  } else {
    studyTypeText = `Retrospective (n=${retrospectiveSampleSize}), Prospective (n=${prospectiveSampleSize})`
  }

  const wesChip = (wes === true) ? (<Chip label="WES" className={materialStyles.wesChip}/>) : null
  const wgsChip = (wgs === true) ? (<Chip label="WGS" className={materialStyles.wgsChip}/>) : null
  const gwasChip = (genotyping === true) ? (<Chip label="GWAS" className={materialStyles.gwasChip}/>) : null

  let mainAssayChips
  if (assaysPlanned === undefined) {
    mainAssayChips = null
  } else {
    mainAssayChips = assayOptions.map(({name, styleName}) => assaysPlanned.includes(name) ? (<Chip key={name} label={name} className={materialStyles[styleName]}/>) : null)
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-title">{study}</div>
      </div>
      <div className="card-content">
        <div className="columns">
          <div className="column is-half">
            <table className="table is-narrow">
              <tbody>
                <tr>
                  <td className="has-text-weight-bold">Investigators</td>
                  <td>{investigator}</td>
                </tr>
                <tr>
                  <td className="has-text-weight-bold">Affiliation</td>
                  <td>{affiliation}</td>
                </tr>
                <tr>
                  <td className="has-text-weight-bold">Location</td>
                  <td>{`${city}, ${country}`}</td>
                </tr>
                <tr>
                  <td className="has-text-weight-bold">Type</td>
                  <td>{studyTypeText}</td>
                </tr>
                <tr>
                  <td className="has-text-weight-bold">Genetic analysis</td>
                  <td>{wesChip} {wgsChip} {gwasChip}</td>
                </tr>
                <tr>
                  <td className="has-text-weight-bold">Assays planned</td>
                  <td>{mainAssayChips}</td>
                </tr>
                <tr>
                  <td className="has-text-weight-bold">Other assays</td>
                  <td>{otherAssays}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="column is-half">
            <div className="has-text-weight-bold">Research question</div>
            <div> {researchQuestion} </div>
            <div className="has-text-weight-bold">Study design</div>
            <div>{studyDesign}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card
