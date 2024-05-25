const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrder,
  verifyPayment,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

//CREATE

router.post("/", verifyToken, createOrder);
router.post("/verify-payment", verifyPayment);

//READ
router.get("/", verifyToken, isAdmin, getAllOrders);
router.get("/:id", verifyToken, getOrder);

//UPDATE
router.put("/:id", verifyToken, isAdmin, updateOrder);

//DELETE
router.delete("/:id", verifyToken, isAdmin, deleteOrder);

module.exports = router;
