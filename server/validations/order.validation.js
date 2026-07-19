const { body, validationResult } = require('express-validator');

const createOrderRules = [
  body('addressId')
    .trim()
    .notEmpty()
    .withMessage('Shipping address ID is required')
    .isMongoId()
    .withMessage('Invalid shipping address ID format'),
  body('paymentMethod')
    .optional()
    .isIn(['COD', 'Card', 'UPI', 'cod', 'razorpay'])
    .withMessage('Invalid payment method'),
  body('notes')
    .optional()
    .trim(),
];

const updateStatusRules = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Order status is required')
    .isIn(['Pending', 'Confirmed', 'Packed', 'Shipped', 'OutForDelivery', 'Delivered', 'Cancelled', 'placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('note')
    .optional()
    .trim(),
];

const cancelOrderRules = [
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters'),
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
  createOrderRules,
  updateStatusRules,
  cancelOrderRules,
  validate,
};
