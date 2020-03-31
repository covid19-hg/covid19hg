import React, { useState, useEffect } from 'react'
// const data = require('../data.json')

const InstitutionsList = () => {
  const [airTable, setAirTable] = useState(null)
  useEffect(() => {
    setAirTable(
      <iframe
        class="airtable-embed"
        src="https://airtable.com/embed/shrlpTPNjEw7AQjtt?backgroundColor=blue&viewControls=on"
        frameborder="0"
        onmousewheel=""
        width="100%"
        height="2500px"
        style={{
          background: 'transparent',
          border: '1px solid #ccc',
        }}
      ></iframe>
    )
  }, [])

  return airTable

  // const rows = data.map(({ study_biobank, coordinator, city_country }, index) => (
  //   <tr key={`item-${index}`}>
  //     <td>{study_biobank}</td>
  //     <td>{coordinator}</td>
  //     <td>{city_country}</td>
  //   </tr>
  // ))

  // return (
  //   <table className="table is-striped">
  //     <thead>
  //       <tr>
  //         <th>Study</th>
  //         <th>Coordinator</th>
  //         <th>Location</th>
  //       </tr>
  //     </thead>
  //     <tbody>{rows}</tbody>
  //   </table>
  // )
}

export default InstitutionsList
