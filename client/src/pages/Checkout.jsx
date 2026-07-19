import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { FiCheckCircle, FiCreditCard, FiMapPin, FiPackage } from 'react-icons/fi'
import { Link, Navigate } from 'react-router-dom'
import CommerceHeader from '../components/CommerceHeader'
import useCart from '../hooks/useCart'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import './commerce.css'

const formatPrice = (price) => `Rs ${price}`

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function Checkout() {
  const { user } = useAuth()
  const { items, subtotal, discount, deliveryCharge, tax, total, coupon, setCoupon, clearCart } = useCart()
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await api.addresses.getAll()
        if (res.data && res.data.data) {
          const list = res.data.data
          setAddresses(list)
          const def = list.find(a => a.isDefault) || list[0]
          if (def) {
            setSelectedAddressId(def._id)
          }
        }
      } catch (err) {
        console.error('Failed to load addresses:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAddresses()
  }, [])

  const placeOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address')
      return
    }

    try {
      const orderRes = await api.orders.create({ addressId: selectedAddressId })
      const order = orderRes.data.data
      const orderId = order._id

      if (paymentMethod === 'upi') {
        const scriptLoaded = await loadRazorpayScript()
        if (!scriptLoaded) {
          toast.error('Failed to load Razorpay SDK. Please check your connection.')
          return
        }

        const payRes = await api.payments.createOrder({ orderId })
        const { orderId: gatewayOrderId, amount, currency, key } = payRes.data.data

        const options = {
          key,
          amount,
          currency,
          name: 'QuickCart',
          description: 'Payment for Order #' + orderId,
          order_id: gatewayOrderId,
          handler: async (response) => {
            try {
              await api.payments.verify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
              toast.success('Payment completed successfully!')
              setIsComplete(true)
              clearCart()
            } catch (verifyErr) {
              console.error(verifyErr)
              toast.error('Payment verification failed.')
            }
          },
          prefill: {
            name: user?.fullName || 'Customer',
            email: user?.email || '',
            contact: user?.phone || '',
          },
          theme: {
            color: '#4f8f5f',
          },
        }

        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        toast.success('Order placed successfully (Cash on Delivery)!')
        setIsComplete(true)
        clearCart()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to place order')
    }
  }

  if (isComplete) {
    return (
      <div className="commerce-page">
        <CommerceHeader backTo="/" backLabel="Back to home" />
        <main className="commerce-container">
          <section className="success-state">
            <FiCheckCircle />
            <p className="commerce-eyebrow">Order confirmed</p>
            <h1>Your order is on its way</h1>
            <p>We have received your order and will share delivery updates shortly.</p>
            <div>
              <Link className="commerce-primary" to="/orders">View order</Link>
              <Link className="commerce-secondary" to="/">Continue shopping</Link>
            </div>
          </section>
        </main>
      </div>
    )
  }

  if (!items.length) return <Navigate to="/cart" replace />

  return (
    <div className="commerce-page">
      <CommerceHeader backTo="/cart" backLabel="Back to cart" />
      <main className="commerce-container">
        <div className="page-title">
          <div>
            <p className="commerce-crumb">Almost there</p>
            <h1>Checkout</h1>
          </div>
        </div>
        <div className="checkout-layout">
          <section className="checkout-form">
            <article className="checkout-card">
              <h2><FiMapPin /> Delivery address</h2>
              {isLoading ? (
                <div className="p-4 text-center">Loading addresses...</div>
              ) : addresses.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-xs text-gray-500 mb-3">No delivery addresses found.</p>
                  <Link to="/addresses" className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold inline-block">
                    Add Address
                  </Link>
                </div>
              ) : (
                addresses.map((addr) => (
                  <label className="address-choice" key={addr._id}>
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr._id}
                      onChange={() => setSelectedAddressId(addr._id)}
                    />
                    <span>
                      <strong>
                        {addr.addressType}{' '}
                        {addr.isDefault && <small className="text-emerald-600 font-bold ml-1">(Default)</small>}
                      </strong>
                      <small>
                        {addr.fullName}, {addr.phone}, {addr.addressLine1}, {addr.city} - {addr.postalCode}
                      </small>
                    </span>
                  </label>
                ))
              )}
              {addresses.length > 0 && (
                <Link className="text-button block mt-3 text-center" to="/addresses">
                  + Manage Addresses
                </Link>
              )}
            </article>
            <article className="checkout-card">
              <h2><FiCreditCard /> Payment method</h2>
              <label className="address-choice">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <span>
                  <strong>Cash on delivery</strong>
                  <small>Pay when your order arrives.</small>
                </span>
              </label>
              <label className="address-choice">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                />
                <span>
                  <strong>UPI / Card</strong>
                  <small>Pay securely with your preferred method.</small>
                </span>
              </label>
            </article>
          </section>
          <aside className="order-summary checkout-summary">
            <h2><FiPackage /> Order summary</h2>
            {items.map(({ product, quantity }) => (
              <p className="checkout-item" key={product.id}>
                <span>{product.name} × {quantity}</span>
                <strong>{formatPrice(product.price * quantity)}</strong>
              </p>
            ))}
            <label className="coupon-field">
              <span>Coupon code</span>
              <div>
                <input value={coupon} onChange={(event) => setCoupon(event.target.value)} placeholder="Try QUICK10" />
                <button type="button">Apply</button>
              </div>
            </label>
            <div className="summary-lines">
              <p><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></p>
              <p><span>Shipping charges</span><strong>{deliveryCharge ? formatPrice(deliveryCharge) : 'Free'}</strong></p>
              <p><span>Tax</span><strong>{formatPrice(tax)}</strong></p>
              {discount ? <p><span>Coupon discount</span><strong>- {formatPrice(discount)}</strong></p> : null}
            </div>
            <p className="summary-total"><span>Grand total</span><strong>{formatPrice(total)}</strong></p>
            <button className="commerce-primary full-width" type="button" onClick={placeOrder}>
              Place order
            </button>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default Checkout
