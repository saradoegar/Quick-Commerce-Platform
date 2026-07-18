export const homeCategories = [
  {
    name: 'Fruits & Veggies',
    detail: 'Fresh picks for daily meals',
    accent: '#E8F1D9',
    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=360&q=80',
  },
  {
    name: 'Dairy & Breakfast',
    detail: 'Milk, curd, eggs, and breads',
    accent: '#F3E9DC',
    image:
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=360&q=80',
  },
  {
    name: 'Snacks & Drinks',
    detail: 'Tea-time bites and beverages',
    accent: '#F9E4C8',
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=360&q=80',
  },
  {
    name: 'Home Essentials',
    detail: 'Cleaning, personal care, and more',
    accent: '#E6F1E7',
    image:
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=360&q=80',
  },
];

export const homeProducts = [
  {
    id: 'amul-taaza-milk',
    name: 'Amul Taaza Milk',
    meta: '500 ml',
    price: 'Rs 28',
    express: true,
    image:
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=360&q=80',
  },
  {
    id: 'banana-robusta',
    name: 'Banana Robusta',
    meta: '6 pieces',
    price: 'Rs 48',
    express: true,
    image:
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=360&q=80',
  },
  {
    id: 'aashirvaad-atta',
    name: 'Aashirvaad Atta',
    meta: '5 kg pack',
    price: 'Rs 245',
    express: false,
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=360&q=80',
  },
  {
    id: 'surf-excel-liquid',
    name: 'Surf Excel Liquid',
    meta: '1 litre',
    price: 'Rs 199',
    express: true,
    image:
      'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=360&q=80',
  },
];

export const roles = [
  {
    icon: 'user',
    title: 'Customer',
    text: 'Search products, place orders, track delivery, manage addresses.',
    href: '/login',
  },
  {
    icon: 'home',
    title: 'Warehouse Manager',
    text: 'Review inventory, process orders, pack items, update stock.',
    href: '/login',
  },
  {
    icon: 'truck',
    title: 'Delivery Partner',
    text: 'Accept delivery requests, update status, view assigned orders.',
    href: '/login',
  },
];

export const benefits = [
  {
    icon: 'clock',
    title: 'Minimum-time delivery',
    text: 'Fast-moving essentials are routed from the nearest active warehouse.',
  },
  {
    icon: 'package',
    title: 'Wide daily catalog',
    text: 'Groceries, snacks, personal care, household supplies, and more in one place.',
  },
  {
    icon: 'truck',
    title: 'Order visibility',
    text: 'Customers and teams can follow order progress from packing to delivery.',
  },
];
