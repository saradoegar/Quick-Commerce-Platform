import { Link } from 'react-router-dom'
import { FiStar, FiHeart } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import useCart from '../hooks/useCart'
import { useWishlist } from '../context/WishlistContext'

const getDisplayText = (value) => {
  if (typeof value === 'string' || typeof value === 'number') return value
  if (!value || typeof value !== 'object') return ''
  return value.name || value.title || value.label || ''
}

const getImageSrc = (value) => {
  if (typeof value === 'string') return value
  if (!value || typeof value !== 'object') return ''
  return value.url || value.src || value.secure_url || ''
}

function ProductCard({ product }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const productId = product.id || product._id || product.productId
  const productLink = productId ? `/products/${productId}` : null
  const isWishlisted = isInWishlist(productId)
  const productImage =
    getImageSrc(product.image) || getImageSrc(product.images?.[0]) || getImageSrc(product.thumbnail)
  const categoryLabel = getDisplayText(product.category)
  const brandLabel = getDisplayText(product.brand)
  const metaLabel = getDisplayText(product.meta) || getDisplayText(product.weight) || getDisplayText(product.unit)
  const discountBadgeLabel = getDisplayText(product.discountBadge)
  const discountLabel = getDisplayText(product.discount)

  const handleWishlistClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (isWishlisted) {
      removeFromWishlist(productId)
      toast.success(`${product.name} removed from wishlist!`)
    } else {
      addToWishlist(product)
      toast.success(`${product.name} added to wishlist!`)
    }
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (productId) {
      addToCart(productId)
      toast.success(`Added ${product.name} to Cart!`)
    }
  }

  const renderCardContent = () => (
    <>
      <div className="product-image-wrap">
        <img src={productImage} alt={product.name} loading="lazy" />
        {product.express ? <span className="express-pill">Express</span> : null}
        {discountBadgeLabel ? <span className="discount-badge-pill">{discountBadgeLabel}</span> : null}
        
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          type="button" 
          onClick={handleWishlistClick}
          aria-label="Add to wishlist"
        >
          <FiHeart fill={isWishlisted ? "#ff4757" : "none"} color={isWishlisted ? "#ff4757" : "currentColor"} />
        </button>
      </div>

      <div className="product-info">
        <div>
          {categoryLabel ? <span className="product-category">{categoryLabel}</span> : null}
          <h3>{product.name}</h3>
          {brandLabel ? <p className="product-brand">{brandLabel}</p> : null}
          <p>{metaLabel}</p>
        </div>

        {product.rating ? (
          <div className="product-rating">
            <FiStar />
            {product.rating}
          </div>
        ) : null}

        <div className="product-footer">
          <div className="price-stack">
            <div className="price-row">
              <strong>{typeof product.price === 'number' ? `Rs ${product.price}` : product.price}</strong>
              {product.oldPrice ? (
                <span className="old-price">
                  {typeof product.oldPrice === 'number' ? `Rs ${product.oldPrice}` : product.oldPrice}
                </span>
              ) : null}
            </div>
            {discountLabel ? <span className="discount-tag">{discountLabel}</span> : null}
          </div>
          <button type="button" onClick={handleAddToCart}>Add</button>
        </div>

        {product.stock ? <p className="stock-status">{product.stock}</p> : null}
      </div>
    </>
  )

  if (productLink) {
    return (
      <Link to={productLink} className="product-card-link-wrap">
        <article className="product-card">
          {renderCardContent()}
        </article>
      </Link>
    )
  }

  return (
    <article className="product-card">
      {renderCardContent()}
    </article>
  )
}

export default ProductCard