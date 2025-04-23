const bcrypt = require("bcryptjs");
const { client } = require("../config/db");
const teachersCollection = client
  .db("College_Live_Project")
  .collection("Teachers");

async function createTeacher(nameCode, fullName, email, password, block) {
  const passHash = await bcrypt.hash(password, 10);

  const newTeacher = {
    nameCode,
    fullName,
    email,
    block,
    password: passHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  try {
    const result = await teachersCollection.insertOne(newTeacher);
    return result.insertedId;
  } catch (error) {
    console.error("Error creating teacher:", error);
    return false;
  }
}

async function findTeacherByEmail(email) {
  return await teachersCollection.findOne({ email });
}

async function findTeacherByNameCode(code) {
  return await teachersCollection.findOne({ nameCode: code });
}

async function updateTeacherDetails(email, updates = {}) {
  try {
    // Handle password hashing if a new password is provided
    if (updates.password) {
      
      updates.password = await bcrypt.hash(updates.password, 10);
      
    }
    
    const result = await teachersCollection.findOneAndUpdate(
      { email },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after", returnOriginal: false }
    );
    
    return result; // This returns the updated document
  } catch (error) {
    console.error("Error updating teacher:", error);
    return null;
  }
}
module.exports = {
  createTeacher,
  findTeacherByEmail,
  updateTeacherDetails,
  findTeacherByNameCode,
  teachersCollection,
};
