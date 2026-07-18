import { useState } from 'react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { FiCheckCircle, FiCreditCard, FiMapPin, FiPackage } from 'react-icons/fi'
import { Link, Navigate } from 'react-router-dom'
import CommerceHeader from '../components/CommerceHeader'
import useCart from '../hooks/useCart'
import { createOrder } from '../store/ordersSlice'
import './commerce.css'

const formatPrice = (price) => `Rs ${price}`

function Checkout() {
  const { items, subtotal, discount, deliveryCharge, tax, total, coupon, setCoupon, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [isComplete, setIsComplete] = useState(false)
  const dispatch = useDispatch()
  const placeOrder = async () => {
    try {
      await dispatch(createOrder({
        items: items.map(({ product, quantity }) => ({ product: product._id || product.id, name: product.name, image: product.images?.[0], price: product.price, quantity })),
        shippingAddress: { name: 'Home', phone: '0000000000', address: '22, Green Park, Near City Market', city: 'Bengaluru', state: 'Karnataka', postalCode: '560001' },
        pricing: { subtotal, deliveryCharge, tax, discount, total },
        paymentMethod: paymentMethod === 'upi' ? 'razorpay' : 'cod',
      })).unwrap()
      setIsComplete(true); clearCart()
    } catch (error) { toast.error(error || 'Unable to place order') }
  }
  if (isComplete) return <div className="commerce-page"><CommerceHeader backTo="/" backLabel="Back to home" /><main className="commerce-container"><section className="success-state"><FiCheckCircle /><p className="commerce-eyebrow">Order confirmed</p><h1>Your order is on its way</h1><p>We have received your order and will share delivery updates shortly.</p><div><Link className="commerce-primary" to="/orders">View order</Link><Link className="commerce-secondary" to="/">Continue shopping</Link></div></section></main></div>
  if (!items.length) return <Navigate to="/cart" replace />
  return <div className="commerce-page"><CommerceHeader backTo="/cart" backLabel="Back to cart" /><main className="commerce-container"><div className="page-title"><div><p className="commerce-eyebrow">Almost there</p><h1>Checkout</h1></div></div><div className="checkout-layout"><section className="checkout-form"><article className="checkout-card"><h2><FiMapPin /> Delivery address</h2><label className="address-choice"><input type="radio" name="address" defaultChecked /><span><strong>Home</strong><small>22, Green Park, Near City Market, Bengaluru - 560001</small></span></label><button type="button" className="text-button">+ Add another address</button></article><article className="checkout-card"><h2><FiCreditCard /> Payment method</h2><label className="address-choice"><input type="radio" name="payment" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} /><span><strong>Cash on delivery</strong><small>Pay when your order arrives.</small></span></label><label className="address-choice"><input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} /><span><strong>UPI / Card</strong><small>Pay securely with your preferred method.</small></span></label></article></section><aside className="order-summary checkout-summary"><h2><FiPackage /> Order summary</h2>{items.map(({ product, quantity }) => <p className="checkout-item" key={product.id}><span>{product.name} × {quantity}</span><strong>{formatPrice(product.price * quantity)}</strong></p>)}<label className="coupon-field"><span>Coupon code</span><div><input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Try QUICK10" /><button type="button">Apply</button></div></label><div className="summary-lines"><p><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></p><p><span>Shipping charges</span><strong>{deliveryCharge ? formatPrice(deliveryCharge) : 'Free'}</strong></p><p><span>Tax</span><strong>{formatPrice(tax)}</strong></p>{discount ? <p><span>Coupon discount</span><strong>- {formatPrice(discount)}</strong></p> : null}</div><p className="summary-total"><span>Grand total</span><strong>{formatPrice(total)}</strong></p><button className="commerce-primary full-width" type="button" onClick={placeOrder}>Place order</button></aside></div></main></div>
}

export default Checkout
