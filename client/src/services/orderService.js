import api from './api'

export const createOrderRequest = (payload) => api.post('/api/orders', payload).then((response) => response.data)
export const getMyOrdersRequest = () => api.get('/api/orders/my').then((response) => response.data)
export const getOrderRequest = (id) => api.get(`/api/orders/${id}`).then((response) => response.data)
export const cancelOrderRequest = (id, reason) => api.post(`/api/orders/${id}/cancel`, { reason }).then((response) => response.data)
