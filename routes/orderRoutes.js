const express = require("express");
const { isAuth } = require("../middlewares/authMiddlewares");
const {
  verifyPayment,
  createRazorpayOrder,
} = require("../controllers/orderController");
const orderRoutes = express.Router();

orderRoutes.post("/create-razorpay-order", isAuth, createRazorpayOrder);
orderRoutes.post("/verify-payment", isAuth, verifyPayment);

module.exports = orderRoutes;
