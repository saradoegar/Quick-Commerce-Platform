import { FiStar } from 'react-icons/fi'

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt="" loading="lazy" />
        {product.express ? <span className="express-pill">Express</span> : null}
      </div>

      <div className="product-info">
        <div>
          <h3>{product.name}</h3>
          {product.brand ? <p className="product-brand">{product.brand}</p> : null}
          <p>{product.meta}</p>
        </div>

        {product.rating ? (
          <div className="product-rating">
            <FiStar />
            {product.rating}
          </div>
        ) : null}

        <div className="product-footer">
          <div className="price-stack">
            <strong>{product.price}</strong>
            {product.discount ? <span>{product.discount}</span> : null}
          </div>
          <button type="button">Add</button>
        </div>

        {product.stock ? <p className="stock-status">{product.stock}</p> : null}
      </div>
    </article>
  )
}

export default ProductCard
