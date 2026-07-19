const { body, validationResult } = require('express-validator');

const createPaymentRules = [
  body('orderId')
    .trim()
    .notEmpty()
    .withMessage('Order ID is required')
    .isMongoId()
    .withMessage('Invalid order ID format'),
];

const verifyPaymentRules = [
  body('razorpay_order_id')
    .trim()
    .notEmpty()
    .withMessage('Razorpay order ID is required'),
  body('razorpay_payment_id')
    .trim()
    .notEmpty()
    .withMessage('Razorpay payment ID is required'),
  body('razorpay_signature')
    .trim()
    .notEmpty()
    .withMessage('Razorpay signature is required'),
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
  createPaymentRules,
  verifyPaymentRules,
  validate,
};
