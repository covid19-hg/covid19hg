/* eslint-disable */
const fetchPartnersData = require("./fetchPartnersData");
const path = require("path")
const fs = require("fs");

const saveData = async () => {
  console.log("Begin execution");
  try {
    const data = await fetchPartnersData();
    const destination = path.resolve(__dirname, "../src/partners.json");
    fs.writeFileSync(destination, JSON.stringify(data));
    console.log("File saved to destination " + destination);
  } catch (err) {
    console.error(err.toString());
  }
}

saveData()
