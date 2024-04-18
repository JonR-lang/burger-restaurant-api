const { Schema, model } = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
const cartSchema = new Schema({
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
  cartTotal: Number,
  totalAfterDiscount: Number,
  orderedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

//Export the model
module.exports = model("Cart", cartSchema);
