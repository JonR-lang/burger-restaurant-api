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
    paymentIntent: {},
    status: {
      type: String,
      enum: [
        "Not Processed",
        "Pay on Delivery",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Delivered",
        "Returned",
      ],
      default: "Not processed",
    },
    orderedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("Order", orderSchema);
