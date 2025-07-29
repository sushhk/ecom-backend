const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }
    const options = {
      amount: cart.totalPrice * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${userId}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);

    const order = new Order({
      userId,
      products: cart.products,
      totalPrice: cart.totalPrice,
      paymentStatus: "pending",
      orderId: razorpayOrder.id,
      receipt: razorpayOrder.receipt,
    });
    await order.save();

    res.status(201).json({
      success: true,
      order,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({
      message: "Error creating Razorpay order",
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_Id, razorpay_payment_Id, razorpay_signature } =
      req.body;

    const orderId = razorpay_order_Id;
    const paymentId = razorpay_payment_Id;
    const signature = razorpay_signature;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({
        message: "Invalid signature",
      });
    }
    const order = await Order.findOneAndUpdate(
      { orderId },
      {
        paymentStatus: "paid",
        paymentId,
      },
      { new: true }
    );

    await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { products: [], totalPrice: 0 }
    );

    // Clear the cart after successful payment
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      message: "Error verifying payment",
    });
  }
};
module.exports = {
  createRazorpayOrder,
  verifyPayment,
};
