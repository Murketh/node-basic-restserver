const { Router } = require("express");
const { check } = require("express-validator");

const {
  fieldsValidator,
  validateJWT,
  isAdmin,
  hasRole,
} = require("../middlewares");

const {
  isRoleValid,
  emailExists,
  userIdExists,
} = require("../helpers/databaseValidators");

const {
  getUsers,
  postUsers,
  putUsers,
  deleteUsers,
} = require("../controllers/users");

const router = Router();

router.get("/", getUsers);

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email not valid").isEmail(),
    check("email").custom(emailExists),
    check("password", "Password must have at least 6 characters").isLength({
      min: 6,
    }),
    check("role").custom(isRoleValid),
    fieldsValidator,
  ],
  postUsers
);

router.put(
  "/:id",
  [
    check("id", "ID is not valid").isMongoId(),
    check("id").custom(userIdExists),
    check("role").custom(isRoleValid),
    fieldsValidator,
  ],
  putUsers
);

router.delete(
  "/:id",
  [
    validateJWT,
    // isAdmin,
    hasRole("ADMIN_ROLE", "USER_ROLE"),
    check("id", "ID is not valid").isMongoId(),
    check("id").custom(userIdExists),
    fieldsValidator,
  ],
  deleteUsers
);

module.exports = router;
