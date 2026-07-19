const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { notFound, errorHandler } = require('./middleware/error.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const cartRoutes = require('./routes/cart.routes');
const addressRoutes = require('./routes/address.routes');
const orderRoutes = require('./routes/order.routes');
const uploadRoutes = require('./routes/upload.routes');
const paymentRoutes = require('./routes/payment.routes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Security and utility middleware configuration
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Quick Commerce API is running',
  });
});

// Detailed health status endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Quick Commerce API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    status: 'UP',
  });
});

// API Routes routing
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api', reviewRoutes);

// Global Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;
