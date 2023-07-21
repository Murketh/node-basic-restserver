const Category = require("../models/Category");
const Product = require("../models/Product");
const Role = require("../models/Role");
const User = require("../models/User");

const isRoleValid = async (role = "") => {
  const roleExists = await Role.findOne({ role });
  if (!roleExists) {
    throw new Error(`Role ${role} is not registered in the database`);
  }
};

const emailExists = async (email = "") => {
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new Error("That email is already registered");
  }
};

const userIdExists = async (id) => {
  const userExists = await User.findById(id);
  if (!userExists) {
    throw new Error("That ID does not exist");
  }
};

const categoryExists = async (id) => {
  const categoryExists = await Category.findById(id);
  if (!categoryExists) {
    throw new Error(`There is no category with ID: ${id}`);
  }
};

const productExists = async (id) => {
  const productExists = await Product.findById(id);
  if (!productExists) {
    throw new Error(`There is no product with ID: ${id}`);
  }
};

const allowedCollections = (collection = "", collections = []) => {
  const included = collections.includes(collection);
  if (!included) {
    throw new Error(
      `The collection ${collection} is not allowed. Allowed collections: ${collections}`
    );
  }

  return true;
};

module.exports = {
  isRoleValid,
  emailExists,
  userIdExists,
  categoryExists,
  productExists,
  allowedCollections,
};
