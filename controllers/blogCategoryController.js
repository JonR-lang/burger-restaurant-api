const BlogCategory = require("../models/BlogCategory");
const validateMongoDbId = require("../utils/validateMongoDbId");

//CREATE
module.exports.createBlogCategory = async (req, res) => {
  const { title } = req.body;
  try {
    const category = await BlogCategory.create({ title });
    res
      .status(201)
      .json({ message: `${category.title} category created successfully` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//READ
module.exports.getAllBlogCategories = async (req, res) => {
  try {
    const category = await BlogCategory.find();
    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports.getSingleBlogCategory = async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id, "Blog Category");
    const category = await BlogCategory.findById(id);
    if (!category) throw new Error("Category exists not");
    res.status(200).json(category);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//UPDATE
module.exports.updateBlogCategory = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const category = await BlogCategory.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );
    if (!category) throw new Error("Category exists not");
    res.status(201).json(category);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//DELETE
module.exports.deleteBlogCategory = async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id, "Blog Category");
    const category = await BlogCategory.findByIdAndDelete(id);
    if (!category) throw new Error("Category exists not");
    res
      .status(200)
      .json({ message: `${category.title} category deleted successfully` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
