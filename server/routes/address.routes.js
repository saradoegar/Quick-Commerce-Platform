const express = require('express');
const {
  getAddresses,
  getAddressById,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require('../controllers/address.controller');
const { protect } = require('../middleware/auth.middleware');
const { addressRules, validate } = require('../validations/address.validation');

const router = express.Router();

// All address routes require authentication
router.use(protect);

router.get('/', getAddresses);
router.post('/', addressRules, validate, addAddress);

router.get('/:id', getAddressById);
router.put('/:id', addressRules, validate, updateAddress);
router.delete('/:id', deleteAddress);
router.patch('/:id/default', setDefaultAddress);

module.exports = router;
