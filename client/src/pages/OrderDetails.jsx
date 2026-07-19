import { useState, useEffect, useCallback } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  FiArrowLeft,
  FiMapPin,
  FiCreditCard,
  FiUser,
  FiCalendar,
  FiFileText,
  FiPrinter,
  FiXCircle,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../services/api'
import './Home.css'

// Reusable Status Badge
function StatusBadge({ status }) {
  const getBadgeClasses = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'Packed':
        return 'bg-blue-50 text-blue-700 border-blue-100'
      case 'Out For Delivery':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100'
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-100'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100'
    }
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getBadgeClasses(status)}`}>
      {status}
    </span>
  )
}

// Order tracking timeline component matching details page spec
function OrderTimeline({ status }) {
  const stages = [
    { label: 'Order Placed', desc: 'We received your order' },
    { label: 'Confirmed', desc: 'Warehouse acknowledged' },
    { label: 'Packed', desc: 'Items packed and checked' },
    { label: 'Shipped', desc: 'Handed to logistics' },
    { label: 'Out For Delivery', desc: 'Partner is en route' },
    { label: 'Delivered', desc: 'Delivered at destination' },
  ]

  const getActiveIndex = (status) => {
    switch (status) {
      case 'Processing': return 1
      case 'Packed': return 2
      case 'Shipped': return 3
      case 'Out For Delivery': return 4
      case 'Delivered': return 5
      case 'Cancelled': return -1
      default: return 0
    }
  }

  const activeIndex = getActiveIndex(status)

  if (status === 'Cancelled') {
    return (
      <div className="bg-red-50 border border-red-200/60 rounded-2xl p-5 flex items-center gap-4 text-red-800">
        <FiXCircle size={28} className="shrink-0 text-red-600" />
        <div>
          <h3 className="font-extrabold text-sm">Order Cancelled</h3>
          <p className="text-xs text-red-600/90 mt-0.5 leading-relaxed">
            This order has been cancelled and cannot be tracked or delivered. If a payment was made, your refund is being processed.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#2f3640]/10 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-extrabold text-[#2f3640] uppercase tracking-wider mb-6">Delivery Tracking</h3>

      {/* Desktop Timeline */}
      <div className="hidden md:flex items-start justify-between relative px-2 mb-2">
        <div className="absolute left-8 right-8 top-4 h-0.5 bg-gray-100 -z-10" />
        {activeIndex >= 0 && (
          <div
            className="absolute left-8 top-4 h-0.5 bg-[#4f8f5f] transition-all duration-500 -z-10"
            style={{ width: `${(activeIndex / (stages.length - 1)) * 90}%` }}
          />
        )}
        
        {stages.map((stage, idx) => {
          const isCompleted = idx <= activeIndex
          const isActive = idx === activeIndex

          return (
            <div key={stage.label} className="flex flex-col items-center flex-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#4f8f5f] text-white border-[#4f8f5f] shadow-[0_4px_12px_rgba(79,143,95,0.25)]'
                    : 'bg-white text-gray-400 border-gray-200'
                } ${isActive ? 'ring-4 ring-[#e6f1e7]' : ''}`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <h4 className={`text-[11px] text-center font-extrabold mt-3.5 leading-tight ${
                isActive ? 'text-[#356b46]' : isCompleted ? 'text-gray-700' : 'text-gray-400'
              }`}>
                {stage.label}
              </h4>
              <p className="text-[9px] text-[#6b7280] text-center mt-0.5 max-w-[85px] truncate">
                {stage.desc}
              </p>
            </div>
          )
        })}
      </div>

      {/* Mobile Timeline */}
      <div className="flex md:hidden flex-col gap-6 relative pl-6">
        <div className="absolute left-[11px] top-2.5 bottom-2.5 w-0.5 bg-gray-100" />
        {activeIndex >= 0 && (
          <div
            className="absolute left-[11px] top-2.5 w-0.5 bg-[#4f8f5f] transition-all duration-500"
            style={{ height: `${(activeIndex / (stages.length - 1)) * 90}%` }}
          />
        )}

        {stages.map((stage, idx) => {
          const isCompleted = idx <= activeIndex
          const isActive = idx === activeIndex

          return (
            <div key={stage.label} className="flex items-start gap-4 relative">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] border-2 z-10 transition-all duration-300 shrink-0 ${
                  isCompleted
                    ? 'bg-[#4f8f5f] text-white border-[#4f8f5f] shadow-[0_4px_12px_rgba(79,143,95,0.25)]'
                    : 'bg-white text-gray-400 border-gray-200'
                } ${isActive ? 'ring-4 ring-[#e6f1e7]' : ''}`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <div>
                <h4 className={`text-xs font-bold ${
                  isActive ? 'text-[#356b46]' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {stage.label}
                </h4>
                <p className="text-[10px] text-[#6b7280] mt-0.5">{stage.desc}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function OrderDetails() {
  const { orderId } = useParams()
  const navigate = useNavigate()

  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrderDetails = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await api.orders.getById(orderId)
      if (res.data && res.data.data) {
        const orderData = res.data.data
        const products = (orderData.items || []).map((item) => {
          const p = item.product || {}
          return {
            productId: p._id,
            quantity: item.quantity,
            name: p.name || 'Product',
            price: item.priceAtPurchase || p.price || 0,
            image: p.thumbnail || p.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=360&q=80',
            meta: p.meta || 'Pack',
            brand: p.brand || ''
          }
        })

        let status = 'Processing'
        if (orderData.orderStatus === 'Pending') status = 'Placed'
        else if (orderData.orderStatus === 'Confirmed') status = 'Confirmed'
        else if (orderData.orderStatus === 'Packed') status = 'Packed'
        else if (orderData.orderStatus === 'Shipped') status = 'Shipped'
        else if (orderData.orderStatus === 'OutForDelivery') status = 'Out For Delivery'
        else if (orderData.orderStatus === 'Delivered') status = 'Delivered'
        else if (orderData.orderStatus === 'Cancelled') status = 'Cancelled'

        setOrder({
          id: orderData._id,
          date: orderData.createdAt,
          estimatedDelivery: orderData.estimatedDeliveryTime || 'Delivery details pending',
          status,
          products,
          paymentMethod: orderData.paymentMethod || 'COD',
          paymentStatus: orderData.paymentStatus || 'Pending',
          subtotal: orderData.pricing?.subtotal || (orderData.totalAmount - (orderData.pricing?.tax || 0)),
          discount: orderData.pricing?.discount || 0,
          shipping: orderData.pricing?.deliveryCharge || 0,
          tax: orderData.pricing?.tax || 0,
          total: orderData.totalAmount || 0,
          address: {
            name: orderData.shippingAddress?.fullName || 'Customer',
            phone: orderData.shippingAddress?.phone || '',
            line1: orderData.shippingAddress?.addressLine1 || '',
            line2: orderData.shippingAddress?.addressLine2 || '',
            city: orderData.shippingAddress?.city || '',
            state: orderData.shippingAddress?.state || '',
            pincode: orderData.shippingAddress?.postalCode || ''
          },
          notes: orderData.notes || ''
        })
      }
    } catch (err) {
      console.error('Failed to load order details:', err)
    } finally {
      setIsLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchOrderDetails()
    })
  }, [fetchOrderDetails])

  const handleCancelOrder = async () => {
    if (window.confirm(`Are you sure you want to cancel order ${orderId}?`)) {
      try {
        await api.orders.cancel(orderId, 'User requested cancellation')
        toast.success(`Order ${orderId} has been cancelled.`, {
          icon: '⚠️'
        })
        await fetchOrderDetails()
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to cancel order')
      }
    }
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  const handleDownloadInvoice = () => {
    toast.success('Generating and downloading invoice PDF...')
  }

  if (isLoading) {
    return (
      <div className="home-page">
        <Navbar />
        <main className="products-page min-h-screen flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#4f8f5f]"></div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="home-page">
        <Navbar />
        <main className="products-page min-h-screen flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <FiXCircle size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-500 max-w-sm mb-6">
            We couldn't locate any order matching ID "{orderId}".
          </p>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4f8f5f] hover:bg-[#356b46] text-white font-bold rounded-xl shadow-sm text-sm transition-all"
          >
            <FiArrowLeft /> Back to My Orders
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const formatDate = (isoString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(isoString).toLocaleDateString(undefined, options)
  }

  const mockTxnId = `txn_${order.id.toLowerCase().replace(/-/g, '_')}_ref`

  const getDeliveryPartner = (status) => {
    if (status === 'Delivered') {
      return { name: 'Ramesh Kumar', phone: '+91 98765 43210', status: 'Delivered your order' }
    } else if (status === 'Out For Delivery') {
      return { name: 'Ramesh Kumar', phone: '+91 98765 43210', status: 'En route to your address' }
    }
    return null
  }

  const deliveryPartner = getDeliveryPartner(order.status)

  return (
    <div className="home-page">
      <Navbar />

      <main className="products-page min-h-screen print:p-0 print:m-0 print:bg-white">
        
        {/* Navigation back and header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <button
            onClick={() => navigate('/orders')}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#6b7280] hover:text-[#2f3640] transition-colors"
            type="button"
          >
            <FiArrowLeft /> Back to My Orders
          </button>

          {/* Action Header controls */}
          <div className="flex gap-2.5">
            {(order.status === 'Placed' || order.status === 'Confirmed' || order.status === 'Processing') && (
              <button
                onClick={handleCancelOrder}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200/50 text-red-600 text-xs font-extrabold transition-all"
                type="button"
              >
                <FiXCircle /> Cancel Order
              </button>
            )}
            <button
              onClick={handlePrintReceipt}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#2f3640]/10 hover:bg-[#f9f6f1] text-[#2f3640] text-xs font-extrabold transition-all"
              type="button"
            >
              <FiPrinter /> Print Receipt
            </button>
          </div>
        </div>

        {/* Page title and timestamps */}
        <section className="bg-white border border-[#2f3640]/10 rounded-2xl p-5 shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold text-[#6b7280] uppercase tracking-wider">Order Details</span>
              <StatusBadge status={order.status} />
            </div>
            <h1 className="text-2xl font-black text-[#2f3640] mt-1">{order.id}</h1>
            <p className="text-xs text-[#6b7280] mt-1">Placed on {formatDate(order.date)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-extrabold text-[#6b7280] uppercase tracking-wider">Estimated Delivery</p>
            <strong className="text-lg font-black text-[#4f8f5f] mt-1 block">{order.estimatedDelivery}</strong>
          </div>
        </section>

        {/* Tracking Timeline */}
        <section className="mb-6 print:hidden">
          <OrderTimeline status={order.status} />
        </section>

        {/* Details 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Products, Delivery Address, Partner details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Ordered Products block */}
            <article className="bg-white border border-[#2f3640]/10 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-extrabold text-[#2f3640] uppercase tracking-wider mb-4">Ordered Products</h3>
              <div className="divide-y divide-[#2f3640]/5">
                {order.products.map((item) => (
                  <div key={item.productId} className="flex gap-4 py-4 first:pt-0 last:pb-0 items-center">
                    <Link to={`/products/${item.productId}`} className="shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl border border-[#2f3640]/5 bg-[#f9f6f1] hover:scale-102 transition-transform"
                        loading="lazy"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.productId}`} className="text-sm font-extrabold text-[#2f3640] hover:text-[#4f8f5f] transition-colors leading-snug block">
                        {item.name}
                      </Link>
                      <p className="text-xs text-[#6b7280] mt-1">{item.brand} · {item.meta}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-extrabold text-[#2f3640]">Rs {item.price * item.quantity}</p>
                      <p className="text-xs text-[#6b7280] mt-0.5">Qty: {item.quantity} · Rs {item.price}/unit</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* Delivery address & Notes */}
            <article className="bg-white border border-[#2f3640]/10 rounded-2xl p-5 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-extrabold text-[#6b7280] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FiMapPin /> Delivery Address
                </h4>
                <div className="text-sm text-[#2f3640]">
                  <p className="font-extrabold">{order.address.name}</p>
                  <p className="text-xs font-bold text-[#6b7280] mt-1">{order.address.phone}</p>
                  <p className="mt-2 text-[#6b7280] leading-relaxed">
                    {order.address.line1}<br />
                    {order.address.line2 ? `${order.address.line2}, ` : ''}{order.address.city}<br />
                    {order.address.state} - {order.address.pincode}
                  </p>
                </div>
              </div>

              <div className="border-t md:border-t-0 md:border-l border-[#2f3640]/10 pt-5 md:pt-0 md:pl-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-extrabold text-[#6b7280] uppercase tracking-wider mb-2.5">
                    Delivery Partner
                  </h4>
                  {deliveryPartner ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#e6f1e7] text-[#4f8f5f] rounded-full flex items-center justify-center shrink-0">
                        <FiUser size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-[#2f3640]">{deliveryPartner.name}</p>
                        <p className="text-xs font-bold text-[#4f8f5f]">{deliveryPartner.phone}</p>
                        <p className="text-[10px] text-[#6b7280] mt-0.5">{deliveryPartner.status}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#6b7280] leading-relaxed italic">
                      {order.status === 'Cancelled'
                        ? 'Order was cancelled.'
                        : 'A delivery partner will be assigned once the package is ready for delivery.'}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-[#2f3640]/5">
                  <h4 className="text-xs font-extrabold text-[#6b7280] uppercase tracking-wider mb-1.5">
                    Order Notes
                  </h4>
                  <p className="text-xs text-[#6b7280] leading-relaxed bg-[#f9f6f1] p-2.5 rounded-xl border border-[#2f3640]/5">
                    {order.notes || 'No special delivery instructions provided.'}
                  </p>
                </div>
              </div>
            </article>

          </div>

          {/* RIGHT COLUMN: Billing Summary, Payments details, Receipt actions */}
          <div className="space-y-6">
            
            {/* Billing Summary card */}
            <article className="bg-white border border-[#2f3640]/10 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-extrabold text-[#2f3640] uppercase tracking-wider mb-4">Billing Summary</h3>
              <div className="space-y-3 text-sm text-[#6b7280]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#2f3640]">Rs {order.subtotal}</span>
                </div>
                
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount</span>
                    <span className="font-bold">- Rs {order.discount}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-bold text-[#2f3640]">{order.shipping > 0 ? `Rs ${order.shipping}` : 'Free'}</span>
                </div>
                
                <div className="flex justify-between">
                  <span>Tax (GST)</span>
                  <span className="font-bold text-[#2f3640]">Rs {order.tax}</span>
                </div>

                <div className="pt-3 border-t border-[#2f3640]/10 flex justify-between items-baseline">
                  <span className="font-extrabold text-[#2f3640] text-xs uppercase tracking-wider">Grand Total</span>
                  <strong className="text-xl font-black text-[#4f8f5f]">Rs {order.total}</strong>
                </div>
              </div>
            </article>

            {/* Payment Details card */}
            <article className="bg-white border border-[#2f3640]/10 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-extrabold text-[#2f3640] uppercase tracking-wider mb-4">Payment Info</h3>
              <div className="space-y-3.5 text-xs text-[#6b7280]">
                <div className="flex items-center gap-2">
                  <FiCreditCard size={16} className="text-[#6b7280] shrink-0" />
                  <div>
                    <p className="font-extrabold text-[10px] uppercase tracking-wider text-[#6b7280]">Method</p>
                    <p className="font-bold text-[#2f3640] mt-0.5">{order.paymentMethod}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#2f3640]/5">
                  <FiCalendar size={16} className="text-[#6b7280] shrink-0" />
                  <div>
                    <p className="font-extrabold text-[10px] uppercase tracking-wider text-[#6b7280]">Status</p>
                    <p className={`font-bold mt-0.5 ${order.paymentStatus === 'Paid' || order.paymentStatus === 'Refunded' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {order.paymentStatus}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#2f3640]/5">
                  <FiFileText size={16} className="text-[#6b7280] shrink-0" />
                  <div className="min-w-0">
                    <p className="font-extrabold text-[10px] uppercase tracking-wider text-[#6b7280]">Transaction ID</p>
                    <p className="font-bold text-[#2f3640] mt-0.5 truncate select-all">{mockTxnId}</p>
                  </div>
                </div>
              </div>
            </article>

            {/* Receipts and actions card */}
            <article className="bg-[#fffdf9] border border-[#2f3640]/10 rounded-2xl p-5 shadow-sm print:hidden">
              <h3 className="text-sm font-extrabold text-[#2f3640] uppercase tracking-wider mb-3">Documents</h3>
              <p className="text-xs text-[#6b7280] mb-4 leading-relaxed">
                Need a physical copy? Download or print your order receipt and official tax invoice below.
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                <button
                  onClick={handleDownloadInvoice}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-[#2f3640]/10 hover:bg-[#f9f6f1] text-[#2f3640] font-bold text-xs transition-all"
                  type="button"
                >
                  <FiFileText /> Download Invoice
                </button>
                <button
                  onClick={handlePrintReceipt}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#4f8f5f] hover:bg-[#356b46] text-white font-bold text-xs shadow-sm transition-all"
                  type="button"
                >
                  <FiPrinter /> Print Receipt / Receipt
                </button>
              </div>
            </article>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  )
}

export default OrderDetails
