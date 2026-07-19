const { body, validationResult } = require('express-validator');

const cartRules = [
  body('productId')
    .trim()
    .notEmpty()
    .withMessage('Product ID is required')
    .isMongoId()
    .withMessage('Invalid product ID format'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be an integer of at least 1'),
];

const updateQuantityRules = [
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
];

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
  cartRules,
  updateQuantityRules,
  validate,
};
