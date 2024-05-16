const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
  toggleBlockUser,
  toggleWishlist,
  getWishlist,
  saveAddress,
  addToCart,
  getUserCart,
  emptyCart,
  applyCoupon,
} = require("../controllers/userController");

// ===========================
//         READ
// ===========================
router.get("/", verifyToken, isAdmin, getAllUsers);
router.get("/wishlist", verifyToken, getWishlist); //Point to note, static routes should always come before dynamic routes!
router.get("/cart", verifyToken, getUserCart);
router.get("/:id", verifyToken, getUser);

// ===========================
//         POST
// ===========================
router.post("/cart", verifyToken, addToCart);
router.post("/cart/apply-coupon", verifyToken, applyCoupon);

// ===========================
//         Delete
// ===========================
router.delete("/cart", verifyToken, emptyCart);
router.delete("/:id", verifyToken, isAdmin, deleteUser);

// ===========================
//         UPDATE
// ===========================
router.put("/save-address", verifyToken, saveAddress);
router.put("/block-user/:id", verifyToken, isAdmin, toggleBlockUser);
router.put("/:id", verifyToken, updateUser);
router.patch("/wishlist/:id", verifyToken, toggleWishlist);

module.exports = router;
