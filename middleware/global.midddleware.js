const UserModel = require("../model/user.model");
const logger = require("../logger");
const jwt = require("jsonwebtoken");

const checkBody = (req, res, next) => {
  if (!req.body) {
    res.status(400).json({
      data: null,
      error: "must have a body",
    });
  }

  next();
};

const bearerTokenAuth = async (req, res, next) => {
  try {
    // const authHeader = req.authHeader;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "You are not authenticated!" });
    }

    // Check if authHeader is in the correct format before splitting
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = authHeader.split(" ")[1]; //bearer token value

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    // //console.log({decoded})
    const user = await UserModel.findById(decoded._id);
    // console.log(user)

    if (!user) {
      return res.status(401).json({
        message: "Unauthorised!",
        internalservererror:"login"
      });
    }

    req.user = user;

    next();
  } catch (error) {
    logger.error(`Error fetching tasks: ${error.message}`);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = {
  checkBody,
  bearerTokenAuth,
};
