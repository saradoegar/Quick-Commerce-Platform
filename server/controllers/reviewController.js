const Review = require("../models/Review");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");
const updateProductRating = async (productId) => {
  if (!mongoose.isValidObjectId(productId)) throw httpError(400, "Invalid product id");
  const product = new mongoose.Types.ObjectId(productId);
  const [summary] = await Review.aggregate([{ $match: { product } }, { $group: { _id: "$product", averageRating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } }]);
  await Product.findByIdAndUpdate(productId, summary ? { averageRating: Number(summary.averageRating.toFixed(1)), reviewCount: summary.reviewCount } : { averageRating: 0, reviewCount: 0 });
};
const validateReview = ({ rating, comment }) => { if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw httpError(400, "Rating must be an integer from 1 to 5"); if (typeof comment !== "undefined" && typeof comment !== "string") throw httpError(400, "Comment must be text"); };
const addReview = asyncHandler(async (req, res) => { validateReview(req.body); const review = await Review.create({ product: req.params.productId, user: req.user.id, rating: req.body.rating, comment: req.body.comment }); await updateProductRating(req.params.productId); res.status(201).json({ review }); });
const updateReview = asyncHandler(async (req, res) => { validateReview(req.body); const review = await Review.findOne({ _id: req.params.id, user: req.user.id }); if (!review) throw httpError(404, "Review not found"); review.rating = req.body.rating; if (typeof req.body.comment === "string") review.comment = req.body.comment; await review.save(); await updateProductRating(review.product.toString()); res.json({ review }); });
const deleteReview = asyncHandler(async (req, res) => { const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user.id }); if (!review) throw httpError(404, "Review not found"); await updateProductRating(review.product.toString()); res.status(204).send(); });
const getProductReviews = asyncHandler(async (req, res) => { if (!mongoose.isValidObjectId(req.params.productId)) throw httpError(400, "Invalid product id"); const product = new mongoose.Types.ObjectId(req.params.productId); const reviews = await Review.find({ product }).sort({ createdAt: -1 }); const [summary] = await Review.aggregate([{ $match: { product } }, { $group: { _id: "$product", averageRating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } }]); res.json({ reviews, averageRating: summary ? Number(summary.averageRating.toFixed(1)) : 0, reviewCount: summary?.reviewCount || 0 }); });
module.exports = { addReview, updateReview, deleteReview, getProductReviews };
