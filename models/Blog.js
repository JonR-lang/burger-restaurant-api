const { Schema, model } = require("mongoose");

const blogSchema = Schema(
  {
    title: {
      type: String,
      required: [true, "This field is required!"],
    },
    body: {
      type: String,
      required: [true, "This field is required!"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
    },
    views: {
      type: Number,
      default: 0,
    },
    picturePath: {
      type: String,
      default:
        "https://media.istockphoto.com/id/922745190/photo/blogging-blog-concepts-ideas-with-worktable.jpg?s=612x612&w=0&k=20&c=xR2vOmtg-N6Lo6_I269SoM5PXEVRxlgvKxXUBMeMC_A=",
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

const Blog = model("Blog", blogSchema);

module.exports = Blog;
