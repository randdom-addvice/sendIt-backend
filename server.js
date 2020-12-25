import express from "express";
import dotenv from "dotenv";
import { Client } from "pg";
import routes from "./routes";

const app = express();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000;

//connect db
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

global.client = client;

client
  .connect()
  .then(() => {
    console.log("database connected!");
    //create users table
    client.query(
      `CREATE TABLE IF NOT EXISTS users(
     id serial PRIMARY KEY,
     first_name VARCHAR NOT NULL,                  
     last_name VARCHAR NOT NULL,
     email VARCHAR UNIQUE NOT NULL,
     phone_no VARCHAR NOT NULL,
     password VARCHAR NOT NULL,
     role VARCHAR DEFAULT 'member'
    )`,
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log("users table created");

          //create parcels table
          client.query(
            `CREATE TABLE IF NOT EXISTS parcels(
         id serial PRIMARY KEY,
         user_id INTEGER REFERENCES users(id),
         pickup_location VARCHAR NOT NULL,
         destination VARCHAR NOT NULL, 
         recipient_name VARCHAR NOT NULL,
         recipient_phone_no VARCHAR NOT NULL,
         status VARCHAR DEFAULT 'pending'
        )`,
            (err, res) => {
              if (err) {
                console.log(err);
              } else {
                console.log("parcels table created successfully");
              }
            }
          );
        }
      }
    );
  })
  .catch((err) => {
    console.log("error connecting to Database", err);
  });

//ROUTES
app.use("/", routes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
