const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDatabase = require("./config/db");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api", reviewRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Quick Commerce API is running" });
});

app.use(notFound);
app.use(errorHandler);

connectDatabase().then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`))).catch((error) => { console.error("Unable to start server:", error.message); process.exit(1); });
