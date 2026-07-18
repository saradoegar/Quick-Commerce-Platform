const crypto = require("crypto");
const Razorpay = require("razorpay");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");
const razorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) throw httpError(503, "Razorpay is not configured");
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
};
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.body.orderId, user: req.user.id });
  if (!order) throw httpError(404, "Order not found");
  if (order.status === "cancelled") throw httpError(400, "Cannot pay for a cancelled order");
  if (order.paymentStatus === "paid") throw httpError(400, "Order is already paid");
  const gatewayOrder = await razorpay().orders.create({ amount: Math.round(order.pricing.total * 100), currency: "INR", receipt: order._id.toString() });
  const payment = await Payment.findOneAndUpdate({ order: order._id }, { user: req.user.id, provider: "razorpay", razorpayOrderId: gatewayOrder.id, amount: order.pricing.total, currency: gatewayOrder.currency, status: "created" }, { new: true, upsert: true, runValidators: true });
  res.status(201).json({ razorpayOrder: { id: gatewayOrder.id, amount: gatewayOrder.amount, currency: gatewayOrder.currency }, keyId: process.env.RAZORPAY_KEY_ID, payment });
});
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) throw httpError(400, "Razorpay payment details are required");
  if (!/^[a-f0-9]{64}$/i.test(razorpay_signature)) throw httpError(400, "Invalid payment signature");
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "").update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature))) throw httpError(400, "Payment signature verification failed");
  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id, user: req.user.id });
  if (!payment) throw httpError(404, "Payment record not found");
  payment.razorpayPaymentId = razorpay_payment_id; payment.razorpaySignature = razorpay_signature; payment.status = "paid"; await payment.save();
  const order = await Order.findByIdAndUpdate(payment.order, { paymentStatus: "paid" }, { new: true });
  res.json({ message: "Payment verified", order, payment });
});
const markPaymentFailed = asyncHandler(async (req, res) => {
  const payment = await Payment.findOne({ razorpayOrderId: req.body.razorpayOrderId, user: req.user.id });
  if (!payment) throw httpError(404, "Payment record not found");
  payment.status = "failed"; payment.failureReason = req.body.reason || "Payment failed"; await payment.save();
  const order = await Order.findByIdAndUpdate(payment.order, { paymentStatus: "failed" }, { new: true });
  res.json({ order, payment });
});
module.exports = { createRazorpayOrder, verifyRazorpayPayment, markPaymentFailed };
