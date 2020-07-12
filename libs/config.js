require("dotenv").config();
module.exports = function () {
  if (!process.env.POSTMANKEY) {
    throw new Error("FATAL ERROR: Postman API Key is not defined.");
  }
};
