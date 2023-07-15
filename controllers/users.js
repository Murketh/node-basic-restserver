const { response } = require("express");

const getUsers = (req, res = response) => {
  const { id, name = "No name", age } = req.query;

  res.json({
    msg: "get API - Controller",
    id,
    name,
    age,
  });
};

const postUsers = (req, res = response) => {
  const { name } = req.body;
  res.json({
    msg: "post API - Controller",
    name,
  });
};

const putUsers = (req, res = response) => {
  const { id } = req.params;

  res.json({
    msg: "put API - Controller",
    id,
  });
};

const deleteUsers = (req, res = response) => {
  res.json({
    msg: "delete API - Controller",
  });
};

module.exports = {
  getUsers,
  postUsers,
  putUsers,
  deleteUsers,
};
