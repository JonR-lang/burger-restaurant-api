const jwt = require("jsonwebtoken");

const generateAccessToken = (id) => {
  const token = jwt.sign({ id }, process.env.ACCESS_TOKEN, {
    expiresIn: "1d",
  });
  return token;
};

const generateRefreshToken = (id) => {
  const token = jwt.sign({ id }, process.env.REFRESH_TOKEN, {
    expiresIn: "7d",
  });
  return token;
};

module.exports = { generateAccessToken, generateRefreshToken };
