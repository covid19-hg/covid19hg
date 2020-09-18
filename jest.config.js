/* eslint-env node */
// https://www.gatsbyjs.org/docs/unit-testing/#2-creating-a-configuration-file-for-jest
module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": "<rootDir>/jest-preprocess.js",
  },
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/public`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
};
