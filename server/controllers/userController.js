import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Book from "../models/Book.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

/* ---------------- USER REGISTER ---------------- */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- USER LOGIN ---------------- */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "User login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- GET ALL BOOKS ---------------- */
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("seller", "name shopName");
    res.status(200).json({ success: true, books });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- GET SINGLE BOOK ---------------- */
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("seller", "name shopName");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ success: true, book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- ADD TO CART ---------------- */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId, quantity } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ book: bookId, quantity: quantity || 1 }],
        totalAmount: book.price * (quantity || 1),
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.book.toString() === bookId
      );

      if (existingItem) {
        existingItem.quantity += quantity || 1;
      } else {
        cart.items.push({ book: bookId, quantity: quantity || 1 });
      }

      // recalculate total
      let total = 0;
      for (const item of cart.items) {
        const itemBook = await Book.findById(item.book);
        total += itemBook.price * item.quantity;
      }
      cart.totalAmount = total;
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Book added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- GET USER CART ---------------- */
export const getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.book");
    if (!cart) {
      return res.status(404).json({ message: "Cart is empty" });
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- PLACE ORDER ---------------- */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate("items.book");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const orderItems = cart.items.map((item) => ({
      book: item.book._id,
      quantity: item.quantity,
      price: item.book.price,
    }));

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount: cart.totalAmount,
      shippingAddress,
      paymentMethod,
    });

    // reduce stock
    for (const item of cart.items) {
      const book = await Book.findById(item.book._id);
      if (book) {
        book.stock = Math.max(0, book.stock - item.quantity);
        await book.save();
      }
    }

    // clear cart
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- GET USER ORDERS ---------------- */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate("items.book");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};