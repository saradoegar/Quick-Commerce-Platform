import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiSearch,
  FiShoppingBag,
  FiFileText,
  FiRefreshCw,
  FiXCircle,
  FiMapPin,
  FiCreditCard,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import useCart from '../hooks/useCart'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../services/api'
import './Home.css'

// Reusable Breadcrumb Component
function Breadcrumb() {
  return (
    <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-[#6b7280]" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-[#356b46] transition-colors">Home</Link>
      <span>/</span>
      <span className="text-[#2f3640]">My Orders</span>
    </nav>
  )
}

// Reusable Status Badge Component
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
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getBadgeClasses(status)}`}>
      {status}
    </span>
  )
}

// Reusable Timeline Component for tracking
function OrderTimeline({ status }) {
  const stages = [
    { label: 'Order Placed', key: 'Placed' },
    { label: 'Confirmed', key: 'Confirmed' },
    { label: 'Packed', key: 'Packed' },
    { label: 'Shipped', key: 'Shipped' },
    { label: 'Out For Delivery', key: 'Out For Delivery' },
    { label: 'Delivered', key: 'Delivered' }
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
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center text-red-700 text-sm font-medium">
        This order has been cancelled.
      </div>
    )
  }

  return (
    <div className="py-4">
      {/* Desktop Timeline */}
      <div className="hidden md:flex items-center justify-between relative px-2">
        <div className="absolute left-6 right-6 top-[15px] h-0.5 bg-gray-200 -z-10" />
        {activeIndex >= 0 && (
          <div
            className="absolute left-6 top-[15px] h-0.5 bg-[#4f8f5f] transition-all duration-500 -z-10"
            style={{ width: `${(activeIndex / (stages.length - 1)) * 90}%` }}
          />
        )}
        
        {stages.map((stage, idx) => {
          const isCompleted = idx <= activeIndex
          const isActive = idx === activeIndex

          return (
            <div key={stage.key} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#4f8f5f] text-white border-[#4f8f5f] shadow-[0_4px_12px_rgba(79,143,95,0.25)]'
                    : 'bg-white text-gray-400 border-gray-200'
                } ${isActive ? 'ring-4 ring-[#e6f1e7]' : ''}`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <span
                className={`text-[10px] text-center font-extrabold mt-1.5 transition-colors duration-300 max-w-[80px] leading-tight ${
                  isActive ? 'text-[#356b46]' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                }`}
              >
                {stage.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Mobile Timeline */}
      <div className="flex md:hidden flex-col gap-5 relative pl-6">
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200" />
        {activeIndex >= 0 && (
          <div
            className="absolute left-[11px] top-2 w-0.5 bg-[#4f8f5f] transition-all duration-500"
            style={{ height: `${(activeIndex / (stages.length - 1)) * 90}%` }}
          />
        )}

        {stages.map((stage, idx) => {
          const isCompleted = idx <= activeIndex
          const isActive = idx === activeIndex

          return (
            <div key={stage.key} className="flex items-center gap-3 relative">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] border-2 z-10 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#4f8f5f] text-white border-[#4f8f5f] shadow-[0_4px_12px_rgba(79,143,95,0.25)]'
                    : 'bg-white text-gray-400 border-gray-200'
                } ${isActive ? 'ring-4 ring-[#e6f1e7]' : ''}`}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <span
                className={`text-xs font-bold transition-colors duration-300 ${
                  isActive ? 'text-[#356b46]' : isCompleted ? 'text-gray-700' : 'text-gray-400'
                }`}
              >
                {stage.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Reusable Empty State Component
function EmptyOrders({ onReset }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-[#fffdf9] rounded-2xl border border-dashed border-[#2f3640]/10 shadow-sm p-8 max-w-2xl mx-auto">
      <div className="w-16 h-16 bg-[#e6f1e7] text-[#4f8f5f] rounded-full flex items-center justify-center mb-5 shadow-sm">
        <FiShoppingBag size={28} />
      </div>
      <h2 className="text-xl font-extrabold text-[#2f3640] mb-2">No Orders Found</h2>
      <p className="text-[#6b7280] max-w-md mb-6 text-sm leading-relaxed">
        You haven't placed any orders yet, or no orders match your search and filter criteria.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={onReset}
          className="px-6 py-2.5 bg-white border border-[#2f3640]/10 hover:bg-[#f9f6f1] text-[#2f3640] font-bold rounded-xl shadow-sm text-sm transition-all"
        >
          Clear Filters
        </button>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4f8f5f] hover:bg-[#356b46] text-white font-bold rounded-xl shadow-sm text-sm transition-all"
        >
          Continue Shopping <FiArrowRight />
        </Link>
      </div>
    </div>
  )
}

function Orders() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [trackingOpen, setTrackingOpen] = useState({})

  const { addToCart } = useCart()

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.orders.getAll()
      if (res.data && res.data.data) {
        const mapped = res.data.data.map((order) => {
          const products = (order.items || []).map((item) => {
            const p = item.product || {}
            return {
              productId: p._id,
              quantity: item.quantity,
              name: p.name || 'Product',
              price: item.priceAtPurchase || p.price || 0,
              image: p.thumbnail || p.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=360&q=80',
              meta: p.meta || 'Pack'
            }
          })

          let status = 'Processing'
          if (order.orderStatus === 'Pending') status = 'Placed'
          else if (order.orderStatus === 'Confirmed') status = 'Confirmed'
          else if (order.orderStatus === 'Packed') status = 'Packed'
          else if (order.orderStatus === 'Shipped') status = 'Shipped'
          else if (order.orderStatus === 'OutForDelivery') status = 'Out For Delivery'
          else if (order.orderStatus === 'Delivered') status = 'Delivered'
          else if (order.orderStatus === 'Cancelled') status = 'Cancelled'

          return {
            id: order._id,
            date: order.createdAt,
            estimatedDelivery: order.estimatedDeliveryTime || 'Delivery details pending',
            status,
            products,
            paymentMethod: order.paymentMethod || 'COD',
            paymentStatus: order.paymentStatus || 'Pending',
            total: order.totalAmount || 0,
            address: {
              name: order.shippingAddress?.fullName || 'Customer',
              line1: order.shippingAddress?.addressLine1 || '',
              city: order.shippingAddress?.city || ''
            }
          }
        })
        setOrders(mapped)
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchOrders()
    })
  }, [fetchOrders])

  const handleCancelOrder = async (orderId) => {
    if (window.confirm(`Are you sure you want to cancel order ${orderId}?`)) {
      try {
        await api.orders.cancel(orderId, 'User cancelled order')
        toast.success(`Order ${orderId} has been successfully cancelled.`, {
          icon: '⚠️'
        })
        await fetchOrders()
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to cancel order')
      }
    }
  }

  const handleReorder = (order) => {
    let addCount = 0
    order.products.forEach((item) => {
      if (item.productId) {
        addToCart(item.productId, item.quantity)
        addCount += item.quantity
      }
    })
    toast.success(`Added ${addCount} items from order ${order.id} to your basket!`)
  }

  const handleDownloadInvoice = (orderId) => {
    toast.success(`Generating invoice for ${orderId}...`)
    setTimeout(() => {
      toast.success(`Invoice ${orderId}.pdf downloaded successfully!`)
    }, 800)
  }

  const toggleTracking = (orderId) => {
    setTrackingOpen((prev) => ({
      ...prev,
      [orderId]: !prev[orderId]
    }))
  }

  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('All')
    setSortBy('newest')
  }

  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter((order) => {
        const matchesId = order.id.toLowerCase().includes(query)
        const matchesProducts = order.products.some((item) =>
          item.name.toLowerCase().includes(query)
        )
        return matchesId || matchesProducts
      })
    }

    if (statusFilter !== 'All') {
      result = result.filter((order) => order.status === statusFilter)
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (sortBy === 'price-low') {
      result.sort((a, b) => a.total - b.total)
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.total - a.total)
    }

    return result
  }, [orders, searchQuery, statusFilter, sortBy])

  const formatDate = (isoString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(isoString).toLocaleDateString(undefined, options)
  }

  return (
    <div className="home-page">
      <Navbar />

      <main className="products-page min-h-screen">
        <Breadcrumb />

        {/* Page Header */}
        <section className="mb-8">
          <p className="eyebrow">Purchase History</p>
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <h1 className="text-3xl font-extrabold text-[#2f3640]">My Orders</h1>
            <span className="text-sm font-bold text-[#6b7280]">
              Showing {filteredAndSortedOrders.length} of {orders.length} orders
            </span>
          </div>
        </section>

        {/* Toolbar Filters & Search */}
        <section className="bg-white border border-[#2f3640]/10 rounded-2xl p-4 shadow-sm mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6b7280]">
              <FiSearch size={18} />
            </span>
            <input
              type="search"
              placeholder="Search by order ID or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f9f6f1] rounded-xl border border-transparent focus:outline-none focus:ring-2 focus:ring-[#4f8f5f] focus:bg-white text-sm transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            <div className="flex items-center gap-2">
              <label htmlFor="status-filter" className="text-xs font-extrabold text-[#2f3640] uppercase tracking-wider">Status:</label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="min-h-10 border border-[#2f3640]/10 rounded-xl px-3 bg-white text-sm font-bold text-[#2f3640] outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Processing">Processing</option>
                <option value="Packed">Packed</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs font-extrabold text-[#2f3640] uppercase tracking-wider">Sort:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="min-h-10 border border-[#2f3640]/10 rounded-xl px-3 bg-white text-sm font-bold text-[#2f3640] outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </section>

        {/* Orders Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#4f8f5f]"></div>
          </div>
        ) : filteredAndSortedOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredAndSortedOrders.map((order) => (
              <article key={order.id} className="bg-white border border-[#2f3640]/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                
                {/* Card Header Info */}
                <div className="bg-[#fffdf9] border-b border-[#2f3640]/10 p-4 sm:p-5 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#6b7280]">Order ID</p>
                      <Link to={`/orders/${order.id}`} className="text-sm font-extrabold text-[#4f8f5f] hover:text-[#356b46] transition-colors hover:underline">
                        {order.id}
                      </Link>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#6b7280]">Date Placed</p>
                      <p className="text-sm font-bold text-[#2f3640]">{formatDate(order.date)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#6b7280]">Expected Delivery</p>
                      <p className="text-sm font-bold text-[#2f3640]">{order.estimatedDelivery}</p>
                    </div>
                  </div>
                  <div>
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Card Main Body */}
                <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Column 1: Items list */}
                  <div className="lg:col-span-2 space-y-4">
                    <p className="text-xs font-extrabold text-[#6b7280] uppercase tracking-wider mb-2">Items</p>
                    <div className="divide-y divide-[#2f3640]/5 max-h-56 overflow-y-auto pr-2">
                      {order.products.map((item) => (
                        <div key={item.productId} className="flex gap-4 py-3 first:pt-0 last:pb-0 items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-cover rounded-xl border border-[#2f3640]/5 bg-[#f9f6f1]"
                            loading="lazy"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-[#2f3640] truncate">{item.name}</h4>
                            <p className="text-xs text-[#6b7280] mt-0.5">{item.meta} × {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-[#2f3640]">Rs {item.price * item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Order summaries */}
                  <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-[#2f3640]/10 lg:pl-6 pt-5 lg:pt-0 flex flex-col justify-between">
                    <div className="space-y-3.5 text-sm">
                      <div className="flex items-start gap-2">
                        <FiMapPin className="text-[#6b7280] mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[10px] font-extrabold text-[#6b7280] uppercase tracking-wider">Ship To</p>
                          <p className="font-bold text-[#2f3640]">{order.address.name}</p>
                          <p className="text-xs text-[#6b7280] mt-0.5 leading-relaxed truncate max-w-[200px]">
                            {order.address.line1}, {order.address.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <FiCreditCard className="text-[#6b7280] shrink-0" />
                        <div>
                          <p className="text-[10px] font-extrabold text-[#6b7280] uppercase tracking-wider">Payment</p>
                          <p className="text-xs font-bold text-[#2f3640]">
                            {order.paymentMethod} · <span className={order.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}>{order.paymentStatus}</span>
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-[#2f3640]/5 flex items-baseline justify-between">
                        <span className="text-xs font-extrabold text-[#2f3640] uppercase tracking-wider">Grand Total</span>
                        <strong className="text-lg font-black text-[#4f8f5f]">Rs {order.total}</strong>
                      </div>
                    </div>

                    <div className="mt-5">
                      <button
                        onClick={() => toggleTracking(order.id)}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#f9f6f1] hover:bg-[#e6f1e7] text-[#4f8f5f] hover:text-[#356b46] font-bold text-xs transition-all border border-transparent hover:border-[#4f8f5f]/10"
                        type="button"
                      >
                        {trackingOpen[order.id] ? (
                          <>
                            Hide Tracking <FiChevronUp />
                          </>
                        ) : (
                          <>
                            Track Order <FiChevronDown />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collapsible Timeline Area */}
                {trackingOpen[order.id] && (
                  <div className="bg-[#f9f6f1]/40 border-t border-[#2f3640]/5 p-5">
                    <p className="text-xs font-extrabold text-[#6b7280] uppercase tracking-wider mb-3">Live Order Progress</p>
                    <OrderTimeline status={order.status} />
                  </div>
                )}

                {/* Bottom Action Footer Row */}
                <div className="bg-[#fffdf9]/50 border-t border-[#2f3640]/5 px-4 sm:px-5 py-4 flex flex-wrap gap-2.5 justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#2f3640]/10 hover:bg-[#f9f6f1] text-[#2f3640] text-xs font-extrabold transition-all"
                    >
                      <FiFileText /> View Details
                    </Link>

                    <button
                      onClick={() => handleDownloadInvoice(order.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#2f3640]/10 hover:bg-[#f9f6f1] text-[#2f3640] text-xs font-extrabold transition-all"
                      type="button"
                    >
                      Invoice
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(order.status === 'Placed' || order.status === 'Confirmed' || order.status === 'Processing') && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-extrabold transition-all border border-red-200/50"
                        type="button"
                      >
                        <FiXCircle /> Cancel Order
                      </button>
                    )}

                    <button
                      onClick={() => handleReorder(order)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4f8f5f] hover:bg-[#356b46] text-white text-xs font-extrabold shadow-sm transition-all"
                      type="button"
                    >
                      <FiRefreshCw /> Reorder
                    </button>
                  </div>
                </div>

              </article>
            ))}
          </div>
        ) : (
          <EmptyOrders onReset={clearFilters} />
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Orders
