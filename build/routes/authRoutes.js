"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressValidator = require("express-validator");

var _userController = require("../controllers/userController");

var _authorizeUser = require("../middleware/authorizeUser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])(); //register route

app.post("/register", [(0, _expressValidator.check)("first_name").isAlpha().withMessage("First name should be uppercased").isLength({
  min: 5,
  max: 15
}).withMessage("First name cannot be lower than 5 characters long"), (0, _expressValidator.check)("email", "Please enter a valid email address").isEmail(), (0, _expressValidator.check)("phone_no", "Please enter a valid Mobile number").isMobilePhone(), (0, _expressValidator.check)("password").isLength({
  min: 5
}).withMessage("Password cannot be lesser than 5 characters")], _userController.registerUser); //Login route

app.post("/login", _userController.loginUser); //user details route

app.get("/user", _authorizeUser.authorizeUser, _userController.getSpecificUser);
var _default = app;
exports["default"] = _default;