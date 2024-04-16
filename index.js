const express = require("express");
const cors = require("cors");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDb = require("./utils/dbConnect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const blogRoutes = require("./routes/blogRoutes");
const burgerTypeRoutes = require("./routes/burgerTypeRoutes");
const blogCategoryRoutes = require("./routes/blogCategoryRoutes");
const couponRoutes = require("./routes/couponRoutes");
const orderRoutes = require("./routes/orderRoutes");

require("dotenv").config();

const app = express();

//MIDDLEWARE
app.use(cors("*"));
app.use(express.json());
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(helmet());
app.use(morgan("common"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).send("Server is up and running");
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/blogs", blogRoutes);

app.use("/api/burger-types", burgerTypeRoutes);

app.use("/api/blog-categories", blogCategoryRoutes);

app.use("/api/coupons", couponRoutes);

app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 8080;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Error connecting to MongoDb: ${error.message}`);
  });
