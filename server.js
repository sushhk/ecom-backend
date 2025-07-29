const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", productRoutes);
app.use("/", cartRoutes);
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("database connected");
    app.listen(3000, () => {
      console.log("Server is running in  port 3000");
    });
  })
  .catch(() => {
    console.log("Error connecting to database", error.message);
  });
