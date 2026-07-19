const express = require('express');
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const {
  registerRules,
  loginRules,
  validate,
} = require('../validations/auth.validation');

const router = express.Router();

// Public auth endpoints
router.post('/register', registerRules, validate, registerUser);
router.post('/login', loginRules, validate, loginUser);
router.post('/logout', logoutUser);

// Protected auth endpoints
router.get('/me', protect, getCurrentUser);

module.exports = router;
