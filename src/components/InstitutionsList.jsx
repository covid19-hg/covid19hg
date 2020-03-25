import React from "react"
const data = require("../data.json");

const InstitutionsList = () => {
  const items = data.map(({study_biobank}, index) => (
    <li key={`item-{index}`}>{study_biobank}</li>
  ))
  return (
    <ul>{items}</ul>
  )
}

export default InstitutionsList
