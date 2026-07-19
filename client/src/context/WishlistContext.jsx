import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { user } = useAuth()
  const [wishlist, setWishlist] = useState([])

  const fetchWishlist = useCallback(async () => {
    const token = localStorage.getItem('quickcart_token')
    if (!token) {
      setWishlist([])
      return
    }
    try {
      const res = await api.wishlist.get()
      if (res.data && res.data.data) {
        const products = (res.data.data.products || []).map((product) => {
          if (product) {
            product.id = product._id
          }
          return product
        }).filter(Boolean)
        setWishlist(products)
      }
    } catch (err) {
      console.error('Failed to fetch wishlist:', err)
    }
  }, [])

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchWishlist()
    })
  }, [user, fetchWishlist])

  const addToWishlist = useCallback(async (product) => {
    try {
      const productId = product._id || product.id
      await api.wishlist.add(productId)
      await fetchWishlist()
    } catch (err) {
      console.error('Failed to add to wishlist:', err)
    }
  }, [fetchWishlist])

  const removeFromWishlist = useCallback(async (productId) => {
    try {
      await api.wishlist.remove(productId)
      await fetchWishlist()
    } catch (err) {
      console.error('Failed to remove from wishlist:', err)
    }
  }, [fetchWishlist])

  const isInWishlist = useCallback((productId) => {
    return wishlist.some((item) => (item._id === productId || item.id === productId))
  }, [wishlist])

  const value = useMemo(
    () => ({ wishlist, addToWishlist, removeFromWishlist, isInWishlist, refreshWishlist: fetchWishlist }),
    [wishlist, addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist]
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

export default WishlistContext
