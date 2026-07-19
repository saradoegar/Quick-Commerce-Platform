const express = require('express');
const {
  createOrder,
  verifyPayment,
  getPaymentByOrderId,
} = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');
const {
  createPaymentRules,
  verifyPaymentRules,
  validate,
} = require('../validations/payment.validation');

const router = express.Router();

// All payment routes require authentication
router.use(protect);

router.post('/create-order', createPaymentRules, validate, createOrder);
router.post('/verify', verifyPaymentRules, validate, verifyPayment);
router.get('/:orderId', getPaymentByOrderId);

module.exports = router;
