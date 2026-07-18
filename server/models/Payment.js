const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  provider: { type: String, enum: ["razorpay", "cod"], required: true },
  razorpayOrderId: { type: String, sparse: true, index: true },
  razorpayPaymentId: { type: String, sparse: true, index: true },
  razorpaySignature: String,
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: "INR" },
  status: { type: String, enum: ["created", "paid", "failed", "refunded"], default: "created" },
  failureReason: String,
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
