"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cancelParcel = exports.changeLocation = exports.changeStatus = exports.changeParcelDestination = exports.createParcel = exports.getAllParcels = exports.getUserParcels = void 0;

var _expressValidator = require("express-validator");

//Get all parcels by a specific from db
var getUserParcels = function getUserParcels(req, res) {
  var errors = (0, _expressValidator.validationResult)(req);

  if (!errors.isEmpty()) {
    res.status(422).json({
      errors: errors.array()
    });
  }

  var userId = parseInt(req.params.userId, 10);

  if (req.decoded.id === userId) {
    client.query("SELECT * FROM parcels WHERE user_id = ".concat(userId)).then(function (parcels) {
      if (!parcels.rows.length) {
        res.status(404).send({
          msg: "You do not have any parcel order yet"
        });
      } else {
        res.status(200).json(parcels.rows);
      }
    });
  } else {
    res.status(401).json({
      msg: "Unauthorized, you cannot view other users orders!"
    });
  }
}; //Get all parcels with admin priviledge


exports.getUserParcels = getUserParcels;

var getAllParcels = function getAllParcels(req, res) {
  if (req.decoded.role !== "admin") {
    res.send({
      msg: "Unauthorized, you do not have permission to do this"
    });
  } else {
    client.query("SELECT * FROM parcels").then(function (parcels) {
      return res.json(parcels);
    })["catch"](function (err) {
      return console.log(err.message);
    });
  }
}; //Create parcel logic


exports.getAllParcels = getAllParcels;

var createParcel = function createParcel(req, res) {
  var _req$body = req.body,
      user_id = _req$body.user_id,
      pickup_location = _req$body.pickup_location,
      destination = _req$body.destination,
      recipient_name = _req$body.recipient_name,
      recipient_phone_no = _req$body.recipient_phone_no;
  var errors = (0, _expressValidator.validationResult)(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array()
    });
  } else if (req.decoded.id === parseInt(user_id, 10)) {
    client.query("INSERT INTO parcels (user_id, pickup_location, destination, recipient_name, recipient_phone_no) VALUES ($1, $2, $3, $4, $5) RETURNING *", [user_id, pickup_location, destination, recipient_name, recipient_phone_no]).then(function (parcel) {
      res.json({
        success: true,
        msg: "Parcel created!",
        id: parcel.rows[0].id,
        parcel: parcel.rows[0]
      });
    })["catch"](function (err) {
      console.log(err);
      res.json(err.message);
    });
  } else {
    res.status(401).send({
      msg: "Unauthorized. You cannot create parcel for another user!"
    });
  }
}; //Change parcel destination


exports.createParcel = createParcel;

var changeParcelDestination = function changeParcelDestination(req, res) {
  var _req$body2 = req.body,
      destination = _req$body2.destination,
      user_id = _req$body2.user_id;
  var parcelId = req.params.parcelId;

  if (req.decoded.id === parseInt(user_id, 10)) {
    client.query("UPDATE parcels SET destination = $2 WHERE id = $1 AND user_id = $3 RETURNING *", [parcelId, destination, user_id]).then(function (updatedParcel) {
      if (!updatedParcel.rows[0]) {
        res.json({
          msg: "Unauthorized, you are not allowed to do that"
        });
      } else {
        res.json({
          success: true,
          msg: "Destination changed successfully",
          changes: updatedParcel.rows[0]
        });
      }
    })["catch"](function (err) {
      return res.json({
        msg: err.message
      });
    });
  } else {
    res.json({
      msg: "Unauthorized, you are not allowed to do that"
    });
  }
}; //Change status of a parcel delivery order


exports.changeParcelDestination = changeParcelDestination;

var changeStatus = function changeStatus(req, res) {
  var status = req.body.status;
  var parcelId = req.params.parcelId;

  if (req.decoded.role !== "admin") {
    res.json({
      msg: "Unauthorized, you are not allowed to do that"
    });
  } else {
    client.query("UPDATE Parcels SET status = $1 WHERE id = $2 RETURNING *", [status, parcelId]).then(function (updatedParcel) {
      res.json({
        msg: "status changed successfully",
        changes: updatedParcel.rows[0]
      });
    })["catch"](function (err) {
      console.log(err.message);
    });
  }
}; //change the present location of a parcel delivery order


exports.changeStatus = changeStatus;

var changeLocation = function changeLocation(req, res) {
  var location = req.body.location;
  var parcelId = req.params.parcelId;

  if (req.decoded.role !== "admin") {
    res.json({
      msg: "Unauthorized, you are not allow to do that"
    });
  } else {
    client.query("UPDATE parcels SET pickup_location = $1 WHERE id = $2 RETURNING *", [presentLocation, parcelId]).then(function (updatedLocation) {
      res.json({
        msg: "status changed successfully",
        changes: updatedLocation.rows[0]
      });
    })["catch"](function (err) {
      console.log(err.message);
    });
  }
}; //cancel a parcel delivery order


exports.changeLocation = changeLocation;

var cancelParcel = function cancelParcel(req, res) {
  var user_id = req.body.user_id;
  var parcelId = req.params.parcelId;

  if (req.decoded.id === parseInt(user_id, 10)) {
    client.query("UPDATE parcels SET status = 'cancelled' WHERE id = $1 AND user_id = $2 RETURNING *", [parcelId, user_id]).then(function (data) {
      res.json({
        success: true,
        msg: "parcel delivery cancelled successfully",
        details: data.rows[0]
      });
    })["catch"](function (err) {
      console.log(err.message);
    });
  } else {
    res.json({
      msg: "Unauthorized, you are not allowed to do that"
    });
  }
};

exports.cancelParcel = cancelParcel;