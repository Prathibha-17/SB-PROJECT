import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Book from '../models/Book.js';
import { isDbConnected } from '../config/db.js';
import { mockOrders, mockBooks } from '../database/mockDb.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingDetails, totalAmount } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  }

  if (!isDbConnected) {
    // Verify and update stock in local mockBooks array
    for (const item of orderItems) {
      const book = mockBooks.find(b => b._id === item.bookId);
      if (!book) {
        res.status(404);
        throw new Error(`Book not found with ID ${item.bookId}`);
      }
      if (book.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for book "${book.title}". Available: ${book.stock}, Requested: ${item.quantity}`);
      }
      book.stock -= item.quantity;
    }

    const newOrder = {
      _id: `ord-${Date.now()}`,
      userId: req.user._id,
      userName: req.user.name,
      items: orderItems,
      shippingDetails,
      totalAmount: Number(totalAmount),
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    mockOrders.unshift(newOrder);
    res.status(201).json(newOrder);
    return;
  }

  // Verify and update stock
  for (const item of orderItems) {
    const book = await Book.findById(item.bookId);
    if (!book) {
      res.status(404);
      throw new Error(`Book not found with ID ${item.bookId}`);
    }
    if (book.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for book "${book.title}". Available: ${book.stock}, Requested: ${item.quantity}`);
    }
    book.stock -= item.quantity;
    await book.save();
  }

  const order = new Order({
    userId: req.user._id,
    userName: req.user.name,
    items: orderItems,
    shippingDetails,
    totalAmount,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  if (!isDbConnected) {
    const orders = mockOrders
      .filter(o => o.userId === req.user._id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(orders);
    return;
  }

  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  if (!isDbConnected) {
    res.json(mockOrders);
    return;
  }

  const orders = await Order.find({}).sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!isDbConnected) {
    const orderIndex = mockOrders.findIndex(o => o._id === req.params.id);
    if (orderIndex !== -1) {
      mockOrders[orderIndex].status = status;
      res.json(mockOrders[orderIndex]);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
    return;
  }

  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});
