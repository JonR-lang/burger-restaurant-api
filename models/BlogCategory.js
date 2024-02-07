const { Schema, model } = require("mongoose");

const blogCategorySchema = Schema(
  {
    title: {
      type: String,
      unique: true,
      index: true,
      required: [true, "This field is required"],
    },
  },
  { timestamps: true }
);

const BlogCategory = model("BlogCategory", blogCategorySchema);

module.exports = BlogCategory;
