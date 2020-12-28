import express from "express";
import dotenv from "dotenv";
import routes from "./routes";
import cors from "cors";
import { connectDb } from "./utils/db";

const app = express();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectDb();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("welcome to dend it parcel");
});

//ROUTES
app.use("/", routes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
