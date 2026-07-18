import { Link } from 'react-router-dom'
import '../pages/Home.css'

function Footer() {
  return (
    <footer className="home-footer">
      <div>
        <Link className="brand" to="/">
          <span className="brand-mark">QC</span>
          QuickCart
        </Link>
        <p>Daily essentials, packed well and delivered with care.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link to="/products">Products</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/login">Login</Link>
      </nav>
    </footer>
  )
}

export default Footer
