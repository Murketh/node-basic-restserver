const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Category, Product, User } = require("../models");

const allowedCollections = ["users", "categories", "products"];

const searchUsers = async (query = "", res = response) => {
  const isMongoID = ObjectId.isValid(query);

  if (isMongoID) {
    const user = await User.findById(query);
    return res.json({
      results: user ? [user] : [],
    });
  }

  const regex = new RegExp(query, "i");

  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ status: true }],
  });

  res.json({
    results: users,
  });
};

const searchCategories = async (query = "", res = response) => {
  const isMongoID = ObjectId.isValid(query);

  if (isMongoID) {
    const category = await Category.findById(query);
    return res.json({
      results: category ? [category] : [],
    });
  }

  const regex = new RegExp(query, "i");

  const categories = await Category.find({
    $and: [{ name: regex }, { status: true }],
  });

  res.json({
    results: categories,
  });
};

const searchProducts = async (query = "", res = response) => {
  const isMongoID = ObjectId.isValid(query);

  if (isMongoID) {
    const product = await Product.findById(query);
    return res.json({
      results: product ? [product] : [],
    });
  }

  const regex = new RegExp(query, "i");

  const products = await Product.find({
    $and: [{ name: regex }, { status: true }],
  });

  res.json({
    results: products,
  });
};

const search = async (req, res = response) => {
  const { collection, query } = req.params;

  if (!allowedCollections.includes(collection)) {
    return res.status(400).json({
      msg: `The allowed collections are: ${allowedCollections}`,
    });
  }

  switch (collection) {
    case "users":
      searchUsers(query, res);
      break;

    case "categories":
      searchCategories(query, res);
      break;

    case "products":
      searchProducts(query, res);
      break;

    default:
      res.status(500).json({
        msg: "Forgot to implement that search",
      });
      break;
  }
};

module.exports = {
  search,
};
