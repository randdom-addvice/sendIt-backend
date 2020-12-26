import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function jwtGenerator(user) {
  const payload = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    password: user.password,
    role: user.role,
  };

  return jwt.sign(payload, process.env.SECRET, { expiresIn: "24hr" });
}
