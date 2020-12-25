import express from "express";
// import parcelRoute from "./parcelRoutes";
import authRoute from "./authRoutes";

const app = express();

// app.use("/", parcelRoute);
app.use("/auth", authRoute);

export default app;
