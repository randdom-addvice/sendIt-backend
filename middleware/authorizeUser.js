import jwt from "jsonwebtoken";

export const authorizeUser = (req, res, next) => {
  const token =
    req.headers.Authorization ||
    req.headers["x-access-token"] ||
    req.body.token;
  if (!token)
    return res.status(401).json({
      success: false,
      status: "Failed",
      message: "Authentication no token provided",
    });

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      res.send(err);
    } else {
      req.decoded = decoded;
      next();
    }
  });
};
