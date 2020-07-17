const bigman = require("bigman");
const options = {
  collectionName: "Project API",
  wfGroups: ["Web Application", "Mobile Application"],
  workflows: ["Login", "profile"],
  environment: "production",
  variables: {},
};
bigman.runTest(options);
