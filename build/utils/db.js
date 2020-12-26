"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectDb = void 0;

var _pg = require("pg");

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var connectDb = function connectDb() {
  //connect db
  var client = new _pg.Client({
    connectionString: process.env.DATABASE_URL
  });
  global.client = client;
  client.connect().then(function () {
    console.log("database connected successfully"); //create users table

    client.query("CREATE TABLE IF NOT EXISTS users(\n     id serial PRIMARY KEY,\n     first_name VARCHAR NOT NULL,                  \n     last_name VARCHAR NOT NULL,\n     email VARCHAR UNIQUE NOT NULL,\n     phone_no VARCHAR NOT NULL,\n     password VARCHAR NOT NULL,\n     role VARCHAR DEFAULT 'member'\n    )", function (err, res) {
      if (err) {
        console.log(err);
      } else {
        console.log("users table created"); //create parcels table

        client.query("CREATE TABLE IF NOT EXISTS parcels(\n         id serial PRIMARY KEY,\n         user_id INTEGER REFERENCES users(id),\n         pickup_location VARCHAR NOT NULL,\n         destination VARCHAR NOT NULL, \n         recipient_name VARCHAR NOT NULL,\n         recipient_phone_no VARCHAR NOT NULL,\n         status VARCHAR DEFAULT 'pending'\n        )", function (err, res) {
          if (err) {
            console.log(err);
          } else {
            console.log("created parcels table");
          }
        });
      }
    });
  })["catch"](function (err) {
    console.log("error connecting to Database", err);
  });
};

exports.connectDb = connectDb;