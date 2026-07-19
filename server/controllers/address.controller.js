const Address = require('../models/Address');

// @desc    Get all addresses for authenticated user
// @route   GET /api/addresses
// @access  Private
const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 }).lean();
    return res.status(200).json({
      success: true,
      message: 'Addresses fetched successfully',
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single address by ID
// @route   GET /api/addresses/:id
// @access  Private
const getAddressById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const address = await Address.findById(id).lean();
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
        errors: [`id: Address with ID ${id} does not exist`],
      });
    }
    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this address',
        errors: ['user: Access denied'],
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Address details fetched successfully',
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new address
// @route   POST /api/addresses
// @access  Private
const addAddress = async (req, res, next) => {
  const { fullName, phone, addressLine1, addressLine2, landmark, city, state, postalCode, country, addressType, isDefault } = req.body;
  try {
    const count = await Address.countDocuments({ user: req.user._id });
    const setDefault = count === 0 ? true : !!isDefault;

    const address = await Address.create({
      user: req.user._id,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      landmark,
      city,
      state,
      postalCode,
      country,
      addressType,
      isDefault: setDefault,
    });

    return res.status(201).json({
      success: true,
      message: 'Address created successfully',
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = async (req, res, next) => {
  const { id } = req.params;
  const { fullName, phone, addressLine1, addressLine2, landmark, city, state, postalCode, country, addressType, isDefault } = req.body;
  try {
    const address = await Address.findById(id);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
        errors: [`id: Address with ID ${id} does not exist`],
      });
    }
    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this address',
        errors: ['user: Access denied'],
      });
    }

    if (fullName !== undefined) address.fullName = fullName;
    if (phone !== undefined) address.phone = phone;
    if (addressLine1 !== undefined) address.addressLine1 = addressLine1;
    if (addressLine2 !== undefined) address.addressLine2 = addressLine2;
    if (landmark !== undefined) address.landmark = landmark;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (postalCode !== undefined) address.postalCode = postalCode;
    if (country !== undefined) address.country = country;
    if (addressType !== undefined) address.addressType = addressType;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    return res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = async (req, res, next) => {
  const { id } = req.params;
  try {
    const address = await Address.findById(id);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
        errors: [`id: Address with ID ${id} does not exist`],
      });
    }
    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this address',
        errors: ['user: Access denied'],
      });
    }

    const wasDefault = address.isDefault;
    await Address.findByIdAndDelete(id);

    if (wasDefault) {
      const nextDefault = await Address.findOne({ user: req.user._id }).sort({ createdAt: -1 });
      if (nextDefault) {
        nextDefault.isDefault = true;
        await nextDefault.save();
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set an address as default
// @route   PATCH /api/addresses/:id/default
// @access  Private
const setDefaultAddress = async (req, res, next) => {
  const { id } = req.params;
  try {
    const address = await Address.findById(id);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
        errors: [`id: Address with ID ${id} does not exist`],
      });
    }
    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this address',
        errors: ['user: Access denied'],
      });
    }

    address.isDefault = true;
    await address.save();

    return res.status(200).json({
      success: true,
      message: 'Default address updated successfully',
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAddresses,
  getAddressById,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
