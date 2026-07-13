import asyncHandler from 'express-async-handler';
import Book from '../models/Book.js';
import { isDbConnected } from '../config/db.js';
import { mockBooks } from '../database/mockDb.js';

// @desc    Get all books with optional search
// @route   GET /api/books
// @access  Public
export const getBooks = asyncHandler(async (req, res) => {
  if (!isDbConnected) {
    let result = [...mockBooks];
    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      result = result.filter(
        b =>
          b.title.toLowerCase().includes(search) ||
          b.author.toLowerCase().includes(search)
      );
    }
    res.json(result);
    return;
  }

  const keyword = req.query.search
    ? {
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { author: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  const books = await Book.find({ ...keyword });
  res.json(books);
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
export const getBookById = asyncHandler(async (req, res) => {
  if (!isDbConnected) {
    const book = mockBooks.find(b => b._id === req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404);
      throw new Error('Book not found');
    }
    return;
  }

  const book = await Book.findById(req.params.id);

  if (book) {
    res.json(book);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
export const createBook = asyncHandler(async (req, res) => {
  const { title, author, category, price, publishedYear, description, coverUrl, stock } = req.body;

  if (!isDbConnected) {
    const newBook = {
      _id: `b-${Date.now()}`,
      title,
      author,
      category,
      price: Number(price),
      publishedYear: Number(publishedYear),
      description,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400',
      stock: Number(stock),
      rating: 4.0,
      reviews: 0
    };
    mockBooks.unshift(newBook);
    res.status(201).json(newBook);
    return;
  }

  const book = new Book({
    title,
    author,
    category,
    price,
    publishedYear,
    description,
    coverUrl,
    stock,
  });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = asyncHandler(async (req, res) => {
  const { title, author, category, price, publishedYear, description, coverUrl, stock } = req.body;

  if (!isDbConnected) {
    const bookIndex = mockBooks.findIndex(b => b._id === req.params.id);
    if (bookIndex !== -1) {
      const book = mockBooks[bookIndex];
      mockBooks[bookIndex] = {
        ...book,
        title: title || book.title,
        author: author || book.author,
        category: category || book.category,
        price: price !== undefined ? Number(price) : book.price,
        publishedYear: publishedYear || book.publishedYear,
        description: description || book.description,
        coverUrl: coverUrl || book.coverUrl,
        stock: stock !== undefined ? Number(stock) : book.stock,
      };
      res.json(mockBooks[bookIndex]);
    } else {
      res.status(404);
      throw new Error('Book not found');
    }
    return;
  }

  const book = await Book.findById(req.params.id);

  if (book) {
    book.title = title || book.title;
    book.author = author || book.author;
    book.category = category || book.category;
    book.price = price !== undefined ? price : book.price;
    book.publishedYear = publishedYear || book.publishedYear;
    book.description = description || book.description;
    book.coverUrl = coverUrl || book.coverUrl;
    book.stock = stock !== undefined ? stock : book.stock;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBook = asyncHandler(async (req, res) => {
  if (!isDbConnected) {
    const bookIndex = mockBooks.findIndex(b => b._id === req.params.id);
    if (bookIndex !== -1) {
      mockBooks.splice(bookIndex, 1);
      res.json({ message: 'Book removed successfully' });
    } else {
      res.status(404);
      throw new Error('Book not found');
    }
    return;
  }

  const book = await Book.findById(req.params.id);

  if (book) {
    await Book.deleteOne({ _id: book._id });
    res.json({ message: 'Book removed successfully' });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});
