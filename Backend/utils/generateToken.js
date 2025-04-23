const jwt = require("jsonwebtoken");
const generateToken = (id) => {
  return jwt.sign({ id }, "iamadmin@pcte" , { expiresIn: "1h" });
};

module.exports = { generateToken };
