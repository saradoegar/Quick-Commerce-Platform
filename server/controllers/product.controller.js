const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products with pagination, search, sorting & filtering
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      rating,
      featured,
      inStock,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { isActive: true };

    // 1. Category Filter: supports either Category ID or Category Slug
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) {
          query.category = cat._id;
        } else {
          // If slug category is not found, return empty set immediately
          return res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: {
              products: [],
              pagination: {
                total: 0,
                pages: 0,
                page: Number(page),
                limit: Number(limit),
              },
            },
          });
        }
      }
    }

    // 2. Brand Filter
    if (brand) {
      query.brand = { $regex: new RegExp(`^${brand.trim()}$`, 'i') };
    }

    // 3. Price Filter (minPrice and maxPrice)
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 4. Rating Filter
    if (rating) {
      query.averageRating = { $gte: Number(rating) };
    }

    // 5. Featured Filter
    if (featured === 'true') {
      query.featured = true;
    }

    // 6. Stock availability filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // 7. Text/Substring search across multiple text fields
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { tags: { $in: [searchRegex] } },
      ];
    }

    // 8. Sorting definitions
    let sortObj = { createdAt: -1 }; // newest by default
    if (sort) {
      switch (sort) {
        case 'oldest':
          sortObj = { createdAt: 1 };
          break;
        case 'priceLowToHigh':
          sortObj = { price: 1 };
          break;
        case 'priceHighToLow':
          sortObj = { price: -1 };
          break;
        case 'rating':
          sortObj = { averageRating: -1 };
          break;
        case 'popularity':
          sortObj = { reviewCount: -1 };
          break;
        case 'newest':
        default:
          sortObj = { createdAt: -1 };
          break;
      }
    }

    // 9. Pagination Setup
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, parseInt(limit));
    const skipNum = (pageNum - 1) * limitNum;

    // Get count and products
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug icon image')
      .sort(sortObj)
      .skip(skipNum)
      .limit(limitNum)
      .lean();

    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: {
        products,
        pagination: {
          total,
          pages: Math.ceil(total / limitNum),
          page: pageNum,
          limit: limitNum,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate('category', 'name slug icon image').lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        errors: [`id: Product with ID ${id} does not exist`],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product details fetched successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  const {
    name,
    description,
    shortDescription,
    category,
    brand,
    price,
    originalPrice,
    discountPercentage,
    images,
    thumbnail,
    stock,
    sku,
    unit,
    weight,
    tags,
    featured,
    isActive,
  } = req.body;

  try {
    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category association',
        errors: [`category: Category with ID ${category} does not exist`],
      });
    }

    const product = await Product.create({
      name,
      description,
      shortDescription,
      category,
      brand,
      price,
      originalPrice,
      discountPercentage,
      images,
      thumbnail,
      stock,
      sku,
      unit,
      weight,
      tags,
      featured,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    description,
    shortDescription,
    category,
    brand,
    price,
    originalPrice,
    discountPercentage,
    images,
    thumbnail,
    stock,
    sku,
    unit,
    weight,
    tags,
    featured,
    isActive,
  } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        errors: [`id: Product with ID ${id} does not exist`],
      });
    }

    // Verify category if changed
    if (category && category !== product.category.toString()) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category association',
          errors: [`category: Category with ID ${category} does not exist`],
        });
      }
      product.category = category;
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (brand !== undefined) product.brand = brand;
    if (price !== undefined) product.price = price;
    if (originalPrice !== undefined) product.originalPrice = originalPrice;
    if (discountPercentage !== undefined) product.discountPercentage = discountPercentage;
    if (images !== undefined) product.images = images;
    if (thumbnail !== undefined) product.thumbnail = thumbnail;
    if (stock !== undefined) product.stock = stock;
    if (sku !== undefined) product.sku = sku;
    if (unit !== undefined) product.unit = unit;
    if (weight !== undefined) product.weight = weight;
    if (tags !== undefined) product.tags = tags;
    if (featured !== undefined) product.featured = featured;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
        errors: [`id: Product with ID ${id} does not exist`],
      });
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
