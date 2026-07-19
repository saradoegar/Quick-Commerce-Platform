const { body, validationResult } = require('express-validator');

const productRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Product category association is required')
    .isMongoId()
    .withMessage('Invalid category ID format'),
  body('price')
    .notEmpty()
    .withMessage('Product price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Original price must be a non-negative number'),
  body('discountPercentage')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount percentage must be a number between 0 and 100'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('brand')
    .optional()
    .trim(),
  body('sku')
    .optional()
    .trim(),
  body('unit')
    .optional()
    .trim(),
  body('weight')
    .optional()
    .trim(),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array of strings'),
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured flag must be a boolean value'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive status must be a boolean value'),
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
  productRules,
  validate,
};
