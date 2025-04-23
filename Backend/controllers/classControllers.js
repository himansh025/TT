const {
  createClass,
  deleteClass,
  classCollection,
  findClass,
} = require("../models/Class");

async function AddClass(req, res) {
  const { name, block } = req.body;
  try {

    if(!name || !block){
      return res.status(400).json({message : "No Data Received !"})
    }

    const foundClass = await findClass(name);
    if (foundClass) {
      return res.status(400).json({ message: "Class already exist." });
    }
    const result = await createClass(name, block);
    if (!result) {
      return res.status(400).json({ message: "Failed to add class" });
    }

    return res.status(201).json({ message: "Class created successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

async function DeleteClass(req, res) {
  const { name } = req.body;
  try {
    const foundClass = await findClass(name);
    if (!foundClass) {
      return res.status(400).json({ message: "Class not found." });
    }
    const result = await deleteClass(name);
    if (!result) {
      return res.status(400).json({ message: "Failed to delete class" });
    }
    return res.status(200).send({ message: "Class deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

async function GetAllClass(req, res) {
  try {
    const result = classCollection.find(
      {},
      { projection: { name: 1, block: 1, _id: 0 } }
    );
    if (!result) {
      return res.status(400).json({ message: "Error finding classes." });
    }
    console.log("All classes");
    const data = await result.toArray();
    console.log(data);
    return res
      .status(200)
      .json({ message: "Classes Found successfully.", result: data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  AddClass,
  DeleteClass,
  GetAllClass,
};
