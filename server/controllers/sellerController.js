import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Seller from "../models/Seller.js";
import Book from "../models/Book.js";
import Order from "../models/Order.js";

/* ---------------- SELLER REGISTER ---------------- */
export const registerSeller = async (req, res) => {
  try {
    const { name, shopName, email, password, phone, address } = req.body;

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({ message: "Seller already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await Seller.create({
      name,
      shopName,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Seller registered successfully",
      seller,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- SELLER LOGIN ---------------- */
export const loginSeller = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const isMatch = await bcrypt.compare(password, seller.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: seller._id, role: "seller" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Seller login successful",
      token,
      seller,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- ADD BOOK ---------------- */
export const addBook = async (req, res) => {
  try {
    const { title, author, genre, description, price, stock, image } = req.body;

    const book = await Book.create({
      title,
      author,
      genre,
      description,
      price,
      stock,
      image,
      seller: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Book added successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- GET SELLER BOOKS ---------------- */
export const getSellerBooks = async (req, res) => {
  try {
    const books = await Book.find({ seller: req.user.id });
    res.status(200).json({ success: true, books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- UPDATE BOOK ---------------- */
export const updateBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, seller: req.user.id });

    if (!book) {
      return res.status(404).json({ message: "Book not found or unauthorized" });
    }

    Object.assign(book, req.body);
    await book.save();

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- DELETE BOOK ---------------- */
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      seller: req.user.id,
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- SELLER ORDERS ---------------- */
export const getSellerOrders = async (req, res) => {
  try {
    const books = await Book.find({ seller: req.user.id });
    const bookIds = books.map((b) => b._id.toString());

    const orders = await Order.find({
      "items.book": { $in: bookIds },
    }).populate("user items.book");

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};