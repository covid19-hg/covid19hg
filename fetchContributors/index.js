const fetchAdditionalContributorsData = require("./fetchAdditionalContributorsData");
const fs = require("fs");
const path = require("path");

const saveData = async () => {
  console.log("Begin execution");
  try {
    const contributors = await fetchAdditionalContributorsData();
    const destination = path.resolve("../src/acknowledgement.json");
    fs.writeFileSync(destination, JSON.stringify(contributors));
    console.log("File saved to destination " + destination);
  } catch (err) {
    console.error(err.toString());
  }
};

saveData();
