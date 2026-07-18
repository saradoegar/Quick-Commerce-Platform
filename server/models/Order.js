const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true, trim: true },
  image: String,
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
}, { _id: false });

const historySchema = new mongoose.Schema({
  status: { type: String, required: true },
  note: { type: String, trim: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  changedAt: { type: Date, default: Date.now },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  items: { type: [orderItemSchema], required: true, validate: (items) => items.length > 0 },
  shippingAddress: { name: String, phone: String, address: String, city: String, state: String, postalCode: String },
  pricing: { subtotal: { type: Number, required: true, min: 0 }, deliveryCharge: { type: Number, default: 0, min: 0 }, tax: { type: Number, default: 0, min: 0 }, discount: { type: Number, default: 0, min: 0 }, total: { type: Number, required: true, min: 0 } },
  paymentMethod: { type: String, enum: ["cod", "razorpay"], default: "cod" },
  paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  status: { type: String, enum: ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled"], default: "placed", index: true },
  statusHistory: [historySchema],
  cancelledAt: Date,
  cancellationReason: { type: String, trim: true, maxlength: 500 },
}, { timestamps: true });

orderSchema.pre("validate", function initialiseHistory(next) {
  if (this.isNew && this.statusHistory.length === 0) this.statusHistory.push({ status: this.status, note: "Order created" });
  next();
});

module.exports = mongoose.model("Order", orderSchema);
