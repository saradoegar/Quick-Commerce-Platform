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
  {
    "name": "Fresh Robusta Banana",
    "description": "Naturally sweet and creamy Robusta bananas. Excellent source of potassium and energy, perfect for breakfast or quick snacking.",
    "categoryName": "Fruits & Veggies",
    "price": 48,
    "originalPrice": 60,
    "discountPercentage": 20,
    "thumbnail": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 142,
    "totalReviews": 142,
    "brand": "Fresh Farm",
    "unit": "pieces",
    "weight": "6 pieces",
    "featured": true,
    "tags": [
      "fruits & veggies",
      "fresh farm",
      "fresh robusta banana",
      "banana",
      "robusta"
    ]
  },
  {
    "name": "Washington Red Apples",
    "description": "Crisp and juicy imported Washington Red Apples. Perfect balance of sweetness and crunch, perfect for snacking or fruit salads.",
    "categoryName": "Fruits & Veggies",
    "price": 180,
    "originalPrice": 220,
    "discountPercentage": 18.2,
    "thumbnail": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 96,
    "totalReviews": 96,
    "brand": "Fresh Farm",
    "unit": "pieces",
    "weight": "4 pieces (approx. 500g)",
    "featured": true,
    "tags": [
      "fruits & veggies",
      "fresh farm",
      "washington red apples",
      "washington",
      "red",
      "apples"
    ]
  },
  {
    "name": "Fresh Organic Potato",
    "description": "Earthy organic potatoes, sourced directly from certified organic farms. Staple ingredient for a variety of traditional dishes.",
    "categoryName": "Fruits & Veggies",
    "price": 32,
    "originalPrice": 40,
    "discountPercentage": 20,
    "thumbnail": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 180,
    "totalReviews": 180,
    "brand": "Fresh Farm",
    "unit": "kg",
    "weight": "1 kg",
    "featured": true,
    "tags": [
      "fruits & veggies",
      "fresh farm",
      "fresh organic potato",
      "organic",
      "potato"
    ]
  },
  {
    "name": "Vine-Ripened Tomato",
    "description": "Juicy vine-ripened red tomatoes. Handpicked for optimal ripeness and acidity, ideal for curries, salads, and sauces.",
    "categoryName": "Fruits & Veggies",
    "price": 45,
    "originalPrice": 50,
    "discountPercentage": 10,
    "thumbnail": "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 5,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 135,
    "totalReviews": 135,
    "brand": "Fresh Farm",
    "unit": "g",
    "weight": "500 g",
    "featured": true,
    "tags": [
      "fruits & veggies",
      "fresh farm",
      "vine-ripened tomato",
      "vine",
      "ripened",
      "tomato"
    ]
  },
  {
    "name": "Fresh Green Spinach (Palak)",
    "description": "Crisp green spinach leaves, packed with nutrients. Thoroughly washed and bunched, excellent for cooking side dishes or green smoothies.",
    "categoryName": "Fruits & Veggies",
    "price": 25,
    "originalPrice": 30,
    "discountPercentage": 16.7,
    "thumbnail": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 78,
    "totalReviews": 78,
    "brand": "Fresh Farm",
    "unit": "g",
    "weight": "250 g bunch",
    "featured": true,
    "tags": [
      "fruits & veggies",
      "fresh farm",
      "fresh green spinach (palak)",
      "green",
      "spinach"
    ]
  },
  {
    "name": "Sweet Orange (Kinnow)",
    "description": "Sweet and tangy Kinnow oranges. Highly refreshing citrus fruit filled with dietary fiber and natural vitamin C.",
    "categoryName": "Fruits & Veggies",
    "price": 99,
    "originalPrice": 120,
    "discountPercentage": 17.5,
    "thumbnail": "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 62,
    "totalReviews": 62,
    "brand": "Fresh Farm",
    "unit": "kg",
    "weight": "1 kg pack",
    "featured": true,
    "tags": [
      "fruits & veggies",
      "fresh farm",
      "sweet orange (kinnow)",
      "sweet",
      "orange"
    ]
  },
  {
    "name": "Amul Taaza Toned Milk",
    "description": "Fresh, pasteurised toned milk for everyday tea, coffee, breakfast, and cooking.",
    "categoryName": "Dairy & Breakfast",
    "price": 28,
    "originalPrice": 30,
    "discountPercentage": 6.7,
    "thumbnail": "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=360&q=80",
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=360&q=80",
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 312,
    "totalReviews": 312,
    "brand": "Amul",
    "unit": "ml",
    "weight": "500 ml",
    "featured": true,
    "tags": [
      "dairy & breakfast",
      "amul",
      "amul taaza toned milk",
      "amul",
      "taaza",
      "milk"
    ]
  },
  {
    "name": "Amul Butter Pasteurised",
    "description": "The classic pasteurised salted butter from Amul. Smooth, rich, and creamy, perfect to spread on toasted bread or cook savory meals.",
    "categoryName": "Dairy & Breakfast",
    "price": 56,
    "originalPrice": 60,
    "discountPercentage": 6.7,
    "thumbnail": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 420,
    "totalReviews": 420,
    "brand": "Amul",
    "unit": "g",
    "weight": "100 g",
    "featured": true,
    "tags": [
      "dairy & breakfast",
      "amul",
      "amul butter pasteurised",
      "amul",
      "butter"
    ]
  },
  {
    "name": "Mother Dairy Fresh Curd",
    "description": "Thick and creamy curd set to perfection. Deliciously refreshing on its own, with rice, or in marinades.",
    "categoryName": "Dairy & Breakfast",
    "price": 32,
    "originalPrice": 35,
    "discountPercentage": 8.6,
    "thumbnail": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 154,
    "totalReviews": 154,
    "brand": "Mother Dairy",
    "unit": "g",
    "weight": "400 g cup",
    "featured": true,
    "tags": [
      "dairy & breakfast",
      "mother dairy",
      "mother dairy fresh curd",
      "curd",
      "mother",
      "dairy"
    ]
  },
  {
    "name": "Harvest Gold Brown Bread",
    "description": "Nutritious brown bread made from whole wheat flour. Soft, wholesome, and delicious, ideal for breakfast sandwiches.",
    "categoryName": "Dairy & Breakfast",
    "price": 45,
    "originalPrice": 50,
    "discountPercentage": 10,
    "thumbnail": "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 8,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 92,
    "totalReviews": 92,
    "brand": "Harvest Gold",
    "unit": "g",
    "weight": "400 g pack",
    "featured": true,
    "tags": [
      "dairy & breakfast",
      "harvest gold",
      "harvest gold brown bread",
      "brown",
      "bread"
    ]
  },
  {
    "name": "Britannia Cheese Slices",
    "description": "Deliciously creamy processed cheese slices. Excellent melting quality, ideal for cheeseburgers, sandwiches, and toasties.",
    "categoryName": "Dairy & Breakfast",
    "price": 140,
    "originalPrice": 160,
    "discountPercentage": 12.5,
    "thumbnail": "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 118,
    "totalReviews": 118,
    "brand": "Britannia",
    "unit": "g",
    "weight": "200 g (10 slices)",
    "featured": true,
    "tags": [
      "dairy & breakfast",
      "britannia",
      "britannia cheese slices",
      "cheese",
      "slices"
    ]
  },
  {
    "name": "Table Eggs (Pack of 12)",
    "description": "Farm-fresh, clean, and nutritious table eggs. High source of protein and vitamin D, perfect for quick boiling, frying, or baking.",
    "categoryName": "Dairy & Breakfast",
    "price": 90,
    "originalPrice": 110,
    "discountPercentage": 18.2,
    "thumbnail": "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 224,
    "totalReviews": 224,
    "brand": "Fresh Farm",
    "unit": "units",
    "weight": "12 units",
    "featured": true,
    "tags": [
      "dairy & breakfast",
      "fresh farm",
      "table eggs (pack of 12)",
      "table",
      "eggs"
    ]
  },
  {
    "name": "Lay's Classic Salted Chips",
    "description": "Crispy, classic salted potato chips from Lay's. Crafted from select potatoes and seasoned with salt, the ultimate snack companion.",
    "categoryName": "Snacks & Drinks",
    "price": 40,
    "originalPrice": 40,
    "discountPercentage": 0,
    "thumbnail": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 285,
    "totalReviews": 285,
    "brand": "Lay's",
    "unit": "g",
    "weight": "90 g pack",
    "featured": true,
    "tags": [
      "snacks & drinks",
      "lay's",
      "lay's classic salted chips",
      "lays",
      "classic"
    ]
  },
  {
    "name": "Coca-Cola Soft Drink",
    "description": "Sparkling soft drink Coca-Cola in a convenient 1.25 Litre bottle. Best enjoyed ice-cold with meals or at parties.",
    "categoryName": "Snacks & Drinks",
    "price": 70,
    "originalPrice": 75,
    "discountPercentage": 6.7,
    "thumbnail": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 168,
    "totalReviews": 168,
    "brand": "Coca-Cola",
    "unit": "L",
    "weight": "1.25 L bottle",
    "featured": true,
    "tags": [
      "snacks & drinks",
      "coca-cola",
      "coca-cola soft drink",
      "coca",
      "cola"
    ]
  },
  {
    "name": "Tetley Pure Green Tea",
    "description": "Pure green tea bags loaded with natural antioxidants. Light, refreshing, and calming beverage to support your health routine.",
    "categoryName": "Snacks & Drinks",
    "price": 160,
    "originalPrice": 180,
    "discountPercentage": 11.1,
    "thumbnail": "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 94,
    "totalReviews": 94,
    "brand": "Tetley",
    "unit": "Bags",
    "weight": "25 Tea Bags",
    "featured": true,
    "tags": [
      "snacks & drinks",
      "tetley",
      "tetley pure green tea",
      "green",
      "tea",
      "tetley"
    ]
  },
  {
    "name": "Cadbury Dairy Milk Silk",
    "description": "Indulgent, smooth, and milk-rich Cadbury Dairy Milk Silk chocolate. Melts in the mouth instantly, perfect for celebrating sweet moments.",
    "categoryName": "Snacks & Drinks",
    "price": 80,
    "originalPrice": 85,
    "discountPercentage": 5.9,
    "thumbnail": "https://images.unsplash.com/photo-1549007994-cb92ca87df46?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1549007994-cb92ca87df46?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 205,
    "totalReviews": 205,
    "brand": "Cadbury",
    "unit": "g",
    "weight": "150 g",
    "featured": true,
    "tags": [
      "snacks & drinks",
      "cadbury",
      "cadbury dairy milk silk",
      "dairy",
      "milk",
      "silk"
    ]
  },
  {
    "name": "Haldiram's Aloo Bhujia",
    "description": "Crispy potato and chickpea flour noodles seasoned with mild spices. The timeless, favorite Indian evening tea-time snack.",
    "categoryName": "Snacks & Drinks",
    "price": 110,
    "originalPrice": 120,
    "discountPercentage": 8.3,
    "thumbnail": "https://images.unsplash.com/photo-1589476993333-f55b84301219?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1589476993333-f55b84301219?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 147,
    "totalReviews": 147,
    "brand": "Haldiram's",
    "unit": "g",
    "weight": "350 g",
    "featured": true,
    "tags": [
      "snacks & drinks",
      "haldiram's",
      "haldiram's aloo bhujia",
      "aloo",
      "bhujia"
    ]
  },
  {
    "name": "Nescafe Classic Instant Coffee",
    "description": "Premium medium-dark roasted Robusta coffee beans, ground into instant soluble powder. Delivers a rich aroma and strong coffee taste.",
    "categoryName": "Snacks & Drinks",
    "price": 210,
    "originalPrice": 240,
    "discountPercentage": 12.5,
    "thumbnail": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 3,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 188,
    "totalReviews": 188,
    "brand": "Nescafe",
    "unit": "g",
    "weight": "100 g jar",
    "featured": true,
    "tags": [
      "snacks & drinks",
      "nescafe",
      "nescafe classic instant coffee",
      "instant",
      "coffee",
      "nescafe"
    ]
  },
  {
    "name": "Surf Excel Matic Liquid",
    "description": "Specialized liquid laundry detergent designed for front and top load washing machines. Dissolves quickly and removes tough stains.",
    "categoryName": "Home Essentials",
    "price": 199,
    "originalPrice": 220,
    "discountPercentage": 9.5,
    "thumbnail": "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 210,
    "totalReviews": 210,
    "brand": "Surf Excel",
    "unit": "Litre",
    "weight": "1 Litre",
    "featured": true,
    "tags": [
      "home essentials",
      "surf excel",
      "surf excel matic liquid",
      "surf",
      "excel",
      "liquid"
    ]
  },
  {
    "name": "Dettol Handwash Liquid Refill",
    "description": "Trusted germ-protection liquid handwash refill from Dettol. Formula enriched with moisturizers to keep hands clean and soft.",
    "categoryName": "Home Essentials",
    "price": 109,
    "originalPrice": 129,
    "discountPercentage": 15.5,
    "thumbnail": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 340,
    "totalReviews": 340,
    "brand": "Dettol",
    "unit": "ml",
    "weight": "750 ml",
    "featured": true,
    "tags": [
      "home essentials",
      "dettol",
      "dettol handwash liquid refill",
      "dettol",
      "handwash"
    ]
  },
  {
    "name": "Vim Dishwash Gel Lemon",
    "description": "Lemon-infused concentrated dishwashing liquid gel. Cuts through tough grease easily on stainless steel, glass, and ceramic utensils.",
    "categoryName": "Home Essentials",
    "price": 115,
    "originalPrice": 130,
    "discountPercentage": 11.5,
    "thumbnail": "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 228,
    "totalReviews": 228,
    "brand": "Vim",
    "unit": "ml",
    "weight": "500 ml",
    "featured": true,
    "tags": [
      "home essentials",
      "vim",
      "vim dishwash gel lemon",
      "vim",
      "gel"
    ]
  },
  {
    "name": "Harpic Toilet Cleaner Liquid",
    "description": "Disinfectant toilet cleaner gel from Harpic. Provides powerful cleaning action, removes limescale, and kills 99.9% of germs.",
    "categoryName": "Home Essentials",
    "price": 89,
    "originalPrice": 99,
    "discountPercentage": 10.1,
    "thumbnail": "https://images.unsplash.com/photo-1528740561666-ac2479db02fc?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1528740561666-ac2479db02fc?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 110,
    "totalReviews": 110,
    "brand": "Harpic",
    "unit": "Litre",
    "weight": "1 Litre",
    "featured": true,
    "tags": [
      "home essentials",
      "harpic",
      "harpic toilet cleaner liquid",
      "harpic",
      "cleaner"
    ]
  },
  {
    "name": "Colin Glass Cleaner Spray",
    "description": "Multi-purpose household glass cleaner spray. Leaves a streak-free shine on mirrors, glass tables, windows, and kitchen counters.",
    "categoryName": "Home Essentials",
    "price": 105,
    "originalPrice": 115,
    "discountPercentage": 8.7,
    "thumbnail": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 4,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 88,
    "totalReviews": 88,
    "brand": "Colin",
    "unit": "ml",
    "weight": "500 ml",
    "featured": true,
    "tags": [
      "home essentials",
      "colin",
      "colin glass cleaner spray",
      "colin",
      "spray"
    ]
  },
  {
    "name": "Ariel Matic Washing Powder",
    "description": "Matic laundry detergent powder designed to deliver brilliant stain removal inside the machine itself in just 1 wash.",
    "categoryName": "Home Essentials",
    "price": 240,
    "originalPrice": 270,
    "discountPercentage": 11.1,
    "thumbnail": "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=360&q=80",
    "images": [
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=360&q=80"
    ],
    "stock": 100,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 165,
    "totalReviews": 165,
    "brand": "Ariel",
    "unit": "kg",
    "weight": "1 kg pack",
    "featured": true,
    "tags": [
      "home essentials",
      "ariel",
      "ariel matic washing powder",
      "ariel",
      "powder"
    ]
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

    const finalProducts = productsData.map(({ categoryName, ...prod }) => {
      const targetCategoryId = categoryMap[categoryName]

      if (!targetCategoryId) {
        throw new Error(`No category found for product category: ${categoryName}`)
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
