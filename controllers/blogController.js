const Blog = require("../models/Blog");
const User = require("../models/User");
const validateMongoDbId = require("../utils/validateMongoDbId");

//CREATE BLOG
module.exports.createBlog = async (req, res) => {
  const { title, body, category, picturePath, author } = req.body;
  try {
    const blog = await Blog.create({
      title,
      body,
      category,
      picturePath,
      author,
    });
    res.status(201).json(blog);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

//GET ALL BLOGS
module.exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "firstName lastName");
    res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, body, category, picturePath } = req.body;
  try {
    validateMongoDbId(id, "Blog");
    const blog = await User.findByIdAndUpdate(
      id,
      {
        title,
        body,
        category,
        picturePath,
        author,
      },
      { new: true }
    );
    if (!blog) throw new Error();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};
