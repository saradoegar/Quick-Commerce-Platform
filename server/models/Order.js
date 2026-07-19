const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  priceAtPurchase: { type: Number, required: true, min: 0 },
  // Legacy compatibility fields
  name: { type: String },
  price: { type: Number },
}, { _id: false });

const historySchema = new mongoose.Schema({
  status: { type: String, required: true },
  note: { type: String, trim: true },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  changedAt: { type: Date, default: Date.now },
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String, default: '' },
  landmark: { type: String, default: '' },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [orderItemSchema], required: true, validate: (items) => items.length > 0 },
    shippingAddress: { type: shippingAddressSchema, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    deliveryCharge: { type: Number, default: 0, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ['COD', 'Card', 'UPI', 'cod', 'razorpay'], default: 'COD' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'pending', 'paid', 'failed', 'refunded'], default: 'Pending' },
    orderStatus: { type: String, enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'OutForDelivery', 'Delivered', 'Cancelled'], default: 'Pending', index: true },
    notes: { type: String, default: '' },
    estimatedDelivery: { type: Date },

    // Compatibility fields
    pricing: {
      subtotal: { type: Number },
      deliveryCharge: { type: Number },
      tax: { type: Number },
      discount: { type: Number },
      total: { type: Number },
    },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'OutForDelivery', 'Delivered', 'Cancelled'],
      default: 'placed',
      index: true,
    },
    statusHistory: [historySchema],
    cancelledAt: Date,
    cancellationReason: { type: String, trim: true, maxlength: 500 },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook to sync all fields between legacy and new definitions
orderSchema.pre('validate', function () {
  // Sync status
  if (this.isModified('orderStatus')) {
    const statusMap = {
      Pending: 'placed',
      Confirmed: 'confirmed',
      Packed: 'processing',
      Shipped: 'shipped',
      OutForDelivery: 'shipped',
      Delivered: 'delivered',
      Cancelled: 'cancelled',
    };
    this.status = statusMap[this.orderStatus] || 'placed';
  } else if (this.isModified('status')) {
    const statusMap = {
      placed: 'Pending',
      confirmed: 'Confirmed',
      processing: 'Packed',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    this.orderStatus = statusMap[this.status] || 'Pending';
  }

  // Sync pricing
  if (this.isModified('subtotal') || this.isModified('totalAmount')) {
    this.pricing = {
      subtotal: this.subtotal,
      deliveryCharge: this.deliveryCharge,
      tax: this.tax,
      discount: this.discount,
      total: this.totalAmount,
    };
  } else if (this.pricing && (this.pricing.subtotal || this.pricing.total)) {
    this.subtotal = this.pricing.subtotal;
    this.deliveryCharge = this.pricing.deliveryCharge || 0;
    this.tax = this.pricing.tax || 0;
    this.discount = this.pricing.discount || 0;
    this.totalAmount = this.pricing.total;
  }

  // Set default history
  if (this.isNew && this.statusHistory.length === 0) {
    this.statusHistory.push({
      status: this.status || 'placed',
      note: 'Order created',
    });
  }
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
