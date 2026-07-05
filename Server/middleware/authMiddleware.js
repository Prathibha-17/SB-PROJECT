import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { mockUsers } from '../database/mockDb.js';

// Protect private routes via JWT verification
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Handle mock token for DB offline fallback
      if (token.startsWith('mock-jwt-token-for-')) {
        const userId = token.replace('mock-jwt-token-for-', '');
        const mockUser = mockUsers.find(u => u._id === userId);
        if (mockUser) {
          const { password: _, ...userWithoutPassword } = mockUser;
          req.user = userWithoutPassword;
          next();
          return;
        } else {
          res.status(401);
          throw new Error('Not authorized, mock user not found');
        }
      }

      // Verify real token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bookstore_super_secret_jwt_key_2026');

      if (!isDbConnected) {
        // DB went down after generating real token
        const mockUser = mockUsers.find(u => u._id === decoded.id);
        if (mockUser) {
          const { password: _, ...userWithoutPassword } = mockUser;
          req.user = userWithoutPassword;
          next();
          return;
        }
      }

      // Get user from the token, omit password field
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin role check guard middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};
