"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _routes = _interopRequireDefault(require("./routes"));

var _db = require("./utils/db");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();

_dotenv["default"].config();

app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
(0, _db.connectDb)();
var PORT = process.env.PORT || 5000;
app.get("/", function (req, res) {
  res.send("welcome to dend it parcel");
}); //ROUTES

app.use("/", _routes["default"]);
app.listen(PORT, function () {
  return console.log("Server running on port ".concat(PORT));
});