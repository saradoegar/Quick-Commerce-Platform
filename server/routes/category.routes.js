const express = require('express');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { categoryRules, validate } = require('../validations/category.validation');

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin-only protected routes
router.post('/', protect, authorize('admin'), categoryRules, validate, createCategory);
router.put('/:id', protect, authorize('admin'), categoryRules, validate, updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;
