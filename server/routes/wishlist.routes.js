const express = require('express');
const {
  getWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
  clearWishlist,
} = require('../controllers/wishlist.controller');
const { protect } = require('../middleware/auth.middleware');
const { wishlistRules, validate } = require('../validations/wishlist.validation');

const router = express.Router();

// All wishlist routes require authentication
router.use(protect);

router.get('/', getWishlist);
router.post('/', wishlistRules, validate, addProductToWishlist);
router.delete('/:productId', removeProductFromWishlist);
router.delete('/', clearWishlist);

module.exports = router;
