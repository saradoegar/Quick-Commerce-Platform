const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { productRules, validate } = require('../validations/product.validation');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only protected routes
router.post('/', protect, authorize('admin'), productRules, validate, createProduct);
router.put('/:id', protect, authorize('admin'), productRules, validate, updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

module.exports = router;
