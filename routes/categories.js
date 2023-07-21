const { Router } = require("express");
const { check } = require("express-validator");

const { fieldsValidator, validateJWT, isAdmin } = require("../middlewares");

const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");
const { categoryExists } = require("../helpers/databaseValidators");

const router = Router();

// Get all categories
router.get("/", getCategories);

// Get a category by id
router.get(
  "/:id",
  [
    check("id", "ID not valid").isMongoId(),
    check("id").custom(categoryExists),
    fieldsValidator,
  ],
  getCategory
);

// Create a category
router.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    fieldsValidator,
  ],
  createCategory
);

// Update a category by id
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "ID not valid").isMongoId(),
    check("id").custom(categoryExists),
    check("name", "Name is required").not().isEmpty(),
    fieldsValidator,
  ],
  updateCategory
);

// Delete a category by id
router.delete(
  "/:id",
  [
    validateJWT,
    isAdmin,
    check("id", "ID not valid").isMongoId(),
    check("id").custom(categoryExists),
    fieldsValidator,
  ],
  deleteCategory
);

module.exports = router;
