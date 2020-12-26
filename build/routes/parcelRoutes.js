"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _parcelController = require("../controllers/parcelController");

var _authorizeUser = require("../middleware/authorizeUser");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])(); //create a parcel

app.post("/parcels", _authorizeUser.authorizeUser, _parcelController.createParcel); // get all parcel by a specific user

app.get("/parcels/:userId/", _authorizeUser.authorizeUser, _parcelController.getUserParcels); //get all parcels with admin priviledge

app.get("/parcels", _authorizeUser.authorizeUser, _parcelController.getAllParcels); //change parcel destination

app.put("/parcels/:parcelId/destination", _authorizeUser.authorizeUser, _parcelController.changeParcelDestination); //change the status of a parcel order  with admin priviledge

app.put("/parcels/:parcelId/status", _authorizeUser.authorizeUser, _parcelController.changeStatus); //change the present location of a parcel delivery order

app.put("/parcels/:parcelId/location", _authorizeUser.authorizeUser, _parcelController.changeLocation); //cancel a parcel delivery order

app.put("/parcels/:parcelId/cancel", _authorizeUser.authorizeUser, _parcelController.cancelParcel);
var _default = app;
exports["default"] = _default;