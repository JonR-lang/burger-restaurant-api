const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");

const {
  createProduct,
  getSingleProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  rateProduct,
} = require("../controllers/productController");

const router = express.Router();

//CREATE
router.post("/", upload.any(), verifyToken, isAdmin, createProduct);

//READ
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

//UPDATE
router.put("/:id", upload.any(), verifyToken, isAdmin, updateProduct);
router.put("/ratings/:id", verifyToken, rateProduct);

//DELETE
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

module.exports = router;
