const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Upload an image to Cloudinary (Admin only)
// @route   POST /api/upload/image
// @access  Private/Admin
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
        errors: ['file: An image file is required'],
      });
    }

    // Verify Cloudinary configuration
    if (!cloudinary.config().cloud_name) {
      // Cleanup local temp file first
      fs.unlinkSync(req.file.path);
      return res.status(503).json({
        success: false,
        message: 'Cloudinary upload service is unconfigured',
        errors: ['service: Cloudinary credentials missing'],
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'quick-commerce/products',
    });

    // Delete temporary file
    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        secure_url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    // Delete file if upload crashed
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (err) {
        // ignore
      }
    }
    next(error);
  }
};

module.exports = {
  uploadImage,
};
