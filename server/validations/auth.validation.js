const { body, validationResult } = require('express-validator');

const registerRules = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .optional()
    .trim()
    .isIn(['customer', 'warehouse_manager', 'delivery_partner', 'admin'])
    .withMessage('Invalid user role specified'),
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Helper middleware checking the results list and returning 400 Bad Request
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => `${err.path}: ${err.msg}`),
    });
  }
  next();
};

module.exports = {
  registerRules,
  loginRules,
  validate,
};
