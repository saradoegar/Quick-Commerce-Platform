const crypto = require('crypto');
const razorpayInstance = require('../config/razorpay');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

// @desc    Create a Razorpay order for checkout payment
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res, next) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        errors: [`orderId: Order with ID ${orderId} does not exist`],
      });
    }

    // Ownership check
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
        errors: ['user: You do not own this order'],
      });
    }

    if (order.orderStatus === 'Cancelled' || order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot pay for a cancelled order',
        errors: ['order: Order is cancelled'],
      });
    }

    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({
        success: false,
        message: 'Order is already paid',
        errors: ['order: Payment has already been completed'],
      });
    }

    // Verify Razorpay configuration
    if (!razorpayInstance) {
      return res.status(503).json({
        success: false,
        message: 'Razorpay payment gateway is unconfigured',
        errors: ['service: Razorpay key credentials missing'],
      });
    }

    // Create Razorpay order (amount in paise)
    const amountInPaise = Math.round(order.totalAmount * 100);
    const gatewayOrder = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order._id.toString(),
    });

    // Update or create payment tracking record
    const payment = await Payment.findOneAndUpdate(
      { order: order._id },
      {
        user: req.user._id,
        provider: 'razorpay',
        razorpayOrderId: gatewayOrder.id,
        amount: order.totalAmount,
        currency: gatewayOrder.currency,
        status: 'created',
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(201).json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        orderId: gatewayOrder.id,
        amount: gatewayOrder.amount,
        currency: gatewayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
        payment,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify signature and complete payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    // 1. Signature check
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment signature verification failed',
        errors: ['signature: Invalid Razorpay cryptographic signature'],
      });
    }

    // 2. Fetch payment record
    const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found',
        errors: [`razorpay_order_id: No payment record tracks order ${razorpay_order_id}`],
      });
    }

    // Prevent duplicate verification
    if (payment.status === 'paid') {
      return res.status(200).json({
        success: true,
        message: 'Payment already verified',
        data: { payment },
      });
    }

    // 3. Mark payment paid
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = 'paid';
    await payment.save();

    // 4. Mark Order paid
    const order = await Order.findById(payment.order);
    if (order) {
      order.paymentStatus = 'Paid';
      order.paymentMethod = 'UPI'; // Update to online method
      await order.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        payment,
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment tracking details for an Order
// @route   GET /api/payments/:orderId
// @access  Private
const getPaymentByOrderId = async (req, res, next) => {
  const { orderId } = req.params;

  try {
    const payment = await Payment.findOne({ order: orderId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'No payment record found for this order',
        errors: [`orderId: No payment details found for Order ID ${orderId}`],
      });
    }

    // Ownership check (Admin bypasses)
    if (payment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access',
        errors: ['user: Access denied to view this payment details'],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Payment details retrieved successfully',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentByOrderId,
};
