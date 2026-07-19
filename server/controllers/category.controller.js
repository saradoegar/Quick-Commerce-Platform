const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    // Only return active categories by default for public, return all if specified
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const categories = await Category.find(filter).sort({ displayOrder: 1, name: 1 }).lean();

    return res.status(200).json({
      success: true,
      message: 'Categories fetched successfully',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id).lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
        errors: [`id: Category with ID ${id} does not exist`],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category details fetched successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  const { name, description, image, icon, displayOrder, isActive } = req.body;

  try {
    // Check if name is duplicate
    const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'Category name already exists',
        errors: ['name: Category name must be unique'],
      });
    }

    const category = await Category.create({
      name,
      description,
      image,
      icon,
      displayOrder,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, image, icon, displayOrder, isActive } = req.body;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
        errors: [`id: Category with ID ${id} does not exist`],
      });
    }

    if (name && name !== category.name) {
      // Check if name is duplicate
      const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'Category name already exists',
          errors: ['name: Category name must be unique'],
        });
      }
      category.name = name;
    }

    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (icon !== undefined) category.icon = icon;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
        errors: [`id: Category with ID ${id} does not exist`],
      });
    }

    // Prevent deletion if products are linked
    const linkedProducts = await Product.countDocuments({ category: id });
    if (linkedProducts > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category containing active products',
        errors: [`category: Category is associated with ${linkedProducts} products. Move or delete them first.`],
      });
    }

    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
