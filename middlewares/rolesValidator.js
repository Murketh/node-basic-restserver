const { response } = require("express");

const isAdmin = (req, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      msg: "Token must be validated first before checking roles",
    });
  }

  const { name, role } = req.user;

  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${name} is not an administrator`,
    });
  }

  next();
};

const hasRole = (...roles) => {
  return (req, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: "Token must be validated first before checking roles",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        msg: `User must have one of these roles ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  isAdmin,
  hasRole,
};
