const express = require("express");
const middleware = require("./users.middleware");
const controller = require("./users.controller");

const router = express.Router();

router.post("/signup", middleware.ValidateUserCreation, controller.CreateUser);

router.post("/login", middleware.LoginValidation, controller.Login);



module.exports = router;
