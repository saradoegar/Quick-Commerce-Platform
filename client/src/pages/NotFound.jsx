import { FiArrowLeft, FiCompass, FiHome, FiShoppingBag } from 'react-icons/fi'
import './Home.css'
import './UserFeatures.css'

function NotFound() {
  return (
    <div className="feature-shell">
      <main className="empty-state">
        <span className="empty-icon">
          <FiCompass />
        </span>
        <p className="eyebrow">Page not found</p>
        <h1>This aisle does not exist yet.</h1>
        <p>
          The page may have moved, or the link might be incorrect. Head back home or
          continue shopping from the product catalog.
        </p>
        <div className="empty-actions">
          <a className="feature-button" href="/">
            <FiHome />
            Go Home
          </a>
          <a className="feature-button light-button" href="/products">
            <FiShoppingBag />
            Continue Shopping
          </a>
          <a className="feature-button soft-button" href="#" onClick={() => window.history.back()}>
            <FiArrowLeft />
            Go Back
          </a>
        </div>
      </main>
    </div>
  )
}

export default NotFound
