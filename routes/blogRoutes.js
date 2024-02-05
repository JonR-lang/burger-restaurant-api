const { Router } = require("express");
const router = Router();
const { createBlog, getAllBlogs } = require("../controllers/blogController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

//CREATE
router.post("/", verifyToken, isAdmin, createBlog);

//READ
router.get("/", getAllBlogs);
module.exports = router;
