import { useState } from 'react'
import { FiCheck, FiMinus, FiPlus, FiShoppingBag, FiStar, FiTruck, FiZoomIn } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import CommerceHeader from '../components/CommerceHeader'
import { defaultProduct, getProductById, products } from '../data/products'
import useCart from '../hooks/useCart'
import formatPrice from '../utils/formatPrice'
import './commerce.css'

function ProductDetails() {
  const { productId } = useParams()
  const product = getProductById(productId) ?? defaultProduct
  const { addToCart } = useCart()
  const [selection, setSelection] = useState({ productId: product.id, quantity: 1, image: product.images[0] })
  const relatedProducts = products.filter((item) => item.id !== product.id).slice(0, 3)
  const quantity = selection.productId === product.id ? selection.quantity : 1
  const selectedImage = selection.productId === product.id ? selection.image : product.images[0]

  const addProduct = () => {
    addToCart(product.id, quantity)
    toast.success(`${product.name} added to cart`)
  }

  return (
    <div className="commerce-page">
      <CommerceHeader />
      <main className="commerce-container">
        <p className="commerce-crumb">Home / {product.category} / <strong>{product.name}</strong></p>
        <section className="detail-layout">
          <div className="product-gallery">
            <div className="product-main-image"><img src={selectedImage} alt={product.name} /><span><FiZoomIn /> Zoom image</span></div>
            <div className="thumbnail-row">
              {product.images.map((image, index) => <button className={image === selectedImage ? 'active' : ''} type="button" key={image} onClick={() => setSelection({ productId: product.id, quantity, image })} aria-label={`View product image ${index + 1}`}><img src={image} alt="" /></button>)}
            </div>
          </div>
          <div className="product-detail-copy">
            <p className="commerce-eyebrow">{product.brand} · {product.category}</p>
            <h1>{product.name}</h1><p className="product-meta">{product.meta}</p>
            <p className="rating-line"><span><FiStar /> {product.rating}</span> {product.reviewCount} reviews</p>
            <div className="detail-price"><strong>{formatPrice(product.price)}</strong><s>{formatPrice(product.oldPrice)}</s><b>{product.discount}</b></div>
            <p className="in-stock"><FiCheck /> {product.stock}</p>
            <div className="purchase-row"><div className="quantity-control"><button type="button" onClick={() => setSelection({ productId: product.id, quantity: Math.max(1, quantity - 1), image: selectedImage })} aria-label="Reduce quantity"><FiMinus /></button><span>{quantity}</span><button type="button" onClick={() => setSelection({ productId: product.id, quantity: quantity + 1, image: selectedImage })} aria-label="Increase quantity"><FiPlus /></button></div><button className="commerce-primary" type="button" onClick={addProduct}><FiShoppingBag /> Add to cart</button><Link className="commerce-secondary" to="/checkout" onClick={addProduct}>Buy now</Link></div>
            <div className="delivery-hint"><FiTruck /><span><strong>Express delivery available</strong> Get this everyday essential from a nearby store.</span></div>
          </div>
        </section>
        <section className="detail-info-grid"><article><h2>Description</h2><p>{product.description}</p></article><article><h2>Specifications</h2><dl>{product.specifications.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></article></section>
        <section className="related-section"><div><p className="commerce-eyebrow">You may also like</p><h2>Related essentials</h2></div><div className="related-grid">{relatedProducts.map((item) => <Link className="related-product" to={`/products/${item.id}`} key={item.id}><img src={item.images[0]} alt="" /><div><h3>{item.name}</h3><p>{item.meta}</p><strong>{formatPrice(item.price)}</strong></div></Link>)}</div></section>
      </main>
    </div>
  )
}

export default ProductDetails
