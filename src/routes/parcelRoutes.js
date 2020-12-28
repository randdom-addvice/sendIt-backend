import express from "express";
import { check } from "express-validator";
import {
  cancelParcel,
  changeLocation,
  changeParcelDestination,
  changeStatus,
  createParcel,
  getAllParcels,
  getUserParcels,
} from "../controllers/parcelController";
import { authorizeUser } from "../middleware/authorizeUser";
const app = express();

//create a parcel
app.post(
  "/parcels",
  [
    check("pickup_location")
      .notEmpty()
      .withMessage("Please enter your pickup location"),
    check("destination")
      .notEmpty()
      .withMessage("please enter your pcikup destination"),
    check("recipient_name")
      .notEmpty()
      .withMessage("Please enter recipient name"),
    check("recipient_phone_no")
      .notEmpty()
      .withMessage("please enter recipient phone number"),
  ],
  authorizeUser,
  createParcel
);

// get all parcel by a specific user
app.get("/parcels/:userId/", authorizeUser, getUserParcels);
//get all parcels with admin priviledge
app.get("/parcels", authorizeUser, getAllParcels);

//change parcel destination
app.put(
  "/parcels/:parcelId/destination",
  authorizeUser,
  changeParcelDestination
);

//change the status of a parcel order  with admin priviledge
app.put("/parcels/:parcelId/status", authorizeUser, changeStatus);

//change the present location of a parcel delivery order
app.put("/parcels/:parcelId/location", authorizeUser, changeLocation);

//cancel a parcel delivery order
app.put("/parcels/:parcelId/cancel", authorizeUser, cancelParcel);

export default app;
