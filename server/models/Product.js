const mongoose = require("mongoose");

// Minimal shared product fields used by the reviews aggregate. Existing product modules can extend this model.
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
}, { timestamps: true });
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
