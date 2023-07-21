const { Router } = require("express");
const { check } = require("express-validator");

const { fieldsValidator, validateJWT, isAdmin } = require("../middlewares");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/products");

const {
  categoryExists,
  productExists,
} = require("../helpers/databaseValidators");

const router = Router();

// Get all products
router.get("/", getProducts);

// Get a product by id
router.get(
  "/:id",
  [
    check("id", "ID not valid").isMongoId(),
    check("id").custom(productExists),
    fieldsValidator,
  ],
  getProduct
);

// Create a product
router.post(
  "/",
  [
    validateJWT,
    check("name", "Name is required").not().isEmpty(),
    check("categoryId", "Category id required").not().isEmpty(),
    check("categoryId", "Category id not valid").isMongoId(),
    check("categoryId").custom(categoryExists),
    fieldsValidator,
  ],
  createProduct
);

// Update a product by id
router.put(
  "/:id",
  [
    validateJWT,
    check("id", "ID not valid").isMongoId(),
    check("id").custom(productExists),
    check("name", "Name is required").not().isEmpty(),
    check("price", "Price is required").not().isEmpty(),
    check("available", "Availability is required").not().isEmpty(),
    fieldsValidator,
  ],
  updateProduct
);

// Delete a product by id
router.delete(
  "/:id",
  [
    validateJWT,
    isAdmin,
    check("id", "ID not valid").isMongoId(),
    check("id").custom(productExists),
    fieldsValidator,
  ],
  deleteProduct
);

module.exports = router;
