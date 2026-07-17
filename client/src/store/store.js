import { configureStore } from '@reduxjs/toolkit'
import ordersReducer from './ordersSlice'
import reviewsReducer from './reviewsSlice'

export const store = configureStore({ reducer: { orders: ordersReducer, reviews: reviewsReducer } })
