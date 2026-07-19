const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Retrieve token from Authorization header or from request cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this resource. No token provided.',
      errors: [],
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'replace_with_a_long_random_secret');
    
    // Retrieve actual user model from the database, excluding password hashes
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. User account does not exist.',
        errors: [],
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized. User account is deactivated.',
        errors: [],
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Token verification failed.',
      errors: [error.message],
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user?.role || 'unknown'}' is not authorized to access this resource`,
        errors: [],
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
