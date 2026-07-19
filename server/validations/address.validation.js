const { body, validationResult } = require('express-validator');

const addressRules = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('addressLine1')
    .trim()
    .notEmpty()
    .withMessage('Address Line 1 is required'),
  body('addressLine2')
    .optional()
    .trim(),
  body('landmark')
    .optional()
    .trim(),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required'),
  body('country')
    .optional()
    .trim(),
  body('addressType')
    .optional()
    .isIn(['Home', 'Office', 'Hostel', 'Other'])
    .withMessage('Invalid address type'),
  body('isDefault')
    .optional()
    .isBoolean()
    .withMessage('isDefault must be a boolean'),
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
  addressRules,
  validate,
};
