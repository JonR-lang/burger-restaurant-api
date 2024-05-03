const { default: mongoose } = require("mongoose");

require("dotenv").config();
const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_DB_URL);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    throw error;
  }
};

module.exports = connectDb;
