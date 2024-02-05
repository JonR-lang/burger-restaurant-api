const { Router } = require("express");
const router = Router();
const {
  createUser,
  logIn,
  handleRefreshToken,
  logOut,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
} = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

// ===========================
//         CREATE
// ===========================

router.post("/register", createUser);
router.post("/login", logIn);

//REFRESHTOKEN
router.get("/refresh-token", handleRefreshToken);

//LOGOUT
router.get("/logout", logOut);

//FORGOT PASSWORD
router.post("/forgot-password-token", forgotPasswordToken);

//RESET PASSWORD
router.put("/reset-password/:token", resetPassword);

//UPDATE PASSWORD
router.put("/update-password", verifyToken, updatePassword); //It makes sense that this is the only one here with the verifyToken middleware, so as to verify that the user is actually logged in before he can change his password.

module.exports = router;
