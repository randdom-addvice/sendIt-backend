"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authorizeUser = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var authorizeUser = function authorizeUser(req, res, next) {
  var token = req.headers.Authorization || req.headers["x-access-token"] || req.body.token;
  if (!token) return res.status(401).json({
    success: false,
    status: "Failed",
    message: "Authentication no token provided"
  });

  _jsonwebtoken["default"].verify(token, process.env.SECRET, function (err, decoded) {
    if (err) {
      res.send(err);
    } else {
      req.decoded = decoded;
      next();
    }
  });
};

exports.authorizeUser = authorizeUser;