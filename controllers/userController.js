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
