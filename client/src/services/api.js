import axios from 'axios'

// Axios instance initialized for future MERN API base routing
const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
})

// Structured Mock API Service layer representing future backend endpoints
const api = {
  // Authentication Namespace
  auth: {
    login: async (email) => {
      // Future API call: return apiInstance.post('/api/auth/login', { email, password })
      return Promise.resolve({ data: { token: 'mock_session_token_xyz', user: { email, name: 'Sara Johnson' } } })
    },
    register: async () => {
      // Future API call: return apiInstance.post('/api/auth/register', userData)
      return Promise.resolve({ data: { success: true, message: 'User registered successfully!' } })
    }
  },

  // Products Namespace
  products: {
    getAll: async () => {
      // Future API call: return apiInstance.get('/api/products')
      const { products } = await import('../data/products')
      return Promise.resolve({ data: products })
    },
    getById: async (id) => {
      // Future API call: return apiInstance.get(`/api/products/${id}`)
      const { getProductById } = await import('../data/products')
      return Promise.resolve({ data: getProductById(id) })
    }
  },

  // Categories Namespace
  categories: {
    getAll: async () => {
      // Future API call: return apiInstance.get('/api/categories')
      const { categories } = await import('../data/categories')
      return Promise.resolve({ data: categories })
    }
  },

  // Orders Namespace
  orders: {
    getAll: async () => {
      // Future API call: return apiInstance.get('/api/orders')
      const saved = localStorage.getItem('quickcart_orders')
      if (saved) {
        return Promise.resolve({ data: JSON.parse(saved) })
      }
      const { orders } = await import('../data/orders')
      return Promise.resolve({ data: orders })
    },
    getById: async (id) => {
      // Future API call: return apiInstance.get(`/api/orders/${id}`)
      const saved = localStorage.getItem('quickcart_orders')
      const orders = saved ? JSON.parse(saved) : (await import('../data/orders')).orders
      return Promise.resolve({ data: orders.find(o => o.id === id) })
    },
    create: async (orderData) => {
      // Future API call: return apiInstance.post('/api/orders', orderData)
      return Promise.resolve({ data: { success: true, order: { id: `ORD-${Date.now()}`, ...orderData } } })
    }
  },

  // Addresses Namespace
  addresses: {
    getAll: async () => {
      // Future API call: return apiInstance.get('/api/addresses')
      const { savedAddresses } = await import('../data/addresses')
      return Promise.resolve({ data: savedAddresses })
    }
  },

  // Wishlist Namespace
  wishlist: {
    get: async () => {
      // Future API call: return apiInstance.get('/api/wishlist')
      const { wishlistProducts } = await import('../data/wishlist')
      return Promise.resolve({ data: wishlistProducts })
    }
  }
}

export default api
export { apiInstance }
