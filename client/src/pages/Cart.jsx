import { FiArrowRight, FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import CommerceHeader from '../components/CommerceHeader'
import useCart from '../hooks/useCart'
import './commerce.css'

const formatPrice = (price) => `Rs ${price}`

function Summary({ checkout = false }) {
  const { subtotal, discount, deliveryCharge, tax, total, coupon, setCoupon } = useCart()
  return <aside className="order-summary"><h2>Order summary</h2><label className="coupon-field"><span>Coupon code</span><div><input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Try QUICK10" /><button type="button">Apply</button></div></label>{discount > 0 ? <p className="coupon-success">QUICK10 applied - Rs {discount} saved</p> : null}<div className="summary-lines"><p><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></p><p><span>Delivery charges</span><strong>{deliveryCharge ? formatPrice(deliveryCharge) : 'Free'}</strong></p>{checkout ? <p><span>Tax</span><strong>{formatPrice(tax)}</strong></p> : null}{discount > 0 ? <p><span>Coupon discount</span><strong>- {formatPrice(discount)}</strong></p> : null}</div><p className="summary-total"><span>Grand total</span><strong>{formatPrice(total)}</strong></p>{!checkout ? <Link className="commerce-primary full-width" to="/checkout">Proceed to checkout <FiArrowRight /></Link> : null}</aside>
}

function Cart() {
  const { items, updateQuantity, removeFromCart } = useCart()
  return <div className="commerce-page"><CommerceHeader /><main className="commerce-container"><div className="page-title"><div><p className="commerce-eyebrow">Your basket</p><h1>Shopping cart</h1></div><Link to="/products">Continue shopping <FiArrowRight /></Link></div>{items.length === 0 ? <section className="empty-state"><FiShoppingBag /><h2>Your cart is empty</h2><p>Add everyday essentials to your basket and they will show up here.</p><Link className="commerce-primary" to="/products">Start shopping</Link></section> : <div className="cart-layout"><section className="cart-items">{items.map(({ product, quantity }) => <article className="cart-item" key={product.id}><img src={product.images[0]} alt={product.name} /><div className="cart-item-copy"><p>{product.brand}</p><h2>{product.name}</h2><span>{product.meta}</span><strong>{formatPrice(product.price)}</strong></div><div className="cart-item-actions"><button className="remove-button" type="button" onClick={() => removeFromCart(product.id)}><FiTrash2 /> Remove</button><div className="quantity-control"><button type="button" onClick={() => updateQuantity(product.id, quantity - 1)} aria-label={`Reduce ${product.name} quantity`}><FiMinus /></button><span>{quantity}</span><button type="button" onClick={() => updateQuantity(product.id, quantity + 1)} aria-label={`Increase ${product.name} quantity`}><FiPlus /></button></div></div></article>)}</section><Summary /></div>}</main></div>
}

export default Cart
