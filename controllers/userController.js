const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");
const validateMongoDbId = require("../utils/validateMongoDbId");

//////////////////
//      READ
//////////////////

//GET ALL USERS
module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users.length) throw new Error("No users found");
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

//GET A SINGLE USER
module.exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id, "User");
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    console.log(user.fullName); //This is possible as a result of the virtual method I defined in the userSchema.
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

//GET USER'S CART
module.exports.getUserCart = async (req, res) => {
  const id = req.user._id;
  try {
    const userCart = await Cart.findOne({ orderedBy: id }).populate(
      "items.product"
    );
    if (!userCart) throw new Error("No cart found for this user.");
    res.status(200).json(userCart);
  } catch (error) {
    console.log(error);
    res.status(200).json({ error: error.message });
  }
};

//GET USER'S WISHLIST
module.exports.getWishlist = async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id).populate("wishlist");
    res.status(200).json(user.wishlist);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//////////////////
//   POST
//////////////////

//ADD TO CART
module.exports.addToCart = async (req, res) => {
  const { cartItems } = req.body;
  const userId = req.user._id;
  try {
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error("Items in the array cannot be empty");
    }

    let items = [];

    const existingCart = await Cart.findOne({ orderedBy: userId });

    if (existingCart) {
      await Cart.deleteOne({ _id: existingCart._id }); // Use deleteOne() to delete the document
    }

    for (let cartItem of cartItems) {
      validateMongoDbId(cartItem.productId, "Product");

      let object = {};

      object.product = cartItem.productId;
      object.quantity = parseInt(cartItem.quantity);
      object.size = cartItem.size;

      let getProductPrice = await Product.findById(cartItem.productId).select(
        "price"
      );

      if (!getProductPrice)
        throw new Error(
          `Cannot get price of Product with id of '${cartItem.productId}'. Does product exist?`
        );

      const { price } = getProductPrice;
      object.subTotal = parseFloat(price) * parseInt(cartItem.quantity);
      items.push(object);
    }

    let cartTotal = 0;

    for (let item of items) {
      cartTotal += item.subTotal;
    }

    const newCart = await Cart.create({
      items,
      cartTotal,
      orderedBy: userId,
    });

    res.status(201).json(newCart);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

//APPLY COUPON
module.exports.applyCoupon = async (req, res) => {
  const { coupon } = req.body;
  const userId = req.user._id;
  try {
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (!validCoupon) throw new Error("Invalid Coupon!");
    if (Date.now() > validCoupon.expires.getTime())
      throw new Error("Coupon expired!");
    const userCart = await Cart.findOne({ orderedBy: userId });
    if (!userCart) throw new Error("Cannot apply coupon on inexistent Cart");
    const { cartTotal } = userCart;
    const discountAmount =
      (parseFloat(cartTotal) * parseInt(validCoupon.discount)) / 100;
    const totalAfterDiscount = (cartTotal - discountAmount).toFixed(2);
    const updatedCart = await Cart.findByIdAndUpdate(
      userCart.id,
      {
        totalAfterDiscount,
      },
      { new: true }
    );
    res
      .status(201)
      .json({ message: "Valid Coupon, Coupon Applied!", updatedCart });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

//////////////////
//    DELETE
//////////////////

//DELETE
module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    validateMongoDbId(id, "User");
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error("User not found");
    res.status(200).json({ message: "User had been deleted successfully" });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

//EMPTY CART
module.exports.emptyCart = async (req, res) => {
  const userId = req.user._id;
  try {
    const userCart = await Cart.findOne({ orderedBy: userId });
    if (userCart) {
      await Cart.findByIdAndDelete(userCart._id);
      return res
        .status(200)
        .json({ message: "This cart has been deleted successfully" });
    } else {
      return res.status(200).json({ message: "This user has no cart." });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

//////////////////
//  UPDATE USER
// - updateUser
// - toggleBlockUser
// - toggleWishList
// - addToCart
// - applyCoupon
//////////////////

//UPDATE USER
module.exports.updateUser = async (req, res) => {
  const { id } = req.params;

  const { firstName, lastName, email, mobile, picturePath } = req.body;
  try {
    validateMongoDbId(id, "User");
    const user = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        mobile,
        picturePath,
      },
      { new: true }
    );
    if (!user) throw new Error("User not found");
    res.status(201).json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

//BLOCK || UNBLOCK USER
module.exports.toggleBlockUser = async (req, res) => {
  const { id } = req.params;

  try {
    validateMongoDbId(id, "User");
    const user = await User.findById(id);
    if (!user) throw new Error("User not found");
    user.isBlocked = !user.isBlocked;
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//ADD || REMOVE FROM WISHLIST
module.exports.toggleWishlist = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  try {
    validateMongoDbId(id, "Product");
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    const wishlist = user.wishlist.find((item) => item.toString() === id);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      wishlist ? { $pull: { wishlist: id } } : { $push: { wishlist: id } },
      { new: true }
    );
    res.status(201).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//SAVE USER'S ADDRESS
module.exports.saveAddress = async (req, res) => {
  const id = req.user._id;
  const { address } = req.body;

  try {
    validateMongoDbId(id, "User");
    const user = await User.findByIdAndUpdate(
      id,
      {
        address,
      },
      { new: true }
    );
    if (!user) throw new Error("User not found");
    res.status(201).json({
      message: "Address successfully updated!",
      address: user.address,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
