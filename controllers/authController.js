const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { handleError } = require("../utils/helperFunctions");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateToken");
const sendEmail = require("./emailController");

//CREATE USER

module.exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;

    const user = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      password,
    });
    res.status(201).json({ userId: user._id });
  } catch (err) {
    const errors = handleError(err);
    res.status(400).json({ errors });
  }
};

//LOG IN USER

module.exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User does not exist");
    const isMatched = await user.isPasswordMatched(password);
    if (!isMatched) throw new Error("Invalid user credentials");
    const refreshToken = generateRefreshToken(user._id);
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        refreshToken,
      },
      { new: true }
    );
    res
      .cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 5, //5 days
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .status(201)
      .json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        role: user.role,
        accessToken: generateAccessToken(user._id),
      });
  } catch (err) {
    const errors = handleError(err);
    res.status(401).json({ errors });
    console.log(err);
  }
};

//ADMIN LOG IN

module.exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User does not exist");

    if (user.role !== "admin")
      throw new Error("User is not admin. Not authorized");

    const isMatched = await user.isPasswordMatched(password);
    if (!isMatched) throw new Error("Invalid user credentials");
    const refreshToken = generateRefreshToken(user._id);
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        refreshToken,
      },
      { new: true }
    );
    res
      .cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 5, //5 days
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .status(201)
      .json({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        mobile: user.mobile,
        role: user.role,
        accessToken: generateAccessToken(user._id),
      });
  } catch (err) {
    const errors = handleError(err);
    res.status(401).json({ errors });
    console.log(err);
  }
};

// HANDLE REFRESH TOKEN

module.exports.handleRefreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;
  try {
    if (!refreshToken)
      throw new Error("Refresh Token not found, log in again!");
    const user = await User.findOne({ refreshToken });
    if (!user)
      throw new Error("No user with this refresh token found!, log in!");
    const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    res.status(200).json({ accessToken: generateAccessToken(decodedToken.id) });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//LOGOUT

module.exports.logOut = async (req, res) => {
  console.log(req.cookies);
  const { refreshToken } = req.cookies;
  try {
    if (!refreshToken)
      throw new Error("Refresh Token not found, log in again!");
    const user = await User.findOneAndUpdate(
      { refreshToken },
      {
        refreshToken: "",
      },
      { new: true }
    );
    if (!user)
      throw new Error("No user with this refresh token found!, log in!");
    res
      .clearCookie("refreshToken", { httpOnly: true, secure: true })
      .status(200)
      .json({ message: "Log out successful" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//FORGOT PASSWORD

module.exports.forgotPasswordToken = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User with email not found!");
    const token = await user.createPasswordResetToken();
    await user.save(); //This has to be done so as to save the new modifications to the database. The above method, generates a resetToken, hashes it, and saves it to the database, along with its expiry date.It also returns the token created.
    const resetUrl = `Please follow this link to reset your password. This link is valid for 10 minutes. <a href='${process.env.CLIENT_URL}/reset-password/${token}'>Click here.</a>`;
    const data = {
      to: email,
      text: "Hey Foodie!",
      subject: "Reset Password",
      html: resetUrl,
    };
    sendEmail(data);
    res.status(201).json({ token });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
};

//RESETPASSWORD

module.exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  console.log({ token, password });
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  try {
    let user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, //check if the date in the db is greater than the current date/timestamp when this function is called.
    });
    if (!user) throw new Error("Token expired! Try again later.");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user = await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//UPDATE PASSWORD

module.exports.updatePassword = async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  try {
    const user = await User.findById(_id);
    if (password) {
      user.password = password;
      const updatedUser = await user.save();
      return res.status(201).json(updatedUser);
    } else {
      throw new Error("No password provided");
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
