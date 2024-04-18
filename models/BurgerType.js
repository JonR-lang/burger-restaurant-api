const { Schema, model } = require("mongoose");

const burgerTypeSchema = Schema(
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

const BurgerType = model("BurgerType", burgerTypeSchema);

module.exports = BurgerType;
