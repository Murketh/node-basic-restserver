const { response } = require("express");
const Category = require("../models/Category");

const getCategories = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate("user", "name")
      .skip(Number(from))
      .limit(Number(limit)),
  ]);

  res.json({
    total,
    categories,
  });
};

const getCategory = async (req, res = response) => {
  const { id } = req.params;

  const category = await Category.findById(id).populate("user");

  res.json(category);
};

const createCategory = async (req, res = response) => {
  const name = req.body.name.toUpperCase();

  try {
    const categoryInDB = await Category.findOne({ name });
    if (categoryInDB) {
      return res.status(400).json({
        msg: `Category ${categoryInDB.name} already exists`,
      });
    }

    const data = {
      name,
      user: req.user._id,
    };

    const category = new Category(data);

    await category.save();

    res.status(201).json({
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: error,
    });
  }
};

const updateCategory = async (req, res = response) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await Category.findByIdAndUpdate(
    id,
    {
      name: name.toUpperCase(),
    },
    { new: true }
  );

  res.json(category);
};

const deleteCategory = async (req, res = response) => {
  const { id } = req.params;

  const category = await Category.findByIdAndUpdate(
    id,
    { status: false },
    { new: true }
  );

  res.json(category);
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
