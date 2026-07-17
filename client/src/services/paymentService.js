import api from './api'

export const createRazorpayOrderRequest = (orderId) => api.post('/api/payments/razorpay/order', { orderId }).then((response) => response.data)
export const verifyRazorpayPaymentRequest = (payload) => api.post('/api/payments/razorpay/verify', payload).then((response) => response.data)
export const markRazorpayFailureRequest = (payload) => api.post('/api/payments/razorpay/failure', payload).then((response) => response.data)
