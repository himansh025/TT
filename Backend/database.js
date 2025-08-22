const { MongoClient } = require("mongodb");
const  dotenv =require('dotenv')
dotenv.config({});

// Connection URI
const uri = process.env.MONGO_URI 
// console.log(uri) 
if(!uri){
  return "mongo uri is not there"
}

// Database Name
const dbName = "College_Live_Project"; // Set the database name to "dhawan"

// Create a new MongoClient
const client = new MongoClient(uri);

async function connectToMongoDB() {
  try {
    // Connect the client to the MongoDB server
    await client.connect();
    console.log("Connected to MongoDB server");

    // Connect to the specific database
    const database = client.db(dbName);
    console.log(`Connected to database "${dbName}"`);

    let collection = database.collection("timetable");

    return collection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

module.exports = connectToMongoDB;