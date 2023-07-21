const { response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/User");

const getUsers = async (req, res = response) => {
  const { limit = 5, from = 0 } = req.query;
  const query = { status: true };

  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.json({
    total,
    users,
  });
};

const postUsers = async (req, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // Hash password
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  await user.save();

  res.json({
    user,
  });
};

const putUsers = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...remainder } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    remainder.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, remainder);

  res.json(user);
};

const deleteUsers = async (req, res = response) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, { status: false });

  res.json(user);
};

module.exports = {
  getUsers,
  postUsers,
  putUsers,
  deleteUsers,
};
