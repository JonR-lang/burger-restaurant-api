const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const {
  createBlogCategory,
  getSingleBlogCategory,
  getAllBlogCategories,
  updateBlogCategory,
  deleteBlogCategory,
} = require("../controllers/blogCategoryController");

const router = express.Router();

//CREATE
router.post("/", verifyToken, isAdmin, createBlogCategory);

//READ
router.get("/", getAllBlogCategories);
router.get("/:id", getSingleBlogCategory);

//UPDATE
router.put("/:id", verifyToken, isAdmin, updateBlogCategory);

//DELETE
router.delete("/:id", verifyToken, isAdmin, deleteBlogCategory);

module.exports = router;
