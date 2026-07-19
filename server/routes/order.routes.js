const express = require('express');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
} = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  createOrderRules,
  updateStatusRules,
  cancelOrderRules,
  validate,
} = require('../validations/order.validation');

const router = express.Router();

// All order routes require authentication
router.use(protect);

router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.post('/', createOrderRules, validate, createOrder);
router.patch('/:id/cancel', cancelOrderRules, validate, cancelOrder);

// Admin status manager
router.patch('/:id/status', authorize('admin'), updateStatusRules, validate, updateOrderStatus);

module.exports = router;
