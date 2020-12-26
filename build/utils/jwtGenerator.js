"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jwtGenerator = jwtGenerator;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

function jwtGenerator(user) {
  var payload = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    password: user.password,
    role: user.role
  };
  return _jsonwebtoken["default"].sign(payload, process.env.SECRET, {
    expiresIn: "24hr"
  });
}