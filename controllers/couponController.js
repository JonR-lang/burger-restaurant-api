const Coupon = require("../models/Coupon");
const validateMongoDbId = require("../utils/validateMongoDbId");

//CREATE
module.exports.createCoupon = async (req, res) => {
  const { name, expires, discount } = req.body;
  try {
    const coupon = await Coupon.create({ name, expires, discount });
    res.status(201).json(coupon);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

//READ
module.exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports.getCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id, "Coupon");
    let coupon = await Coupon.findById(id);
    if (!coupon) throw new Error("Coupon not found");
    coupon = await coupon.save();
    res.status(200).json(coupon);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

//UPDATE
module.exports.updateCoupon = async (req, res) => {
  const { id } = req.params;
  const { name, expires, discount } = req.body;
  try {
    validateMongoDbId(id, "Coupon");
    const coupon = await Coupon.findByIdAndUpdate(
      id,
      {
        name,
        expires,
        discount,
      },
      { new: true }
    );
    if (!coupon) throw new Error("Coupon not found!");
    res.status(200).json(coupon);
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

//DELETE BLOG
module.exports.deleteCoupon = async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id, "Coupon");
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) throw new Error("Coupon not found");
    res.status(200).json({ message: "Coupon successfully deleted" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
