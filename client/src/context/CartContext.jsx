import { useMemo, useState } from 'react'
import { defaultProduct, getProductById } from '../data/products'
import CartContext from './cartState'

const DELIVERY_CHARGE = 25
const FREE_DELIVERY_AT = 199
const TAX_RATE = 0.05

export function CartProvider({ children }) {
  const [items, setItems] = useState([{ productId: defaultProduct.id, quantity: 1 }])
  const [coupon, setCoupon] = useState('')

  const cartItems = items
    .map((item) => ({ ...item, product: getProductById(item.productId) }))
    .filter((item) => item.product)

  const addToCart = (productId, quantity = 1) => {
    setItems((currentItems) => {
      const currentItem = currentItems.find((item) => item.productId === productId)
      if (currentItem) {
        return currentItems.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...currentItems, { productId, quantity }]
    })
  }

  const updateQuantity = (productId, quantity) => {
    setItems((currentItems) =>
      quantity < 1
        ? currentItems.filter((item) => item.productId !== productId)
        : currentItems.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    )
  }

  const removeFromCart = (productId) => {
    setItems((currentItems) => currentItems.filter((item) => item.productId !== productId))
  }

  const clearCart = () => setItems([])
  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
  const discount = coupon.toUpperCase() === 'QUICK10' ? Math.min(10, subtotal) : 0
  const deliveryCharge = subtotal === 0 || subtotal >= FREE_DELIVERY_AT ? 0 : DELIVERY_CHARGE
  const tax = Math.round((subtotal - discount) * TAX_RATE)
  const total = subtotal - discount + deliveryCharge + tax

  const value = useMemo(
    () => ({
      items: cartItems, addToCart, updateQuantity, removeFromCart, clearCart, coupon, setCoupon,
      subtotal, discount, deliveryCharge, tax, total,
    }),
    [cartItems, coupon, subtotal, discount, deliveryCharge, tax, total],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
