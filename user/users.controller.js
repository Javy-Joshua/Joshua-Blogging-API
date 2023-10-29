const UserModel = require("../model/user.model");
const jwt = require("jsonwebtoken");
const logger = require("../logger");

require("dotenv").config();

const CreateUser = async (req, res) => {
  try {
    const userfromRequest = req.body;

    const existingUser = await UserModel.findOne({
      email: userfromRequest.email,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "user already created",
      });
    }

    const user = await UserModel.create({
      firstname: userfromRequest.firstname,
      lastname: userfromRequest.lastname,
      email: userfromRequest.email,
      password: userfromRequest.password,
    });

    const token = await jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(201).json({
      message: "User successfully created",
      user,
      token,
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({
      message: "Server Error",
      data: null,
    });
  }
};

const Login = async (req, res) => {
  try {
    logger.info("[CreateUser] => login proccess started");
    const userfromRequest = req.body;

    const user = await UserModel.findOne({
      email: userfromRequest.email,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const validPassword = await user.isValidPassword(userfromRequest.password);

    if (!validPassword) {
      return res.status(422).json({
        message: "Email or password is not correct",
      });
    }

    const token = await jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    logger.info("[CreateUser] => login process done");
    return res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).json({
      message: "Server Error",
      data: null,
    });
  }
};

module.exports = {
  CreateUser,
  Login,
};
