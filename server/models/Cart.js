const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Cart item must refer to a product'],
    index: true,
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    default: 1,
  },
  priceAtAddition: {
    type: Number,
    required: [true, 'Price at addition is required'],
    min: [0, 'Price must be non-negative'],
  },
});

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Cart must be associated with a user'],
      unique: true,
      index: true,
    },
    items: [CartItemSchema],
    subtotal: {
      type: Number,
      default: 0,
      min: [0, 'Subtotal cannot be negative'],
    },
    totalItems: {
      type: Number,
      default: 0,
      min: [0, 'Total items cannot be negative'],
    },
    totalPrice: {
      type: Number,
      default: 0,
      min: [0, 'Total price cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Recalculates cart totals based on items array
CartSchema.methods.recalculateTotals = function () {
  let subtotal = 0;
  let totalItems = 0;

  this.items.forEach((item) => {
    subtotal += item.priceAtAddition * item.quantity;
    totalItems += item.quantity;
  });

  // Format numbers to prevent floating point issues in JS
  this.subtotal = parseFloat(subtotal.toFixed(2));
  this.totalItems = totalItems;
  this.totalPrice = this.subtotal; // Matches subtotal unless tax/shipping is added
};

module.exports = mongoose.model('Cart', CartSchema);
