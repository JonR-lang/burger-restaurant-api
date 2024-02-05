const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
  toggleBlockUser,
} = require("../controllers/userController");

// ===========================
//         READ
// ===========================
router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUser);

// ===========================
//         Delete
// ===========================
router.delete("/:id", verifyToken, isAdmin, deleteUser);

// ===========================
//         UPDATE
// ===========================
router.put("/:id", updateUser);
router.put("/block-user/:id", verifyToken, isAdmin, toggleBlockUser);

module.exports = router;
