import { FiArrowLeft, FiShoppingBag } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import useCart from '../hooks/useCart'

function CommerceHeader({ backTo = '/products', backLabel = 'Continue shopping' }) {
  const { items } = useCart()
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <header className="commerce-header">
      <Link className="commerce-brand" to="/">
        <span>QC</span> QuickCart
      </Link>
      <Link className="commerce-back" to={backTo}><FiArrowLeft /> {backLabel}</Link>
      <Link className="commerce-cart-link" to="/cart"><FiShoppingBag /> Cart {itemCount ? `(${itemCount})` : ''}</Link>
    </header>
  )
}

export default CommerceHeader
