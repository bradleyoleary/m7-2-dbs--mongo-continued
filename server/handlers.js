"use strict";

const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const numOfRows = 8;
const seatsPerRow = 12;

const getSeats = async (req, res) => {
  //create client
  const client = await MongoClient(MONGO_URI, options);
  //connect to client
  await client.connect();
  try {
    const db = client.db("ticket_booker");
    console.log("connected!");
    const data = await db.collection("seats").find().toArray();
    //console.log(data);
    const seatData = {};
    data.forEach((seat) => {
      seatData[seat._id] = {
        ...seat,
      };
    });
    res
      .status(200)
      .json({ status: 200, seats: seatData, numOfRows, seatsPerRow });
  } catch (error) {
    console.log(error.stack);
    res.status(500).json({ status: 500, data: req.body, message: err.message });
  }
  client.close();
  console.log("disconnected!");
};

module.exports = { getSeats };
