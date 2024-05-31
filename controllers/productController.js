const Product = require("../models/Product");
const validateMongoDbId = require("../utils/validateMongoDbId");
const { cloudinaryUpload, cloudinaryDestroy } = require("../utils/cloudinary");

//CREATE
module.exports.createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    ingredients,
    featured,
    quantity,
    burgerType,
    dietaryPreferences,
    size,
  } = req.body;

  try {
    const imageURIs = await cloudinaryUpload(req.files, "Products");
    const product = await Product.create({
      name,
      slug: name,
      description,
      price,
      ingredients,
      featured,
      images: imageURIs,
      quantity,
      burgerType,
      dietaryPreferences,
      size,
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//READ
module.exports.getAllProducts = async (req, res) => {
  try {
    //I want you to note that not attaching await to the find method on the products, returns a query object in which you can use mongoDB native query methods on. Attaching await just means that you want to return the result.
    //Some of these mongodb methods include sort, limit, skip.

    //FILTERING
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((field) => delete queryObj[field]);
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt|in)\b/g,
      (match) => `$${match}`
    );
    const queryObject = JSON.parse(queryString);

    // FUZZY SEARCH
    const { search } = req.query;
    if (search) {
      const searchRegex = new RegExp(search, "i"); // 'i' for case-insensitive

      queryObject.$or = [
        { name: { $regex: searchRegex } },
        { category: { $regex: searchRegex } },
        { dietaryPreferences: { $regex: searchRegex } },
        { "ingredients.name": { $regex: searchRegex } },
      ];
    }

    let query = Product.find(queryObject);

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

    const totalCount = await Product.countDocuments(queryObject);

    if (!(fields && search)) {
      query = query
        .populate("ratings.postedBy", "firstName lastName picturePath")
        .populate("burgerType", "title");
    }

    const products = await query;
    res.status(200).json({ products, totalCount });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

module.exports.getSingleProduct = async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id, "Product");
    const product = await Product.findById(id)
      .populate("ratings.postedBy", "firstName lastName picturePath")
      .populate("burgerType", "title");
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
    quantity,
    burgerType,
    featured,
    dietaryPreferences,
    sold,
    size,
  } = req.body;

  try {
    console.log(req.files);
    validateMongoDbId(id, "Product");
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");

    //The code below initializes the variable imageURIs, if the req.files.length is greater than zero, the imageURIs becomes the result of the upload of the image files to cloudinary. This also means that if from the front end, during the update request, image files are not sent alongside, the images are not changed. Remember if a you set a value to undefined in mongodb, the initial values rename the same. I am just taking advantage of this behaviour.

    let imageURIs;
    if (req.files && req.files.length > 0) {
      let imagePublicIds = product.images.map(
        (arrayImage) => arrayImage.publicId
      );
      console.log(imagePublicIds);
      if (!imagePublicIds[0]) {
        imagePublicIds = null;
      }
      await cloudinaryDestroy(imagePublicIds);
      imageURIs = await cloudinaryUpload(req.files, "Products");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        ingredients,
        images: imageURIs,
        quantity,
        featured,
        burgerType,
        dietaryPreferences,
        sold,
        size,
      },
      { new: true }
    );
    if (!updatedProduct)
      throw new Error("Product not found. Recheck product Id");
    res.status(201).json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};

//RATE PRODUCT
module.exports.rateProduct = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const { star, comment } = req.body;
  try {
    validateMongoDbId(productId, "Product");
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found!");

    //Check if the user that wants to rate has rated this product before.
    const existingRating = product.ratings.find(
      (rating) => rating.postedBy.toString() === userId.toString()
    );

    //If product has been rated before, then just update his previous rating with the new one else, add his new rating to the ratings array.
    existingRating
      ? ((existingRating.star = star), (existingRating.comment = comment))
      : product.ratings.push({ star, comment, postedBy: userId });

    const totalStars = product.ratings.reduce(
      (acc, rating) => acc + rating.star,
      0
    );
    const averageRating = parseInt(totalStars) / product.ratings.length;
    product.totalRatings = averageRating;
    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//DELETE
module.exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id, "Product");
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found. Recheck product Id");
    let imagePublicIds = product.images.map(
      (arrayImage) => arrayImage.publicId
    );

    if (!imagePublicIds[0]) {
      imagePublicIds = null;
    } //This line of code checks if the array returned above contains a falsy value. If it does, we just change it to null, so that the cloudinary destroy function would handlw it better.

    await cloudinaryDestroy(imagePublicIds);
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product has been deleted successfully." });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: error.message });
  }
};
