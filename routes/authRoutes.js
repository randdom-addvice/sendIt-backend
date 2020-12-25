import express from "express";
import { check } from "express-validator/check";
import { registerUser } from "../controllers/userController";

const app = express();

//register route
app.post(
  "/register",
  [
    check("first_name")
      .isAlpha()
      .withMessage("First name should be uppercased")
      .isLength({ min: 5, max: 15 })
      .withMessage("First name cannot be lower than 5 characters long"),
    check("email", "Please enter a valid email address").isEmail(),
    check("phone_no", "Please enter a valid Mobile number").isMobilePhone(),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password cannot be lesser than 5 characters"),
  ],
  registerUser
);

//Login route
app.post("/login");

//user details route
app.get("/user");

export default app;
