const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

const {
  subscribe,
  unsubscribe,
  getSubscribers,
  sendNewsletter,
} = require("../controllers/newsletterController");

// ===========================
//         READ
// ===========================
router.get("/subscribers", getSubscribers);

// ===========================
//         POST
// ===========================
router.post("/subscribe", subscribe);
router.post("/send-newsletter", verifyToken, isAdmin, sendNewsletter);

// ===========================
//         DELETE
// ===========================
router.delete("/unsubscribe", unsubscribe);

module.exports = router;
