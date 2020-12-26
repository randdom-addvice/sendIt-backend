import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const connectDb = () => {
  //connect db
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  global.client = client;

  client
    .connect()
    .then(() => {
      console.log("database connected successfully");
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
                  console.log("created parcels table");
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
};
