const fieldsValidator = require("../middlewares/fieldsValidator");
const filesValidator = require("./filesValidator");
const validateJWT = require("../middlewares/validateJWT");
const rolesValidator = require("../middlewares/rolesValidator");

module.exports = {
  ...fieldsValidator,
  ...filesValidator,
  ...validateJWT,
  ...rolesValidator,
};
