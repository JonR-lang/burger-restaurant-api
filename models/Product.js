const { Schema, model } = require("mongoose");

const productSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "This field is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "This field is required"],
      lowercase: true,
      unique: true,
      set: (value) => value.split(" ").join("-"),
    },
    description: {
      type: String,
      required: [true, "This field is required"],
    },
    price: {
      type: Number,
      required: [true, "Product must have a price attached"],
    },
    ingredients: [
      {
        name: String,
        type: {
          type: String,
        },
      },
    ],
    featured: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [
        {
          url: { type: String, required: [true, "This field is required"] },
          publicId: {
            type: String,
            required: [true, "This field is required"],
          },
        },
      ],
    },
    quantity: {
      type: Number,
      required: [true, "This field is required"],
    },
    burgerType: {
      type: Schema.Types.ObjectId,
      ref: "BurgerType",
    },
    dietaryPreferences: {
      type: [
        {
          type: String,
          enum: [
            "Dairy-Free",
            "Spicy",
            "Gluten-Free",
            "Keto-Friendly",
            "Vegan",
            "Dairy",
            "Organic",
            "Low-Carb",
          ],
        },
      ],
      default: [],
    },
    ratings: [
      {
        star: {
          type: Number,
          max: [5, "This should not be more than 5"],
        },
        comment: {
          type: String,
          default: "",
        },
        postedBy: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalRatings: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    size: String,
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);

module.exports = Product;
