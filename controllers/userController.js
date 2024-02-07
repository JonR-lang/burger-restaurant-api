const User = require("../models/User");
const validateMongoDbId = require("../utils/validateMongoDbId");

//////////////////
//      READ
//////////////////

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users.length) throw new Error("No users found");
    res.status(200).json(users);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

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

//////////////////
//    DELETE
//////////////////

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

//////////////////
//  UPDATE USER
//////////////////

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
