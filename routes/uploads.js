const { Router } = require("express");
const { check } = require("express-validator");

const { fieldsValidator, filesValidator } = require("../middlewares");

const { allowedCollections } = require("../helpers");

const {
  uploadFile,
  showImage,
  updateImageCloudinary,
} = require("../controllers/uploads");

const router = Router();

router.post("/", filesValidator, uploadFile);

router.put(
  "/:collection/:id",
  [
    filesValidator,
    check("id", "ID not valid").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
    fieldsValidator,
  ],
  updateImageCloudinary
);

router.get(
  "/:collection/:id",
  [
    check("id", "ID not valid").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
    fieldsValidator,
  ],
  showImage
);

module.exports = router;
