const { Schema, model } = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "This field is required"],
      max: [50, "Name should not exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "This field is required"],
      max: [50, "Name should not exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "This field is required"],
      unique: true,
      lowercase: true,
      max: [50, "Name should not exceed 50 characters"],
      validate: [isEmail, "Please provide a valid email address"],
    },
    picturePath: {
      type: String,
      default: "",
    },
    mobile: {
      type: String,
      required: [true, "This field is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "This field is required"],
      min: [6, "Password must be more than six characters long."],
    },
    role: {
      type: String,
      default: "user",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    cart: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
    },
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
    wishlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    refreshToken: {
      type: String,
      default: "",
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  } //do not underesitimate the importance of this line! I know why I dey talk am, lol.
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.virtual("fullName").get(function (value, virtual, doc) {
  return `${this.firstName} ${this.lastName} `;
}); //This is to get the fullName of the user, despite it not being a property which is saved to the database

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
  const isMatched = await bcrypt.compare(enteredPassword, this.password);
  return isMatched;
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10 minutes
  return resetToken;
};

module.exports = model("User", userSchema);
