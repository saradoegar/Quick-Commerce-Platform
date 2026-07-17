import api from './api'

export const getProductReviewsRequest = (productId) => api.get(`/api/products/${productId}/reviews`).then((response) => response.data)
export const addReviewRequest = (productId, payload) => api.post(`/api/products/${productId}/reviews`, payload).then((response) => response.data)
export const updateReviewRequest = (reviewId, payload) => api.patch(`/api/reviews/${reviewId}`, payload).then((response) => response.data)
export const deleteReviewRequest = (reviewId) => api.delete(`/api/reviews/${reviewId}`)
