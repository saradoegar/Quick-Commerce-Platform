import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { cancelOrderRequest, createOrderRequest, getMyOrdersRequest } from '../services/orderService'

const message = (error) => error.response?.data?.message || error.message || 'Request failed'
export const createOrder = createAsyncThunk('orders/create', async (payload, { rejectWithValue }) => { try { return await createOrderRequest(payload) } catch (error) { return rejectWithValue(message(error)) } })
export const fetchMyOrders = createAsyncThunk('orders/fetchMine', async (_, { rejectWithValue }) => { try { return await getMyOrdersRequest() } catch (error) { return rejectWithValue(message(error)) } })
export const cancelOrder = createAsyncThunk('orders/cancel', async ({ id, reason }, { rejectWithValue }) => { try { return await cancelOrderRequest(id, reason) } catch (error) { return rejectWithValue(message(error)) } })

const ordersSlice = createSlice({
  name: 'orders', initialState: { items: [], status: 'idle', error: null }, reducers: {},
  extraReducers: (builder) => builder
    .addCase(fetchMyOrders.fulfilled, (state, action) => { state.items = action.payload.orders; state.status = 'succeeded' })
    .addMatcher((action) => action.type.startsWith('orders/') && action.type.endsWith('/pending'), (state) => { state.status = 'loading'; state.error = null })
    .addMatcher((action) => action.type.startsWith('orders/') && action.type.endsWith('/rejected'), (state, action) => { state.status = 'failed'; state.error = action.payload })
    .addMatcher((action) => action.type.startsWith('orders/') && action.type.endsWith('/fulfilled'), (state) => { state.status = 'succeeded' }),
})
export default ordersSlice.reducer
