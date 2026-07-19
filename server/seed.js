require('dotenv').config()
const mongoose = require('mongoose')
const Category = require('./models/Category')
const Product = require('./models/Product')

const categoriesData = [
  {
    name: 'Fruits & Veggies',
    description: 'Fresh picks for daily meals',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=360&q=80',
    icon: 'user',
    displayOrder: 1
  },
  {
    name: 'Dairy & Breakfast',
    description: 'Milk, curd, eggs, and breads',
    image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=360&q=80',
    icon: 'home',
    displayOrder: 2
  },
  {
    name: 'Snacks & Drinks',
    description: 'Tea-time bites and beverages',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=360&q=80',
    icon: 'truck',
    displayOrder: 3
  },
  {
    name: 'Home Essentials',
    description: 'Cleaning, personal care, and more',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=360&q=80',
    icon: 'user',
    displayOrder: 4
  }
]

const productsData = [
  // Dairy & Breakfast
  {
    name: 'Amul Taaza Milk',
    description: 'Fresh and pure pasteurized toned milk, perfect for tea, coffee, and daily breakfast.',
    price: 28,
    originalPrice: 30,
    discountPercentage: 6.6,
    thumbnail: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=360&q=80',
    images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=360&q=80'],
    stock: 120,
    brand: 'Amul',
    unit: 'ml',
    weight: '500 ml',
    featured: true,
    tags: ['milk', 'dairy', 'breakfast', 'amul']
  },
  {
    name: 'Farm Fresh Brown Eggs',
    description: 'Premium quality farm-fresh brown eggs rich in proteins and essential vitamins.',
    price: 90,
    originalPrice: 100,
    discountPercentage: 10,
    thumbnail: 'https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=360&q=80',
    images: ['https://images.unsplash.com/photo-1516448620398-c5f44bf9f441?auto=format&fit=crop&w=360&q=80'],
    stock: 50,
    brand: 'FarmPicks',
    unit: 'pcs',
    weight: '6 pieces',
    featured: true,
    tags: ['eggs', 'dairy', 'breakfast', 'proteins']
  },

  // Fruits & Veggies
  {
    name: 'Banana Robusta',
    description: 'Sweet, energy-rich, and handpicked robusta bananas directly from local orchards.',
    price: 48,
    originalPrice: 60,
    discountPercentage: 20,
    thumbnail: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=360&q=80',
    images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=360&q=80'],
    stock: 80,
    brand: 'FreshFruits',
    unit: 'pcs',
    weight: '6 pieces',
    featured: true,
    tags: ['banana', 'fruits', 'veggies', 'organic']
  },
  {
    name: 'Fresh Red Tomatoes',
    description: 'Local farm-grown red tomatoes, juicy and perfect for making purees, curries, or fresh salads.',
    price: 30,
    originalPrice: 40,
    discountPercentage: 25,
    thumbnail: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=360&q=80',
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=360&q=80'],
    stock: 150,
    brand: 'LocalFarms',
    unit: 'g',
    weight: '500 g',
    featured: true,
    tags: ['tomato', 'vegetables', 'veggies', 'cooking']
  },

  // Snacks & Drinks
  {
    name: 'Classic Potato Chips',
    description: 'Crispy salted classic potato chips, the perfect munching snack for tea-time.',
    price: 20,
    originalPrice: 20,
    discountPercentage: 0,
    thumbnail: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=360&q=80',
    images: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=360&q=80'],
    stock: 200,
    brand: 'SnackCo',
    unit: 'g',
    weight: '50 g',
    featured: true,
    tags: ['chips', 'snacks', 'munchies', 'potato']
  },

  // Home Essentials
  {
    name: 'Surf Excel Liquid Detergent',
    description: 'Premium liquid detergent designed for clean and bright clothes with a fresh fragrance.',
    price: 199,
    originalPrice: 240,
    discountPercentage: 17,
    thumbnail: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=360&q=80',
    images: ['https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=360&q=80'],
    stock: 40,
    brand: 'Surf Excel',
    unit: 'litre',
    weight: '1 litre',
    featured: true,
    tags: ['laundry', 'detergent', 'cleaning', 'home']
  }
]

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI
    if (!mongoUri) {
      console.error('MONGODB_URI is not defined in environment!')
      process.exit(1)
    }

    console.log('Connecting to database...')
    await mongoose.connect(mongoUri)
    console.log('Connected successfully.')

    console.log('Clearing existing categories and products...')
    await Category.deleteMany({})
    await Product.deleteMany({})
    console.log('Database cleared.')

    console.log('Seeding categories...')
    const createdCategories = await Category.create(categoriesData)
    console.log(`Seeded ${createdCategories.length} categories successfully.`)

    // Map products to their categories
    const categoryMap = {}
    createdCategories.forEach(cat => {
      // Handle different naming conventions/matches
      if (cat.name.includes('Fruits')) categoryMap['Fruits & Veggies'] = cat._id
      if (cat.name.includes('Dairy')) categoryMap['Dairy & Breakfast'] = cat._id
      if (cat.name.includes('Snacks')) categoryMap['Snacks & Drinks'] = cat._id
      if (cat.name.includes('Home')) categoryMap['Home Essentials'] = cat._id
    })

    const finalProducts = productsData.map(prod => {
      let targetCategoryId = null
      if (prod.tags.includes('fruits') || prod.tags.includes('vegetables') || prod.tags.includes('tomato') || prod.tags.includes('banana')) {
        targetCategoryId = categoryMap['Fruits & Veggies']
      } else if (prod.tags.includes('milk') || prod.tags.includes('eggs')) {
        targetCategoryId = categoryMap['Dairy & Breakfast']
      } else if (prod.tags.includes('chips')) {
        targetCategoryId = categoryMap['Snacks & Drinks']
      } else {
        targetCategoryId = categoryMap['Home Essentials']
      }

      return {
        ...prod,
        category: targetCategoryId
      }
    })

    console.log('Seeding products...')
    const createdProducts = await Product.create(finalProducts)
    console.log(`Seeded ${createdProducts.length} products successfully.`)

    console.log('Database seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
