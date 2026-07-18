import { Link } from 'react-router-dom'
import '../pages/Home.css'
import '../pages/UserFeatures.css'

function FeatureNav() {
  return (
    <header className="feature-nav">
      <Link className="brand" to="/">
        <span className="brand-mark">QC</span>
        QuickCart
      </Link>
      <nav className="feature-nav-links" aria-label="User feature navigation">
        <Link to="/products">Products</Link>
        <Link to="/wishlist">Wishlist</Link>
        <Link to="/addresses">Addresses</Link>
        <Link to="/cart">Cart</Link>
      </nav>
    </header>
  )
}

export default FeatureNav
