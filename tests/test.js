const bigman = require("../index");

const options = {
  collectionName: "Abjadiyat",
  workflows: "Login",
  environment: "prod",
  workflowGroups: "Teachers App",
  variables: {},
};

bigman.runTest(options);
