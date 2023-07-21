const databaseValidator = require("./databaseValidators");
const fileUploader = require("./fileUploader");
const generateJWT = require("./generateJWT");
const googleVerify = require("./googleVerify");

module.exports = {
  ...databaseValidator,
  ...fileUploader,
  ...generateJWT,
  ...googleVerify,
};
