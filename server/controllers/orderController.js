const Order = require("../models/Order");
const Payment = require("../models/Payment");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");
const validStatuses = ["confirmed", "processing", "shipped", "delivered", "cancelled"];

const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, pricing, paymentMethod = "cod" } = req.body;
  if (!Array.isArray(items) || !items.length) throw httpError(400, "At least one order item is required");
  if (!pricing || !Number.isFinite(pricing.total) || pricing.total < 0) throw httpError(400, "Valid pricing.total is required");
  if (!shippingAddress?.address || !shippingAddress?.postalCode) throw httpError(400, "A complete shipping address is required");
  if (!items.every((item) => item.product && item.name && Number.isFinite(item.price) && item.price >= 0 && Number.isInteger(item.quantity) && item.quantity > 0)) throw httpError(400, "Each item needs product, name, price, and positive quantity");
  const order = await Order.create({ user: req.user.id, items, shippingAddress, pricing, paymentMethod });
  if (paymentMethod === "cod") await Payment.create({ order: order._id, user: req.user.id, provider: "cod", amount: pricing.total });
  res.status(201).json({ order });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("items.product", "name");
  if (!order) throw httpError(404, "Order not found");
  if (order.user.toString() !== req.user.id && req.user.role !== "admin") throw httpError(403, "Not allowed to access this order");
  res.json({ order });
});
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ orders });
});
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = status ? { status } : {};
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const [orders, total] = await Promise.all([Order.find(filter).sort({ createdAt: -1 }).skip((Math.max(Number(page) || 1, 1) - 1) * safeLimit).limit(safeLimit), Order.countDocuments(filter)]);
  res.json({ orders, total, page: Number(page), limit: safeLimit });
});
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note = "" } = req.body;
  if (!validStatuses.includes(status)) throw httpError(400, "Invalid order status");
  const order = await Order.findById(req.params.id);
  if (!order) throw httpError(404, "Order not found");
  order.status = status;
  order.statusHistory.push({ status, note, changedBy: req.user.id });
  await order.save();
  res.json({ order });
});
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
  if (!order) throw httpError(404, "Order not found");
  if (["shipped", "delivered", "cancelled"].includes(order.status)) throw httpError(400, `An order that is ${order.status} cannot be cancelled`);
  order.status = "cancelled"; order.cancelledAt = new Date(); order.cancellationReason = req.body.reason || "Cancelled by customer";
  order.statusHistory.push({ status: "cancelled", note: order.cancellationReason, changedBy: req.user.id });
  await order.save();
  res.json({ order });
});
module.exports = { createOrder, getOrderById, getUserOrders, getAllOrders, updateOrderStatus, cancelOrder };
