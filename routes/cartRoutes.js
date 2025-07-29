const express = require("express");
const {
  updateQuantity,
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { isAuth } = require("../middlewares/authMiddlewares");
const cartRoutes = express.Router();

cartRoutes.get("/cart", isAuth, getCart);
cartRoutes.post("/cart/add", isAuth, addToCart);
cartRoutes.put("/cart", isAuth, updateQuantity);
cartRoutes.delete("/cart/product", isAuth, removeFromCart);
cartRoutes.delete("/cart", isAuth, clearCart);

module.exports = cartRoutes;
