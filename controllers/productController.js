const { query } = require("express");
const Product = require("../models/Product");
const validateMongoDbId = require("../utils/validateMongoDbId");

//CREATE
module.exports.createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    ingredients,
    images,
    quantity,
    burgerType,
    dietaryPreferences,
    sold,
    size,
  } = req.body;

  try {
    const product = await Product.create({
      name,
      slug: name,
      description,
      price,
      ingredients,
      images,
      quantity,
      burgerType,
      dietaryPreferences,
      sold,
      size,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

//READ
module.exports.getAllProducts = async (req, res) => {
  try {
    //I want you to note that not attaching await to the find method on the products, returns a query object in which you can use mongoDB native query methods on. Attaching await just means that you want to return the result.
    //Some of these mongodb methods include sort, limit, skip.

    //FILTERING
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((field) => delete queryObj[field]);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    const queryObject = JSON.parse(queryString);

    let query = Product.find(queryObject);
    console.log("Query: ", query);

    //SORTING
    const { sort } = req.query;
    if (sort) {
      const sortBy = sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //LIMITING FIELDS
    const { fields } = req.query;
    if (fields) {
      const selectedFields = fields.split(",").join(" ");
      query = query.select(selectedFields);
    } else {
      query = query.select("-__v");
    }

    //PAGINATION
    const page = req.query.page * 1 || 1; //it is multiplied by one so that it would convert the string to a number. That is just the easiest way to convert a string number to an actual number.
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const productCount = await Product.countDocuments();
      if (skip >= productCount) {
        throw new Error("Page not found!");
      }
    }

    const products = await query;
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

module.exports.getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id, "Product");
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found. Recheck product Id");
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

//UPDATE

module.exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    ingredients,
    images,
    quantity,
    burgerType,
    dietaryPreferences,
    sold,
    size,
  } = req.body;
  try {
    validateMongoDbId(id, "Product");
    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        ingredients,
        images,
        quantity,
        burgerType,
        dietaryPreferences,
        sold,
        size,
      },
      { new: true }
    );
    if (!product) throw new Error("Product not found. Recheck product Id");
    res.status(201).json(product);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

//DELETE
module.exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id, "Product");
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error("Product not found. Recheck product Id");
    res.status(200).json({ message: "Product has been deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};
