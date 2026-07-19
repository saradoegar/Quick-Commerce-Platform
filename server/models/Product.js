const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    shortDescription: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please associate this product with a category'],
      index: true,
    },
    brand: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
      min: [0, 'Price must be non-negative'],
    },
    originalPrice: {
      type: Number,
      min: [0, 'Original price must be non-negative'],
    },
    discountPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Discount must be non-negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    images: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5'],
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: [0, 'Reviews count cannot be negative'],
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: [0, 'Reviews count cannot be negative'],
    },
    unit: {
      type: String,
      default: 'pcs',
    },
    weight: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Slug auto-generation middleware hook
ProductSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

// Text Search Indexes
ProductSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text',
  tags: 'text',
});

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
