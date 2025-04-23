require("dotenv").config();
const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://MongoYkashyap:jVzxoQnVftQ4QLjn@face-encodings.uifdumj.mongodb.net/?retryWrites=true&w=majority&appName=Face-Encodings";

const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

module.exports = { connectDB, client };
