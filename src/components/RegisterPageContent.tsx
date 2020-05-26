import React, { useState, useEffect } from "react";
import { Container } from "./materialUIContainers";

const RegisterPageContent = () => {
  const [airTable, setAirTable] = useState<React.ReactNode | null>(null);
  useEffect(() => {
    setAirTable(
      <iframe
        className="airtable-embed airtable-dynamic-height"
        src="https://airtable.com/embed/shrzIhb1Ih1XqNalH?backgroundColor=blue"
        frameBorder="0"
        onWheel={undefined}
        width="100%"
        height="4200px"
        style={{
          backgroundColor: "transparent",
          border: "1px solid #ccc",
        }}
      ></iframe>
    );
  }, []);

  return <Container fixed={true}>{airTable}</Container>;
};
export default RegisterPageContent;
