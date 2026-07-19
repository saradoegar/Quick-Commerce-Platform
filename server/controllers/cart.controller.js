const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to populate and format cart return response
const getPopulatedCartResponse = async (cart) => {
  return await cart.populate({
    path: 'items.product',
    select: 'name slug price thumbnail stock originalPrice brand unit weight',
  });
};

// @desc    Get current user's cart (auto-creates if missing)
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const populatedCart = await getPopulatedCartResponse(cart);

    return res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      data: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add an item to the user's cart
// @route   POST /api/cart
// @access  Private
const addItemToCart = async (req, res, next) => {
  const { productId, quantity = 1 } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        errors: [`productId: Product with ID ${productId} does not exist`],
      });
    }

    // Validate catalog stock
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock available',
        errors: [`stock: Only ${product.stock} units of ${product.name} are available`],
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      // Validate stock for combined quantity
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock available for total quantity',
          errors: [`stock: Cannot add more items. Total requested ${newQuantity} exceeds stock of ${product.stock} units`],
        });
      }

      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].priceAtAddition = product.price; // Update to latest price
    } else {
      // Push new item
      cart.items.push({
        product: productId,
        quantity,
        priceAtAddition: product.price,
      });
    }

    cart.recalculateTotals();
    await cart.save();

    const populatedCart = await getPopulatedCartResponse(cart);

    return res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
const updateItemQuantity = async (req, res, next) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
        errors: ['cart: User cart does not exist'],
      });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
        errors: [`productId: Product with ID ${productId} is not in your cart`],
      });
    }

    // If quantity is 0, remove the item
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      // Verify product stock level
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
          errors: [`productId: Product with ID ${productId} does not exist in catalog`],
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock available',
          errors: [`stock: Only ${product.stock} units of ${product.name} are available`],
        });
      }

      cart.items[itemIndex].quantity = quantity;
      cart.items[itemIndex].priceAtAddition = product.price; // Update to latest price
    }

    cart.recalculateTotals();
    await cart.save();

    const populatedCart = await getPopulatedCartResponse(cart);

    return res.status(200).json({
      success: true,
      message: 'Cart item quantity updated successfully',
      data: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an item from the user's cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeItemFromCart = async (req, res, next) => {
  const { productId } = req.params;

  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
        errors: ['cart: User cart does not exist'],
      });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    cart.recalculateTotals();
    await cart.save();

    const populatedCart = await getPopulatedCartResponse(cart);

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: populatedCart,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear all items in the user's cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    } else {
      cart.items = [];
      cart.recalculateTotals();
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
};
