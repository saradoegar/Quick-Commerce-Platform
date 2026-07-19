import { useMemo, useState, useEffect, useCallback } from 'react'
import api from '../services/api'
import CartContext from './cartState'
import { useAuth } from './AuthContext'

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [deliveryCharge, setDeliveryCharge] = useState(0)
  const [tax, setTax] = useState(0)
  const [total, setTotal] = useState(0)
  const [coupon, setCoupon] = useState('')

  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem('quickcart_token')
    if (!token) {
      setItems([])
      setSubtotal(0)
      setDiscount(0)
      setDeliveryCharge(0)
      setTax(0)
      setTotal(0)
      return
    }
    try {
      const res = await api.cart.get()
      if (res.data && res.data.data) {
        const cart = res.data.data
        const formattedItems = (cart.items || []).map((item) => {
          const product = item.product
            ? {
                ...item.product,
                id: item.product._id,
                images: item.product.images?.length ? item.product.images : [item.product.thumbnail].filter(Boolean),
              }
            : item.product

          return {
            ...item,
            product,
            productId: product?._id,
          }
        })
        setItems(formattedItems)
        setSubtotal(cart.subtotal || 0)
        setDiscount(cart.discount || 0)
        setDeliveryCharge(cart.deliveryCharge || 0)
        setTax(cart.tax || 0)
        setTotal(cart.total || 0)
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err)
    }
  }, [])

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchCart()
    })
  }, [user, fetchCart])

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      await api.cart.add(productId, quantity)
      await fetchCart()
    } catch (err) {
      console.error('Failed to add to cart:', err)
    }
  }, [fetchCart])

  const updateQuantity = useCallback(async (productId, quantity) => {
    try {
      if (quantity < 1) {
        await api.cart.remove(productId)
      } else {
        await api.cart.updateQuantity(productId, quantity)
      }
      await fetchCart()
    } catch (err) {
      console.error('Failed to update quantity:', err)
    }
  }, [fetchCart])

  const removeFromCart = useCallback(async (productId) => {
    try {
      await api.cart.remove(productId)
      await fetchCart()
    } catch (err) {
      console.error('Failed to remove item:', err)
    }
  }, [fetchCart])

  const clearCart = useCallback(async () => {
    try {
      await api.cart.clear()
      await fetchCart()
    } catch (err) {
      console.error('Failed to clear cart:', err)
    }
  }, [fetchCart])

  const value = useMemo(
    () => ({
      items, addToCart, updateQuantity, removeFromCart, clearCart, coupon, setCoupon,
      subtotal, discount, deliveryCharge, tax, total, refreshCart: fetchCart,
    }),
    [items, addToCart, updateQuantity, removeFromCart, clearCart, coupon, subtotal, discount, deliveryCharge, tax, total, fetchCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
