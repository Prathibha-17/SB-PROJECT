import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminDashboard,
  getAllUsers,
  getAllSellers,
  getAllBooksAdmin,
  deleteUser,
  deleteSeller,
  deleteBookAdmin,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// auth
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// dashboard
router.get("/dashboard", protect, adminOnly, getAdminDashboard);

// users
router.get("/users", protect, adminOnly, getAllUsers);
router.delete("/users/:id", protect, adminOnly, deleteUser);

// sellers
router.get("/sellers", protect, adminOnly, getAllSellers);
router.delete("/sellers/:id", protect, adminOnly, deleteSeller);

// books
router.get("/books", protect, adminOnly, getAllBooksAdmin);
router.delete("/books/:id", protect, adminOnly, deleteBookAdmin);

export default router;