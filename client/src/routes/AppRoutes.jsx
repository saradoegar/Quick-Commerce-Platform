import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Addresses from '../pages/Addresses'
import Cart from '../pages/Cart'
import Categories from '../pages/Categories'
import Checkout from '../pages/Checkout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import Orders from '../pages/Orders'
import ProductDetails from '../pages/ProductDetails'
import Products from '../pages/Products'
import Profile from '../pages/Profile'
import Register from '../pages/Register'
import Wishlist from '../pages/Wishlist'

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
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/addresses" element={<Addresses />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
