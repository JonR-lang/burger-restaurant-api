const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrder,
  verifyPayment,
  updateOrder,
} = require("../controllers/orderController");

//CREATE

router.post("/", verifyToken, createOrder);
router.post("/verify-payment", verifyPayment);

//READ
router.get("/", verifyToken, isAdmin, getAllOrders);
router.get("/:id", verifyToken, isAdmin, getOrder);

//UPDATE
router.put("/:id", verifyToken, isAdmin, updateOrder);
module.exports = router;
