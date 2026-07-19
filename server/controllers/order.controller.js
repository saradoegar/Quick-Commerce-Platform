const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Address = require('../models/Address');
const Payment = require('../models/Payment'); // Reuse Payment model if present

// @desc    Create a new order from user's active cart
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  const { addressId, paymentMethod = 'COD', notes = '' } = req.body;

  try {
    // 1. Validate Shipping Address
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Shipping address not found',
        errors: [`addressId: Address with ID ${addressId} does not exist`],
      });
    }

    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized address access',
        errors: ['address: Address does not belong to this user'],
      });
    }

    // 2. Fetch Active Cart
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
        errors: ['cart: Cannot place an order with an empty cart'],
      });
    }

    // 3. Verify stock availability for all items
    const productsToUpdate = [];
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found during checkout',
          errors: [`product: Product with ID ${item.product} is missing from catalog`],
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Product is no longer active',
          errors: [`product: ${product.name} is currently unavailable for purchase`],
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock available',
          errors: [`stock: Only ${product.stock} units of ${product.name} are available, requested ${item.quantity}`],
        });
      }

      productsToUpdate.push({ product, quantity: item.quantity });
      
      // Store snapshots
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase: product.price,
        // Legacy compatibility
        name: product.name,
        price: product.price,
      });
    }

    // 4. Calculate Subtotal, Tax, Delivery charges
    let subtotal = 0;
    orderItems.forEach((item) => {
      subtotal += item.priceAtPurchase * item.quantity;
    });

    const tax = parseFloat((subtotal * 0.05).toFixed(2)); // 5% GST
    const deliveryCharge = subtotal >= 500 ? 0 : 40; // Free delivery above 500, else 40
    const discount = 0;
    const totalAmount = parseFloat((subtotal + tax + deliveryCharge - discount).toFixed(2));

    // 5. Update catalog stock levels
    for (const update of productsToUpdate) {
      update.product.stock -= update.quantity;
      await update.product.save();
    }

    // 6. Address snapshot creation
    const addressSnapshot = {
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      landmark: address.landmark,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    };

    // 7. Save Order to Database
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress: addressSnapshot,
      subtotal,
      discount,
      deliveryCharge,
      tax,
      totalAmount,
      paymentMethod,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      notes,
    });

    // 8. Create Payment record for tracking
    if (Payment) {
      await Payment.create({
        order: order._id,
        user: req.user._id,
        provider: paymentMethod.toLowerCase(),
        amount: totalAmount,
        status: 'pending',
      }).catch(() => {}); // catch silently in case model is modified/different
    }

    // 9. Clear customer's shopping cart
    cart.items = [];
    cart.recalculateTotals();
    await cart.save();

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders of the authenticated user
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res, next) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      // Admins can see all orders
      const { status, page = 1, limit = 20 } = req.query;
      const filter = status ? { orderStatus: status } : {};
      
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(Math.max(1, parseInt(limit)), 100);
      const skipNum = (pageNum - 1) * limitNum;

      const total = await Order.countDocuments(filter);
      orders = await Order.find(filter)
        .populate('items.product', 'name slug price thumbnail')
        .sort({ createdAt: -1 })
        .skip(skipNum)
        .limit(limitNum)
        .lean();

      return res.status(200).json({
        success: true,
        message: 'All orders fetched successfully',
        data: {
          orders,
          pagination: {
            total,
            pages: Math.ceil(total / limitNum),
            page: pageNum,
            limit: limitNum,
          },
        },
      });
    } else {
      // Normal users see only their own orders
      orders = await Order.find({ user: req.user._id })
        .populate('items.product', 'name slug price thumbnail')
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json({
        success: true,
        message: 'Your orders fetched successfully',
        data: orders,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate('items.product', 'name slug price thumbnail brand');
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        errors: [`id: Order with ID ${id} does not exist`],
      });
    }

    // Ownership check (Admins bypass)
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        errors: ['user: You do not have permission to view this order'],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order details fetched successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel an order (Customer)
// @route   PATCH /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  const { id } = req.params;
  const { reason = 'Cancelled by customer' } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        errors: [`id: Order with ID ${id} does not exist`],
      });
    }

    // Verify ownership
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
        errors: ['user: You do not have permission to cancel this order'],
      });
    }

    // Verify eligibility (Only Pending or Confirmed orders can be cancelled)
    const allowedStatuses = ['Pending', 'Confirmed', 'placed', 'confirmed'];
    if (!allowedStatuses.includes(order.orderStatus) && !allowedStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled',
        errors: [`status: Orders in status ${order.orderStatus || order.status} cannot be cancelled`],
      });
    }

    // Transition status
    order.orderStatus = 'Cancelled';
    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason;

    order.statusHistory.push({
      status: 'Cancelled',
      note: reason,
      changedBy: req.user._id,
    });

    // Restore stock levels back to catalog
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status, note = '' } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        errors: [`id: Order with ID ${id} does not exist`],
      });
    }

    // Capitalize status parameter to match modern enum values if necessary
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    
    order.orderStatus = formattedStatus;
    // Pre-validate hook automatically updates this.status

    order.statusHistory.push({
      status: formattedStatus,
      note: note || `Status updated to ${formattedStatus}`,
      changedBy: req.user._id,
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
};
