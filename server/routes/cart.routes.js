const express = require('express');
const {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');
const {
  cartRules,
  updateQuantityRules,
  validate,
} = require('../validations/cart.validation');

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/', cartRules, validate, addItemToCart);
router.put('/:productId', updateQuantityRules, validate, updateItemQuantity);
router.delete('/:productId', removeItemFromCart);
router.delete('/', clearCart);

module.exports = router;
