const { response } = require("express");

const Product = require("../models/Product");
const Category = require("../models/Category");

const getProducts = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate("user", "name")
      .populate("category", "name")
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({
    total,
    products,
  });
};

const getProduct = async (req, res = response) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate("user", "name")
    .populate("category", "name");

  res.json(product);
};

const createProduct = async (req, res = response) => {
  // const name = req.body.name.toUpperCase();
  const { name, description, categoryId } = req.body;

  try {
    const productInDB = await Product.findOne({ name });
    if (productInDB) {
      return res.status(400).json({
        msg: `Product ${productInDB.name} already exists`,
      });
    }

    const categoryInDB = await Category.findById(categoryId);
    if (!categoryInDB) {
      return res.status(400).json({
        msg: `Category ${categoryInDB.name} does not exist`,
      });
    }

    const data = {
      name: name.toUpperCase(),
      description,
      user: req.user._id,
      category: categoryId,
    };

    const product = new Product(data);

    await product.save();

    res.status(201).json({
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error,
    });
  }
};

const updateProduct = async (req, res = response) => {
  const { id } = req.params;
  const { name, price, available } = req.body;

  const product = await Product.findByIdAndUpdate(
    id,
    {
      name: name.toUpperCase(),
      price,
      available,
    },
    { new: true }
  );

  res.json(product);
};

const deleteProduct = async (req, res = response) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  res.json(product);
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
