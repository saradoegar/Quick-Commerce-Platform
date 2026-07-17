import { useState } from 'react'
import { FiHeart, FiShoppingBag, FiTrash2 } from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import { wishlistProducts } from '../data/userFeatures'
import './Home.css'
import './UserFeatures.css'

function FeatureNav() {
  return (
    <header className="feature-nav">
      <a className="brand" href="/">
        <span className="brand-mark">QC</span>
        QuickCart
      </a>
      <nav className="feature-nav-links" aria-label="Wishlist navigation">
        <a href="/products">Products</a>
        <a href="/addresses">Addresses</a>
        <a href="/cart">Cart</a>
      </nav>
    </header>
  )
}

function Wishlist() {
  const [items, setItems] = useState(wishlistProducts)
  const [movedItem, setMovedItem] = useState('')

  function removeProduct(productId) {
    setItems((current) => current.filter((product) => product.id !== productId))
  }

  function moveToCart(product) {
    setMovedItem(product.name)
    removeProduct(product.id)
  }

  return (
    <div className="feature-shell">
      <FeatureNav />
      <section className="feature-hero">
        <div>
          <p className="eyebrow">
            <FiHeart />
            Wishlist
          </p>
          <h1>Save favorites and move them to cart when needed.</h1>
          <p>
            Wishlist data stays isolated and backend-ready, so saved products can
            later come directly from customer APIs.
          </p>
        </div>
        <span className="feature-hero-badge">{items.length} products saved</span>
      </section>

      <main className="feature-section">
        {movedItem ? <p className="feature-hero-badge">{movedItem} moved to cart</p> : null}
        {items.length ? (
          <div className="wishlist-grid">
            {items.map((product) => (
              <article className="wishlist-card" key={product.id}>
                <ProductCard product={product} />
                <div className="wishlist-actions">
                  <button className="soft-button" type="button" onClick={() => moveToCart(product)}>
                    <FiShoppingBag /> Move to Cart
                  </button>
                  <button className="danger-button" type="button" onClick={() => removeProduct(product.id)}>
                    <FiTrash2 /> Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="empty-state">
            <span className="empty-icon">
              <FiHeart />
            </span>
            <h1>Your wishlist is empty.</h1>
            <p>Save daily essentials here and come back when you are ready to order.</p>
            <div className="empty-actions">
              <a className="feature-button" href="/products">
                Continue Shopping
              </a>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default Wishlist
