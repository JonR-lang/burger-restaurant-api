const Blog = require("../models/Blog");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { cloudinaryUpload, cloudinaryDestroy } = require("../utils/cloudinary");

//CREATE BLOG
module.exports.createBlog = async (req, res) => {
  const { title, body, category, author } = req.body;
  try {
    const imageURIs = await cloudinaryUpload(req.files, "Blogs");
    const blog = await Blog.create({
      title,
      body,
      category,
      images: imageURIs,
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
    const blogs = await Blog.find(req.query)
      .populate("author", "firstName lastName picturePath")
      .populate("category", "title");
    res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//GET BLOG
module.exports.getBlog = async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id, "Blog");
    let blog = await Blog.findById(id)
      .populate("author", "firstName lastName picturePath")
      .populate("category", "title");
    if (!blog) throw new Error("Blog not found");
    blog.views++;
    blog = await blog.save();
    res.status(200).json(blog);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

//UPDATE BLOG
module.exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, body, category, author } = req.body;
  try {
    validateMongoDbId(id, "Blog");
    const blog = await Blog.findById(id);
    if (!blog) throw new Error("Blog not found");

    //The code below initializes the variable imageURIs, if the req.files.length is greater than zero, the imageURIs becomes the result of the upload of the image files to cloudinary. This also means that if from the front end, during the update request, image files are not sent alongside, the images are not changed. Remember if a you set a value to undefined in mongodb, the initial values rename the same. I am just taking advantage of this behaviour.

    let imageURIs;
    if (req.files && req.files.length > 0) {
      let imagePublicIds = blog.images.map((arrayImage) => arrayImage.publicId);
      if (!imagePublicIds[0]) {
        imagePublicIds = null;
      }
      await cloudinaryDestroy(imagePublicIds);
      imageURIs = await cloudinaryUpload(req.files, "Blogs");
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        body,
        category,
        images: imageURIs,
        author,
      },
      { new: true }
    );

    if (!updatedBlog) throw new Error("Blog not found!");
    res.status(201).json(updatedBlog);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

//LIKE
module.exports.toggleLike = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    validateMongoDbId(id, "Blog");
    validateMongoDbId(id, "User");
    let blog = await Blog.findById(id);
    if (blog.likes.includes(userId)) {
      //remove userId from array of likes
      blog.likes = blog.likes.filter(
        (item) => item.toString() !== userId.toString()
      );
    } else {
      //add userId to the array of likes
      blog.likes.push(userId);
    }
    const updatedBlog = await blog.save();
    res.status(201).json(updatedBlog);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

//DELETE BLOG
module.exports.deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id, "Blog");
    const blog = await Blog.findById(id);
    if (!blog) throw new Error("Blog not found");
    let imagePublicIds = blog.images.map((arrayImage) => arrayImage.publicId);

    if (!imagePublicIds[0]) {
      imagePublicIds = null;
    }

    await cloudinaryDestroy(imagePublicIds);
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog successfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
