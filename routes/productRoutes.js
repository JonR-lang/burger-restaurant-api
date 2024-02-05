const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

//CREATE
router.post("/", verifyToken, isAdmin, createProduct);

//READ
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

//UPDATE
router.put("/:id", verifyToken, isAdmin, updateProduct);

//DELETE
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

module.exports = router;
