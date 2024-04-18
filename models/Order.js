const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        size: {
          type: String,
          enum: ["small", "large", "medium"],
        },
        subTotal: { type: Number, required: true },
      },
    ],
    totalAmount: Number,
    paymentIntent: {},
    address: {
      state: {
        type: String,
      },
      city: {
        type: String,
      },
      street: {
        type: String,
      },
      landmark: String,
    },
    coupon: String,
    couponApplied: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "dispatched", "delivered", "cancelled", "returned"],
      default: "pending",
    },
    orderedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("Order", orderSchema);
