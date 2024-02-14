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
//
// const cloudinaryUpload = require("./utils/cloudinary");
// const upload = require("./middleware/multer");
// const { productImageResize } = require("./middleware/uploadImgMiddleware");

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

// app.post("/upload", upload.any(), async (req, res) => {
//   try {
//     console.log("BODY: ", req.body.title);
//     // console.log("FILE: ", req.files);
//     const result = await cloudinaryUpload(req.files);
//     // console.log(result);
//     res.status(201).json(result);
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({ error: error.message });
//   }
// });

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/blogs", blogRoutes);

app.use("/api/burger-types", burgerTypeRoutes);

app.use("/api/blog-categories", blogCategoryRoutes);

app.use("/api/coupons", couponRoutes);

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
