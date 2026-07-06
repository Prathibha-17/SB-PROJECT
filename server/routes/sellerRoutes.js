import express from "express";
import {
  registerSeller,
  loginSeller,
  addBook,
  getSellerBooks,
  updateBook,
  deleteBook,
  getSellerOrders,
} from "../controllers/sellerController.js";
import { protect, sellerOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// auth
router.post("/register", registerSeller);
router.post("/login", loginSeller);

// seller books
router.post("/books", protect, sellerOnly, addBook);
router.get("/books", protect, sellerOnly, getSellerBooks);
router.put("/books/:id", protect, sellerOnly, updateBook);
router.delete("/books/:id", protect, sellerOnly, deleteBook);

// seller orders
router.get("/orders", protect, sellerOnly, getSellerOrders);

export default router;