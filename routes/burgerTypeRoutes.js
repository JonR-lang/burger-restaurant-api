const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const {
  createBurgerType,
  getSingleBurgerType,
  getAllBurgerTypes,
  updateBurgerType,
  deleteBurgerType,
} = require("../controllers/burgerTypeController");

const router = express.Router();

//CREATE
router.post("/", verifyToken, isAdmin, createBurgerType);

//READ
router.get("/", getAllBurgerTypes);
router.get("/:id", getSingleBurgerType);

//UPDATE
router.put("/:id", verifyToken, isAdmin, updateBurgerType);

//DELETE
router.delete("/:id", verifyToken, isAdmin, deleteBurgerType);

module.exports = router;
