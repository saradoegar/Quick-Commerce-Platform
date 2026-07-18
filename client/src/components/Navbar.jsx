import { Link } from 'react-router-dom'
import { FiShoppingBag, FiMenu, FiLogOut } from 'react-icons/fi'
import useCart from '../hooks/useCart'
import { useAuth } from '../context/AuthContext'
import '../pages/Home.css'

function Navbar() {
  const { items } = useCart()
  const { user, logout } = useAuth()
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="home-nav">
      <Link className="brand" to="/">
        <span className="brand-mark">QC</span>
        QuickCart
      </Link>

      <nav className="nav-links" aria-label="Primary navigation">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/categories">Categories</Link>
        <a href="/#roles">Roles</a>
        <Link to="/orders">Orders</Link>
      </nav>

      <div className="nav-actions">
        <Link className="cart-button" to="/cart">
          <FiShoppingBag />
          Cart {itemCount ? `(${itemCount})` : ''}
        </Link>
        
        {user ? (
          <div className="flex items-center gap-2">
            <Link className="login-button font-bold text-xs" to="/profile">
              Hi, {user.name || 'User'}
            </Link>
            <button
              onClick={logout}
              className="login-button flex items-center justify-center p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 transition-colors"
              title="Logout"
              type="button"
            >
              <FiLogOut size={16} />
            </button>
          </div>
        ) : (
          <Link className="login-button" to="/login">
            Login
          </Link>
        )}

        <button className="menu-button" type="button" aria-label="Open menu">
          <FiMenu />
        </button>
      </div>
    </header>
  )
}

export default Navbar
