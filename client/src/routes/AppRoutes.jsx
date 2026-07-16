import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Cart from '../pages/Cart'
import Categories from '../pages/Categories'
import Checkout from '../pages/Checkout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Orders from '../pages/Orders'
import ProductDetails from '../pages/ProductDetails'
import Products from '../pages/Products'
import Profile from '../pages/Profile'
import Register from '../pages/Register'

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
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
