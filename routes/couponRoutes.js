const { Router } = require("express");
const router = Router();
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  getCoupon,
  deleteCoupon,
} = require("../controllers/couponController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

//CREATE
router.post("/", verifyToken, isAdmin, createCoupon);

//READ
router.get("/", verifyToken, isAdmin, getAllCoupons);
router.get("/:id", verifyToken, isAdmin, getCoupon);

//UPDATE
router.put("/:id", verifyToken, isAdmin, updateCoupon);

//DELETE
router.delete("/:id", verifyToken, isAdmin, deleteCoupon);

module.exports = router;
