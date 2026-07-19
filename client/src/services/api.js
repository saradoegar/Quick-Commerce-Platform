import axios from 'axios'

const apiInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://quick-commerce-api-spr9.onrender.com',
})

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('quickcart_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Attach Namespaces directly to Axios instance for dual compatibility:
// 1. Used as normal axios instance: apiInstance.post('/api/...')
// 2. Used as structured service namespace: apiInstance.products.getAll(...)

apiInstance.auth = {
  login: async (email, password) => {
    return apiInstance.post('/api/auth/login', { email, password })
  },
  register: async (userData) => {
    return apiInstance.post('/api/auth/register', userData)
  },
  getMe: async () => {
    return apiInstance.get('/api/auth/me')
  },
  logout: async () => {
    return apiInstance.post('/api/auth/logout')
  }
}

apiInstance.products = {
  getAll: async (params) => {
    return apiInstance.get('/api/products', { params })
  },
  getById: async (id) => {
    return apiInstance.get(`/api/products/${id}`)
  }
}

apiInstance.categories = {
  getAll: async () => {
    return apiInstance.get('/api/categories')
  }
}

apiInstance.wishlist = {
  get: async () => {
    return apiInstance.get('/api/wishlist')
  },
  add: async (productId) => {
    return apiInstance.post('/api/wishlist', { productId })
  },
  remove: async (productId) => {
    return apiInstance.delete(`/api/wishlist/${productId}`)
  },
  clear: async () => {
    return apiInstance.delete('/api/wishlist')
  }
}

apiInstance.cart = {
  get: async () => {
    return apiInstance.get('/api/cart')
  },
  add: async (productId, quantity) => {
    return apiInstance.post('/api/cart', { productId, quantity })
  },
  updateQuantity: async (productId, quantity) => {
    return apiInstance.put(`/api/cart/${productId}`, { quantity })
  },
  remove: async (productId) => {
    return apiInstance.delete(`/api/cart/${productId}`)
  },
  clear: async () => {
    return apiInstance.delete('/api/cart')
  }
}

apiInstance.addresses = {
  getAll: async () => {
    return apiInstance.get('/api/addresses')
  },
  getById: async (id) => {
    return apiInstance.get(`/api/addresses/${id}`)
  },
  create: async (addressData) => {
    return apiInstance.post('/api/addresses', addressData)
  },
  update: async (id, addressData) => {
    return apiInstance.put(`/api/addresses/${id}`, addressData)
  },
  delete: async (id) => {
    return apiInstance.delete(`/api/addresses/${id}`)
  },
  setDefault: async (id) => {
    return apiInstance.patch(`/api/addresses/${id}/default`)
  }
}


apiInstance.payments = {
  createOrder: async (orderData) => {
    return apiInstance.post('/api/payments/create-order', orderData)
  },
  verify: async (paymentData) => {
    return apiInstance.post('/api/payments/verify', paymentData)
  },
  getByOrderId: async (orderId) => {
    return apiInstance.get(`/api/payments/${orderId}`)
  }
}
apiInstance.orders = {
  getAll: async (params) => {
    return apiInstance.get('/api/orders', { params })
  },
  getById: async (id) => {
    return apiInstance.get(`/api/orders/${id}`)
  },
  create: async (orderData) => {
    return apiInstance.post('/api/orders', orderData)
  },
  cancel: async (id, reason) => {
    return apiInstance.patch(`/api/orders/${id}/cancel`, { reason })
  }
}

export default apiInstance
export { apiInstance }
