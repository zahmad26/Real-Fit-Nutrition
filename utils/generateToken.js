const jwt = require("jsonwebtoken");

const generateToken = (id, role, email, username) => {
  return jwt.sign({ id, role, email, username }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

module.exports = generateToken;
