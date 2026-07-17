import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CommerceHeader from '../components/CommerceHeader'
import { fetchMyOrders } from '../store/ordersSlice'
import './commerce.css'

function Orders() {
  const dispatch = useDispatch()
  const { items, status, error } = useSelector((state) => state.orders)
  useEffect(() => { dispatch(fetchMyOrders()) }, [dispatch])
  return <div className="commerce-page"><CommerceHeader backTo="/" backLabel="Back to home" /><main className="commerce-container"><div className="page-title"><div><p className="commerce-eyebrow">Order history</p><h1>Your orders</h1></div></div>{status === 'loading' && <p>Loading orders…</p>}{error && <p className="form-error">{error}</p>}{status === 'succeeded' && !items.length && <p>You have not placed an order yet.</p>}<div className="orders-list">{items.map((order) => <article className="checkout-card" key={order._id}><div className="checkout-item"><strong>Order #{order._id.slice(-6)}</strong><span>{new Date(order.createdAt).toLocaleDateString()}</span></div><p>{order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</p><div className="checkout-item"><span>Status: <strong>{order.status}</strong> · Payment: <strong>{order.paymentStatus}</strong></span><strong>Rs {order.pricing.total}</strong></div></article>)}</div></main></div>
}

export default Orders
