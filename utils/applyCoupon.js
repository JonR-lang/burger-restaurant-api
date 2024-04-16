const Coupon = require("../models/Coupon");

const applyCoupon = async (coupon, totalAmount) => {
  try {
    const validCoupon = await Coupon.findOne({ name: coupon });
    if (!validCoupon) throw new Error("Invalid Coupon!");
    if (Date.now() > validCoupon.expires.getTime())
      throw new Error("Coupon expired!");

    const discountAmount =
      (parseFloat(totalAmount) * parseInt(validCoupon.discount)) / 100;
    return discountAmount;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = applyCoupon;
