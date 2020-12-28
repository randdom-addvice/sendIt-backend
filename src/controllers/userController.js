import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { jwtGenerator } from "../utils/jwtGenerator";

//Register logic goes here
export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, phone_no, password } = req.body;
    const errors = validationResult(req);
    //Bcrypt user password
    const saltRound = 10;
    const salt = await bcrypt.genSalt(saltRound);
    const bcryptPassword = await bcrypt.hash(password, salt);
    if (!errors.isEmpty()) {
      return res.status(422).json({ sucess: false, errors: errors.array() });
    }
    const newUser = await client.query(
      `INSERT INTO users (first_name, last_name, email, phone_no,password) VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [first_name, last_name, email, phone_no, bcryptPassword]
    );
    const token = jwtGenerator(newUser.rows[0]);
    res.json({
      token,
      expiresIn: "24hours",
      user: newUser.rows[0],
      success: true,
      msg: "User created successfully",
      userId: newUser.rows[0].id,
    });
    console.log(token);
    console.log("===========");
    console.log(newUser.rows[0]);
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check if user doesnt exist
    const user = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "User does not exist" });
    }
    //check if password match
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json("password incorrect");
    }

    //generate token
    const token = jwtGenerator(user.rows[0]);
    res.json({
      token,
      msg: "Login successful",
      userId: user.rows[0].id,
      expiresIn: "24hours",
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.json(err.message);
  }
};

//Get specific user
export const getSpecificUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const user = await client.query(
      `SELECT * FROM users WHERE id = ${req.decoded.id}`
    );
    console.log(user.rows[0]);
    res.status(200).send(user.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
