const router = require("express").Router(); const c = require("../controllers/paymentController"); const { protect } = require("../middleware/auth");
router.post("/razorpay/order", protect, c.createRazorpayOrder); router.post("/razorpay/verify", protect, c.verifyRazorpayPayment); router.post("/razorpay/failure", protect, c.markPaymentFailed);
module.exports = router;
