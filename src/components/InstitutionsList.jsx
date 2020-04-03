import React from "react";

const InstitutionsList = ({ mapData }) => {
  const rows = mapData.map(
    ({ study_biobank, coordinator, affiliation, city_country }, index) => (
      <tr key={`item-${index}`}>
        <td>{study_biobank}</td>
        <td>{coordinator}</td>
        <td>{affiliation}</td>
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
          <th>Affiliation</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default InstitutionsList;
