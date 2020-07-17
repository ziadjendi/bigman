const pmapi = require("./libs/postmanAPI");
const _ = require("lodash");
const test = require("./libs/test");
require("./libs/config")();

const listCollections = async () => {
  const { collections } = await pmapi.getCollections();
  return collections;
};

const getCollectionUID = async (collectionName) => {
  const { collections } = await pmapi.getCollections();
  const coll = collections.find((coll) => coll.name === collectionName);
  if (!coll) throw new Error("The collection name is not valid/exists");
  return coll.uid;
};

const listEnvironments = async () => {
  const envs = await pmapi.getEnvironments();
  return envs;
};

const getEnvironmentUID = async (environmentName) => {
  const { environments } = await pmapi.getEnvironments();
  const env = environments.find((env) => env.name === environmentName);
  if (!env) throw new Error("The environment name is not valid/exists");
  return env.uid;
};

const getEnvironment = async (environmentName) => {
  const environmentUID = await getEnvironmentUID(environmentName);
  const payload = await pmapi.getEnvironment(environmentUID);
  return payload;
};

const setEnvironmentVars = async (environmentName, variables) => {
  const { environment } = await getEnvironment(environmentName);
  for (const varName of Object.keys(variables)) {
    const existVar = environment.values.find(
      (varObj) => varObj.key === varName
    );
    const varValue =
      typeof variables[varName] === "string"
        ? variables[varName]
        : JSON.stringify(variables[varName]);
    if (existVar) {
      const index = environment.values.indexOf(existVar);
      existVar.value = varValue;
      environment.values[index] = existVar;
    } else {
      const newVar = {
        key: varName,
        value: varValue,
      };
      environment.values.push(newVar);
    }
  }
  const envUID = await getEnvironmentUID(environmentName);
  const data = await pmapi.updateEnvironment(envUID, { environment });
  return data;
};

const workflowGroups = async (collectionID) => {
  const { collection } = await pmapi.getCollection(collectionID);
  const groups = collection.item;
  return groups;
};

const listWFGroups = async (collectionName) => {
  const collectionID = await getCollectionUID(collectionName);
  const res = await workflowGroups(collectionID);
  const wfGroups = res.map((item) => item.name);
  console.log(wfGroups);
  return wfGroups;
};

const listWorkflows = async (groupName) => {
  try {
    const collections = await listCollections();
    let groupInfo = null;
    for (const coll of collections) {
      const groups = await workflowGroups(coll.uid);
      groupInfo = groups.find((group) => group.name === groupName);

      if (groupInfo) {
        groupInfo.collectionID = coll.uid;
        break;
      }
    }
    if (!groupInfo)
      throw new Error("The workflow group name is not valid/exists");
    const workflows = groupInfo.item.map((wf) => wf.name);
    const result = { collectionID: groupInfo.collectionID, workflows };
    return result;
  } catch (error) {
    console.error(error);
  }
};

const runTest = async ({
  collectionName,
  wfGroups = [],
  environment = "dev",
  workflows = [],
  variables = {},
}) => {
  if (typeof collectionName !== "string")
    throw new Error("Collection name is not valid!!!");
  const environmentUID = await getEnvironmentUID(environment);
  if (Object.keys(variables)) await setEnvironmentVars(environment, variables);
  const collectionUID = await getCollectionUID(collectionName);
  if (!workflows.length && !wfGroups.length) {
    test(collectionUID, environmentUID);
  } else {
    const collection = await pmapi.getCollection(collectionUID);
    for (const wfGroup of collection.item) {
      if ((wfGroups && wfGroups.includes(wfGroup.name)) || !wfGroups.length) {
        for (const wf of wfGroup.item) {
          if (!workflows.includes(wf.name) && workflows.length) {
            const index = wfGroup.item.indexOf(wf);
            delete wfGroup.item[index];
          }
        }
        wfGroup.item = _.compact(wfGroup.item);
      } else {
        const index = collection.item.indexOf(wfGroup);
        delete collection.item[index];
      }
    }
    await test(collection, environmentUID);
  }
};

module.exports.default = {
  listCollections,
  getCollectionUID,
  listWFGroups,
  listWorkflows,
  listEnvironments,
  getEnvironmentUID,
  setEnvironmentVars,
  runTest,
};

exports.listCollections = listCollections;
exports.getCollectionUID = getCollectionUID;
exports.listWFGroups = listWFGroups;
exports.listWorkflows = listWorkflows;
exports.listEnvironments = listEnvironments;
exports.getEnvironmentUID = getEnvironmentUID;
exports.setEnvironmentVars = setEnvironmentVars;
exports.runTest = runTest;
