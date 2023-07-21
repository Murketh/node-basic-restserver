const { response } = require("express");
const bcryptjs = require("bcryptjs");

const User = require("../models/User");

const { generateJWT } = require("../helpers/generateJWT");
const { googleVerify } = require("../helpers/googleVerify");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "Email / Password is not correct - email",
      });
    }

    // Check if user exists
    if (!user.status) {
      return res.status(400).json({
        msg: "Email / Password is not correct - status: false",
      });
    }

    // Check if passwords match
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Email / Password is not correct - password",
      });
    }

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Contact an administrator",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, email, img } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        password: ":P",
        role: "USER_ROLE",
        img,
        google: true,
      };

      user = new User(data);
      await user.save();
    }

    if (!user.status) {
      return res.status(401).json({
        msg: "This user is blocked. Contact an administrator",
      });
    }

    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Could not verify token",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
