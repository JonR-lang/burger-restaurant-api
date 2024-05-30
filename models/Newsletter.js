const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");

const newsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "This field is required"],
      unique: true,
      lowercase: true,
      max: [50, "Name should not exceed 50 characters"],
      validate: [isEmail, "Please provide a valid email address"],
    },
    subscribedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

module.exports = model("Newsletter", newsletterSchema);
