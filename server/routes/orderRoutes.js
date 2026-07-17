const router = require("express").Router(); const c = require("../controllers/orderController"); const { protect, adminOnly } = require("../middleware/auth");
router.post("/", protect, c.createOrder); router.get("/my", protect, c.getUserOrders); router.get("/", protect, adminOnly, c.getAllOrders); router.get("/:id", protect, c.getOrderById); router.patch("/:id/status", protect, adminOnly, c.updateOrderStatus); router.post("/:id/cancel", protect, c.cancelOrder);
module.exports = router;
