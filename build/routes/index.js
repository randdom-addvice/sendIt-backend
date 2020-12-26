"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _parcelRoutes = _interopRequireDefault(require("./parcelRoutes"));

var _authRoutes = _interopRequireDefault(require("./authRoutes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use("/", _parcelRoutes["default"]);
app.use("/auth", _authRoutes["default"]);
var _default = app;
exports["default"] = _default;