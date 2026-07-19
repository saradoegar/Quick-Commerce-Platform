import { useState, useEffect } from 'react'
import { FiCheck, FiMinus, FiPlus, FiShoppingBag, FiStar, FiTruck, FiZoomIn } from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import CommerceHeader from '../components/CommerceHeader'
import api from '../services/api'
import useCart from '../hooks/useCart'
import formatPrice from '../utils/formatPrice'
import './commerce.css'

function ProductDetails() {
  const { productId } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selection, setSelection] = useState({ productId: '', quantity: 1, image: '' })

  useEffect(() => {
    let active = true
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const res = await api.products.getById(productId)
        if (res.data && res.data.data && active) {
          const p = res.data.data
          p.id = p._id
          p.rating = p.rating || 4.5
          p.reviewCount = p.reviewCount || 10
          p.stock = p.stock > 0 ? 'In stock' : 'Out of stock'
          p.images = p.images || [p.thumbnail]
          p.specifications = p.specifications || []
          setProduct(p)
          setSelection({ productId: p.id, quantity: 1, image: p.images[0] })

          // Fetch related products of the same category
          const categoryName = p.category?.name || p.category
          if (categoryName) {
            const relRes = await api.products.getAll({ category: categoryName, limit: 4 })
             if (relRes.data && relRes.data.data && active) {
              const rawRelated = relRes.data.data.products || (Array.isArray(relRes.data.data) ? relRes.data.data : [])
              const filtered = rawRelated
                .map((item) => ({ ...item, id: item._id, images: item.images || [item.thumbnail] }))
                .filter((item) => item.id !== p.id)
                .slice(0, 3)
              setRelatedProducts(filtered)
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err)
      } finally {
        if (active) setIsLoading(false)
      }
    }
    fetchProduct()
    return () => { active = false }
  }, [productId])

  const quantity = selection.productId === product?.id ? selection.quantity : 1
  const selectedImage = selection.productId === product?.id ? selection.image : product?.images?.[0]

  const addProduct = () => {
    if (!product) return
    addToCart(product.id, quantity)
    toast.success(`${product.name} added to cart`)
  }

  if (isLoading) {
    return (
      <div className="commerce-page">
        <CommerceHeader />
        <main className="commerce-container flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
        </main>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="commerce-page">
        <CommerceHeader />
        <main className="commerce-container flex flex-col items-center justify-center py-20 text-center">
          <h2>Product Not Found</h2>
          <Link to="/products" className="commerce-primary mt-4">Back to Products</Link>
        </main>
      </div>
    )
  }

  return (
    <div className="commerce-page">
      <CommerceHeader />
      <main className="commerce-container">
        <p className="commerce-crumb">Home / {product.category?.name || product.category} / <strong>{product.name}</strong></p>
        <section className="detail-layout">
          <div className="product-gallery">
            <div className="product-main-image"><img src={selectedImage} alt={product.name} /><span><FiZoomIn /> Zoom image</span></div>
            <div className="thumbnail-row">
              {product.images.map((image, index) => <button className={image === selectedImage ? 'active' : ''} type="button" key={image} onClick={() => setSelection({ productId: product.id, quantity, image })} aria-label={`View product image ${index + 1}`}><img src={image} alt="" /></button>)}
            </div>
          </div>
          <div className="product-detail-copy">
            <p className="commerce-eyebrow">{product.brand} · {product.category?.name || product.category}</p>
            <h1>{product.name}</h1><p className="product-meta">{product.meta || 'Pack'}</p>
            <p className="rating-line"><span><FiStar /> {product.rating}</span> {product.reviewCount} reviews</p>
            <div className="detail-price"><strong>{formatPrice(product.price)}</strong>{product.oldPrice && <s>{formatPrice(product.oldPrice)}</s>}<b>{product.discount}</b></div>
            <p className="in-stock"><FiCheck /> {product.stock}</p>
            <div className="purchase-row"><div className="quantity-control"><button type="button" onClick={() => setSelection({ productId: product.id, quantity: Math.max(1, quantity - 1), image: selectedImage })} aria-label="Reduce quantity"><FiMinus /></button><span>{quantity}</span><button type="button" onClick={() => setSelection({ productId: product.id, quantity: quantity + 1, image: selectedImage })} aria-label="Increase quantity"><FiPlus /></button></div><button className="commerce-primary" type="button" onClick={addProduct}><FiShoppingBag /> Add to cart</button><Link className="commerce-secondary" to="/checkout" onClick={addProduct}>Buy now</Link></div>
            <div className="delivery-hint"><FiTruck /><span><strong>Express delivery available</strong> Get this everyday essential from a nearby store.</span></div>
          </div>
        </section>
        <section className="detail-info-grid"><article><h2>Description</h2><p>{product.description}</p></article><article><h2>Specifications</h2><dl>{product.specifications.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></article></section>
        <section className="related-section"><div><p className="commerce-eyebrow">You may also like</p><h2>Related essentials</h2></div><div className="related-grid">{relatedProducts.map((item) => <Link className="related-product" to={`/products/${item.id}`} key={item.id}><img src={item.images?.[0] || item.thumbnail} alt="" /><div><h3>{item.name}</h3><p>{item.meta}</p><strong>{formatPrice(item.price)}</strong></div></Link>)}</div></section>
      </main>
    </div>
  )
}

export default ProductDetails
