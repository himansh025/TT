const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createTeacher,
  findTeacherByEmail,
  updateTeacherDetails,
  findTeacherByNameCode,
  teachersCollection,
} = require("../models/Teacher");
const { generateToken } = require("../utils/generateToken");

const registerTeacher = async (req, res) => {
  const { nameCode, fullName, email, password, block } = req.body;

  try {
    const teacherWithSameEmailExists = await findTeacherByEmail(email);
    if (teacherWithSameEmailExists) {
      return res
        .status(400)
        .json({ message: "Teacher with same email exists." });
    }

    const teacherWithSameNameCode = await findTeacherByNameCode(nameCode);
    console.log(teacherWithSameNameCode);
    if (teacherWithSameNameCode) {
      return res
        .status(400)
        .json({ message: "Teacher with same Name accronym exists." });
    }

    const result = await createTeacher(
      nameCode,
      fullName,
      email,
      password,
      block
    );
    if (!result) {
      throw new Error("Failed creating teacher.");
    }

    const token = generateToken(result._id);

    res.status(201).json({
      message: "Teacher registered successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginTeacher = async (req, res) => {
  const { email, password } = req.body;

  try {
    const teacher = await findTeacherByEmail(email);
    if (!teacher) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, teacher.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(teacher._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: teacher._id,
        nameCode: teacher.nameCode,
        fullName: teacher.fullName,
        email: teacher.email
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const updateTeacher = async (req, res) => {
  const { existingEmail, updates } = req.body;
  
  if (!existingEmail || !updates) {
    return res.status(400).json({ message: "Missing email or updates in request body." });
  }
  
  // Extract fields for validation
  const { email, nameCode, emailUnchanged } = updates;
  
  try {
    // Only check for email duplication if the email is actually changing
    if (email && !emailUnchanged && email !== existingEmail) {
      const teacherWithSameEmail = await findTeacherByEmail(email);
      if (teacherWithSameEmail && teacherWithSameEmail.email !== existingEmail) {
        return res.status(400).json({ message: "Email already exists." });
      }
    }
    
    // Check if the new nameCode already exists in another teacher's record
    if (nameCode) {
      const teacherWithSameNameCode = await findTeacherByNameCode(nameCode);
      if (teacherWithSameNameCode && teacherWithSameNameCode.email !== existingEmail) {
        return res.status(400).json({ message: "Name acronym already exists." });
      }
    }
    
    // Clean up our helper property before saving to database
    if (updates.emailUnchanged) {
      delete updates.emailUnchanged;
    }
    
    // Update the teacher details
    const updateResult = await updateTeacherDetails(existingEmail, updates);
    
    if (!updateResult) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    
    res.status(200).json({
      message: "Teacher updated successfully",
      updatedTeacher: updateResult
    });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



async function getAllTeachers(req, res) {
  try {
    const result = teachersCollection.find(
      {},
      { projection: { nameCode: 1, fullName: 1, email: 1, block: 1, _id: 0 } }
    );
    if (!result) {
      return res.status(400).json({ message: "Error finding teachers." });
    }
    const data = await result.toArray();
    return res.status(200).json({ message: "Teachers found.", result: data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

async function deleteTeacher(req, res) {
  const { email } = req.body;
  try {
    const foundTeacher = await findTeacherByEmail(email);
    if (!foundTeacher) {
      return res.status(400).json({ message: "teacher not found." });
    }
    const result = await teachersCollection.deleteOne({ email });
    if (!result) {
      return res.status(400).json({ message: "Failed to delete teacher" });
    }
    return res.status(200).send({ message: "Teacher deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  registerTeacher,
  loginTeacher,
  updateTeacher,
  getAllTeachers,
  deleteTeacher,
};
