const { Router } = require("express");
const router = Router();
const upload = require("../middleware/multer");

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
router.post("/", upload.any(), verifyToken, isAdmin, createBlog);

//UPDATE
router.put("/:id", upload.any(), verifyToken, isAdmin, updateBlog);
router.patch("/likes/:id", verifyToken, toggleLike);

//READ
router.get("/", getAllBlogs);
router.get("/:id", getBlog);

//DELETE
router.delete("/:id", verifyToken, isAdmin, deleteBlog);

module.exports = router;
