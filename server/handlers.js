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
    res
      .status(500)
      .json({ status: 500, data: req.body, message: error.message });
  }
  client.close();
  console.log("disconnected!");
};

const bookSeat = async (req, res) => {
  const { seatId, creditCard, expiration, fullName, email } = req.body;
  const filter = { _id: seatId };
  const updatedBooking = { $set: { isBooked: true, fullName, email } };

  if (!creditCard || !expiration) {
    return res.status(400).json({
      status: 400,
      message: "Please provide credit card information!",
    });
  }

  let lastBookingAttemptSucceeded = false;
  console.log(lastBookingAttemptSucceeded);

  if (lastBookingAttemptSucceeded) {
    lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;

    return res.status(500).json({
      message: "An unknown error has occurred. Please try your request again.",
    });
  }
  //create new client
  const client = await MongoClient(MONGO_URI, options);
  try {
    //connect to client
    await client.connect();
    const db = client.db("ticket_booker");
    console.log("connected!");
    await db.collection("seats").updateOne(filter, updatedBooking);

    lastBookingAttemptSucceeded = !lastBookingAttemptSucceeded;
    console.log(lastBookingAttemptSucceeded);

    if (fullName === "" && email === "") {
      return res
        .status(400)
        .json({ status: 400, message: "Please provide your name and email!" });
    }

    res.status(200).json({ status: 200, seat: seatId, fullName, email });
  } catch (error) {
    console.log(error.stack);
    res
      .status(500)
      .json({ status: 500, data: req.body, message: error.message });
  }
  client.close();
  console.log("disconnected");
};

module.exports = { getSeats, bookSeat };
