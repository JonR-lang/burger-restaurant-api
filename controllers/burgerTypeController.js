const BurgerType = require("../models/BurgerType");
const validateMongoDbId = require("../utils/validateMongoDbId");

//CREATE
module.exports.createBurgerType = async (req, res) => {
  const { title } = req.body;
  try {
    const category = await BurgerType.create({ title });
    res
      .status(201)
      .json({ message: `${category.title} category created successfully` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//READ
module.exports.getAllBurgerTypes = async (req, res) => {
  try {
    const burgerType = await BurgerType.find();
    res.status(200).json(burgerType);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports.getSingleBurgerType = async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id, "BurgerType");
    const burgerType = await BurgerType.findById(id);
    if (!burgerType) throw new Error("burgerType exists not");
    res.status(200).json(burgerType);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//UPDATE
module.exports.updateBurgerType = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    validateMongoDbId(id, "BurgerType");
    const burgerType = await BurgerType.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    );
    if (!burgerType) throw new Error("burgerType exists not");
    res.status(201).json(burgerType);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

//DELETE
module.exports.deleteBurgerType = async (req, res) => {
  const { id } = req.params;
  try {
    validateMongoDbId(id, "BurgerType");
    const burgerType = await BurgerType.findByIdAndDelete(id);
    if (!burgerType) throw new Error("burgerType exists not");
    res
      .status(200)
      .json({ message: `${burgerType.title} burgerType deleted successfully` });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
