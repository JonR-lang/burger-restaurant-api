const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const connectDb = require("./utils/dbConnect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require('./routes/contactRoutes')
const productRoutes = require("./routes/productRoutes");
const blogRoutes = require("./routes/blogRoutes");
const burgerTypeRoutes = require("./routes/burgerTypeRoutes");
const blogCategoryRoutes = require("./routes/blogCategoryRoutes");
const couponRoutes = require("./routes/couponRoutes");
const orderRoutes = require("./routes/orderRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const { clients } = require("./utils/clients");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
    credentials: true,
  },
});

//MIDDLEWARE
app.use(
  cors({
    origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(helmet());
app.use(morgan("common"));
app.use(cookieParser());

app.get("/", (req, res) => {
  const postmanApiUrl = 'https://documenter.getpostman.com/view/31816174/2sA3BoZWTU'
  res.redirect(postmanApiUrl)
  res.status(200).send("Server is up and running");
});

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/blogs", blogRoutes);

app.use("/api/burger-types", burgerTypeRoutes);

app.use("/api/blog-categories", blogCategoryRoutes);

app.use("/api/coupons", couponRoutes);

app.use("/api/contact", contactRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/newsletter", newsletterRoutes);

const developmentPort = 5000;
const productionPort = process.env.PORT || 8080;

const PORT =
  process.env.NODE_ENV === "production" ? productionPort : developmentPort;

connectDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Error connecting to MongoDb: ${error.message}`);
  });

//WebSocket Connection handler

//First keep track of the connected clients by creating a map object where you can store the userIds, once they register
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);

  socket.on("register", (userId) => {
    clients.set(userId, socket);
    console.log(
      `Client with userId: ${userId} registered with socketId: ${socket.id}`
    );
  });

  socket.on("disconnect", () => {
    for (let [userId, clientSocket] of clients.entries()) {
      if (clientSocket.id === socket.id) {
        clients.delete(userId);
        console.log(`User ${userId} disconnected`);
      }
      break;
    }
  });
});
