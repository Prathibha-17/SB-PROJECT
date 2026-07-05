import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { isDbConnected } from '../config/db.js';
import { mockUsers } from '../database/mockDb.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  if (!isDbConnected) {
    const usersWithoutPassword = mockUsers.map(u => {
      const { password: _, ...rest } = u;
      return rest;
    });
    res.json(usersWithoutPassword);
    return;
  }

  const users = await User.find({}).select('-password');
  res.json(users);
});
