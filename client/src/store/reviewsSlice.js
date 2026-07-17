import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { addReviewRequest, deleteReviewRequest, getProductReviewsRequest, updateReviewRequest } from '../services/reviewService'
const message = (error) => error.response?.data?.message || error.message || 'Request failed'
export const fetchReviews = createAsyncThunk('reviews/fetch', async (productId, { rejectWithValue }) => { try { return { productId, ...(await getProductReviewsRequest(productId)) } } catch (error) { return rejectWithValue(message(error)) } })
export const addReview = createAsyncThunk('reviews/add', async ({ productId, review }, { rejectWithValue }) => { try { return { productId, ...(await addReviewRequest(productId, review)) } } catch (error) { return rejectWithValue(message(error)) } })
export const updateReview = createAsyncThunk('reviews/update', async ({ reviewId, review }, { rejectWithValue }) => { try { return await updateReviewRequest(reviewId, review) } catch (error) { return rejectWithValue(message(error)) } })
export const deleteReview = createAsyncThunk('reviews/delete', async (reviewId, { rejectWithValue }) => { try { await deleteReviewRequest(reviewId); return reviewId } catch (error) { return rejectWithValue(message(error)) } })
const reviewsSlice = createSlice({ name: 'reviews', initialState: { byProduct: {}, status: 'idle', error: null }, reducers: {}, extraReducers: (builder) => builder
  .addCase(fetchReviews.fulfilled, (state, action) => { state.byProduct[action.payload.productId] = action.payload; state.status = 'succeeded' })
  .addMatcher((action) => action.type.startsWith('reviews/') && action.type.endsWith('/pending'), (state) => { state.status = 'loading'; state.error = null })
  .addMatcher((action) => action.type.startsWith('reviews/') && action.type.endsWith('/rejected'), (state, action) => { state.status = 'failed'; state.error = action.payload }) })
export default reviewsSlice.reducer
