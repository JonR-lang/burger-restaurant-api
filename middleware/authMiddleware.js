const User = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports.verifyToken = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;

  try {
    if (!authorization) throw new Error("No authorization header attached");
    if (!authorization.includes("Bearer"))
      throw new Error("No Bearer token attached to the header");
    token = authorization.split(" ")[1];
    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN);
    const user = await User.findById(decodedUser.id);
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ error: error.message });
  }
};

module.exports.isAdmin = async (req, res, next) => {
  const { role } = req.user;
  try {
    if (role !== "admin") {
      throw new Error("You are not an administrator");
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
