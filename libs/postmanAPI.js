require("dotenv").config();
const http = require("./http");
const baseUrl = "https://api.getpostman.com";
const collectionsUrl = baseUrl + "/collections";
const environmentsUrl = baseUrl + "/environments";
const apiKey = process.env.POSTMANKEY;
const headers = {
  "x-api-key": apiKey,
};

function envUrl(id) {
  return environmentsUrl + "/" + id;
}

const getCollections = async () => {
  try {
    const { data } = await http.get(collectionsUrl, { headers });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getCollection = async (id) => {
  try {
    const { data } = await http.get(collectionsUrl + "/" + id, { headers });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getEnvironments = async () => {
  try {
    const { data } = await http.get(environmentsUrl, { headers });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getEnvironment = async (id) => {
  try {
    const { data } = await http.get(envUrl(id), { headers });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const updateEnvironment = async (id, payload) => {
  try {
    const { data } = await http.put(envUrl(id), payload, { headers });
    return data;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getCollections,
  getCollection,
  getEnvironments,
  getEnvironment,
  updateEnvironment,
};
