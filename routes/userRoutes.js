const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// ✅ SIGNUP - POST /api/v1/user/signup
router.post(
  '/signup',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
      }

      const { username, email, password } = req.body;

      // check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ status: false, message: 'User already exists' });
      }

      // hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        username,
        email,
        password: hashedPassword
      });

      await user.save();

      res.status(201).json({
        message: 'User created successfully.',
        user_id: user._id
      });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }
);

// ✅ LOGIN - POST /api/v1/user/login
router.post(
  '/login',
  [
    body('email').notEmpty().withMessage('Email or username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ status: false, errors: errors.array() });
      }

      const { email, password } = req.body;

      // login can be by email OR username
      const user = await User.findOne({ $or: [{ email }, { username: email }] });
      if (!user) {
        return res.status(400).json({ status: false, message: 'Invalid Username and password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ status: false, message: 'Invalid Username and password' });
      }

      res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  }
);

module.exports = router;
