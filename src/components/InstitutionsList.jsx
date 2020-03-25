import React from "react";
const data = require("../data.json");

const InstitutionsList = () => {
  const rows = data.map(
    ({ study_biobank, coordinator, city_country }, index) => (
      <tr key={`item-${index}`}>
        <td>{study_biobank}</td>
        <td>{coordinator}</td>
        <td>{city_country}</td>
      </tr>
    )
  );
  return (
    <table className="table is-striped">
      <thead>
        <tr>
          <th>Study</th>
          <th>Coordinator</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default InstitutionsList;
