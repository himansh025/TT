const bcrypt = require("bcryptjs");
const { client } = require("../config/db");
const { generateToken } = require("../utils/generateToken");

const adminCollection = client.db("College_Live_Project").collection("Admin");

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await adminCollection.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role, /// Add any other required fields
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { loginAdmin };
