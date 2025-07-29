const express = require("express");
const router = express.Router();

const userController = require("../Controller.js/userController.js");
const { updateUser, deleteUser } = require("../controllers/userController.js");

router.put("/update/:id", updateUser);

router.delete("/delete/:id", deleteUser);

module.exports = userRoutes;
