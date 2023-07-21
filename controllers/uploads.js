const path = require("path");
const fs = require("fs");

const { response } = require("express");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { fileUploader } = require("../helpers");
const { User, Product } = require("../models");

const uploadFile = async (req, res = response) => {
  try {
    // Images
    // const fileName = await fileUploader(req.files, ["txt"], "textos");
    const fileName = await fileUploader(req.files, undefined, "img");

    res.json({
      fileName,
    });
  } catch (error) {
    res.status(400).json({
      msg: error,
    });
  }
};

const updateImage = async (req, res = response) => {
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is no user with the id: ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is no product with the id: ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Forgot to implement that" });
  }

  if (model.img) {
    const imagePath = path.join(
      __dirname,
      "../uploads/",
      collection,
      model.img
    );
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  const name = await fileUploader(req.files, undefined, collection);
  model.img = name;

  await model.save();

  res.json(model);
};

const updateImageCloudinary = async (req, res = response) => {
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is no user with the id: ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is no product with the id: ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Forgot to implement that" });
  }

  if (model.img) {
    const imageNameSplit = model.img.split("/");
    const imageName = imageNameSplit[imageNameSplit.length - 1];
    const [publicId] = imageName.split(".");
    cloudinary.uploader.destroy(publicId);
  }

  const { tempFilePath } = req.files.file;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  model.img = secure_url;

  await model.save();

  res.json(model);
};

const showImage = async (req, res = response) => {
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is no user with the id: ${id}`,
        });
      }
      break;

    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `There is no product with the id: ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Forgot to implement that" });
  }

  if (model.img) {
    const imagePath = path.join(
      __dirname,
      "../uploads/",
      collection,
      model.img
    );
    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    }
  }

  const noImagePath = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(noImagePath);
};

module.exports = {
  uploadFile,
  updateImage,
  showImage,
  updateImageCloudinary,
};
