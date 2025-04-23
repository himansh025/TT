const { client } = require("../config/db");
const classCollection = client.db("College_Live_Project").collection("Classes");

async function createClass(name, block) {
  const newClass = {
    name,
    block,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const result = await classCollection.insertOne(newClass);
    return result.insertedId;
  } catch (error) {
    console.error("Error creating class:", error);
    return false;
  }
}
async function deleteClass(name) {
  try {
    const result = await classCollection.deleteOne({ name });
    console.log("Deletion");
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error creating class:", error);
    return false;
  }
}

async function findClass(name, block) {
  try {
    let query;
    if (block) {
      query = { name, block };
    } else {
      query = { name };
    }
    const foundClass = await classCollection.findOne(query);
    console.log(foundClass);
    return foundClass;
  } catch (error) {
    console.error("Error finding class", error);
    return false;
  }
}

module.exports = {
  createClass,
  deleteClass,
  classCollection,
  findClass,
};
