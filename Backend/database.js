const { MongoClient } = require("mongodb");

// Connection URI
const uri = process.env.mongo_uri || "mongodb+srv://MongoYkashyap:jVzxoQnVftQ4QLjn@face-encodings.uifdumj.mongodb.net/?retryWrites=true&w=majority"

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