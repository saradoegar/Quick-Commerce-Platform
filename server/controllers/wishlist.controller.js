const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get current user's wishlist (auto-creates if missing)
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
      'products',
      'name slug price thumbnail stock originalPrice brand averageRating'
    );

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    return res.status(200).json({
      success: true,
      message: 'Wishlist fetched successfully',
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a product to user's wishlist
// @route   POST /api/wishlist
// @access  Private
const addProductToWishlist = async (req, res, next) => {
  const { productId } = req.body;

  try {
    // Check if product exists in catalog
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        errors: [`productId: Product with ID ${productId} does not exist`],
      });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    // Prevent duplicate entries
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    // Populate and return
    await wishlist.populate(
      'products',
      'name slug price thumbnail stock originalPrice brand averageRating'
    );

    return res.status(200).json({
      success: true,
      message: 'Product added to wishlist successfully',
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a product from user's wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeProductFromWishlist = async (req, res, next) => {
  const { productId } = req.params;

  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }

    wishlist.products.pull(productId);
    await wishlist.save();

    await wishlist.populate(
      'products',
      'name slug price thumbnail stock originalPrice brand averageRating'
    );

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist successfully',
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear user's wishlist
// @route   DELETE /api/wishlist
// @access  Private
const clearWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    } else {
      wishlist.products = [];
      await wishlist.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully',
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addProductToWishlist,
  removeProductFromWishlist,
  clearWishlist,
};
