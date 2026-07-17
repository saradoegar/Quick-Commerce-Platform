const router = require("express").Router(); const c = require("../controllers/reviewController"); const { protect } = require("../middleware/auth");
router.get("/products/:productId/reviews", c.getProductReviews); router.post("/products/:productId/reviews", protect, c.addReview); router.patch("/reviews/:id", protect, c.updateReview); router.delete("/reviews/:id", protect, c.deleteReview);
module.exports = router;
