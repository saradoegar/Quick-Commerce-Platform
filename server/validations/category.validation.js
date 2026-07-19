const { body, validationResult } = require('express-validator');

const categoryRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 50 })
    .withMessage('Category name cannot exceed 50 characters'),
  body('description')
    .optional()
    .trim(),
  body('image')
    .optional()
    .trim(),
  body('icon')
    .optional()
    .trim(),
  body('displayOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Display order must be a non-negative integer'),
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
  categoryRules,
  validate,
};
