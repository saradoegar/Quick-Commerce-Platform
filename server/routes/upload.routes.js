const express = require('express');
const { uploadImage } = require('../controllers/upload.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// Admin-only image upload endpoint
router.post('/image', protect, authorize('admin'), upload.single('image'), uploadImage);

module.exports = router;
