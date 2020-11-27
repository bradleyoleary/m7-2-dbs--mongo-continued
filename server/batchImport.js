const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const assert = require;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const seats = {};
const row = ["A", "B", "C", "D", "E", "F", "G", "H"];
for (let r = 0; r < row.length; r++) {
  for (let s = 1; s < 13; s++) {
    seats[`${row[r]}-${s}`] = {
      _id: `${row[r]}-${s}`,
      price: 225,
      isBooked: false,
    };
  }
}

const seatsArray = Object.values(seats);

const batchImport = async () => {
  //create client
  const client = await MongoClient(MONGO_URI, options);
  //connect to client
  await client.connect();
  try {
    //connect to the db
    const db = client.db("ticket_booker");
    console.log("connected!");
    const result = await db.collection("seats").insertMany(seatsArray);
    assert.strictEqual(seatsArray.length, result.insertedCount);
    console.log("New data has been added!");
  } catch (error) {
    console.log(error.stack);
  }
  client.close();
  console.log("disconnected!");
};

batchImport();
