const { Router } = require("express");
const router = Router();
const {
  createBlog,
  getAllBlogs,
  updateBlog,
  getBlog,
  deleteBlog,
  toggleLike,
} = require("../controllers/blogController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

//CREATE
router.post("/", verifyToken, isAdmin, createBlog);

//UPDATE
router.put("/:id", verifyToken, isAdmin, updateBlog);
router.patch("/likes/:id", verifyToken, toggleLike);

//READ
router.get("/", getAllBlogs);
router.get("/:id", getBlog);

//DELETE
router.delete("/:id", verifyToken, isAdmin, deleteBlog);

module.exports = router;
