import express from "express";
import {
  registerUser,
  loginUser,
  getAllBooks,
  getBookById,
  addToCart,
  getUserCart,
  placeOrder,
  getUserOrders,
} from "../controllers/userController.js";
import { protect, userOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// books
router.get("/books", getAllBooks);
router.get("/books/:id", getBookById);

// cart
router.post("/cart", protect, userOnly, addToCart);
router.get("/cart", protect, userOnly, getUserCart);

// orders
router.post("/order", protect, userOnly, placeOrder);
router.get("/orders", protect, userOnly, getUserOrders);

export default router;