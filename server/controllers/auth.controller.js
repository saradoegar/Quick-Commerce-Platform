const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  const { fullName, email, phone, password, role } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user account with this email address already exists.',
        errors: ['email: Email is already registered'],
      });
    }

    // Create the user
    const user = await User.create({
      fullName,
      email,
      phone,
      password,
      role: role || 'customer',
    });

    if (user) {
      const token = generateToken(user);

      // Set cookie token for authorization
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days matching JWT expiration
      });

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user data provided',
        errors: [],
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        errors: ['credentials: Authentication failed'],
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        errors: ['credentials: Authentication failed'],
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'User account has been deactivated.',
        errors: [],
      });
    }

    const token = generateToken(user);

    // Set cookie token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        isVerified: req.user.isVerified,
        isActive: req.user.isActive,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res, next) => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
};
