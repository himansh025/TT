require("dotenv").config({});
const { MongoClient } = require("mongodb");
  const uri = process.env.MONGO_URI 
if(!uri){
  return "mongo uri is not there"
}

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
