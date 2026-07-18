import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Addresses from '../pages/Addresses'
import Cart from '../pages/Cart'
import Categories from '../pages/Categories'
import Checkout from '../pages/Checkout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import Orders from '../pages/Orders'
import OrderDetails from '../pages/OrderDetails'
import ProductDetails from '../pages/ProductDetails'
import Products from '../pages/Products'
import Profile from '../pages/Profile'
import Register from '../pages/Register'
import Wishlist from '../pages/Wishlist'
import ProtectedRoute from '../components/ProtectedRoute'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productId" element={<ProductDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path="/orders/:orderId" element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        } />
        <Route path="/addresses" element={
          <ProtectedRoute>
            <Addresses />
          </ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
