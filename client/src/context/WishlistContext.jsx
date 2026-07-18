import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { wishlistProducts as initialWishlist } from '../data/wishlist'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('quickcart_wishlist')
      return saved ? JSON.parse(saved) : initialWishlist
    } catch (err) {
      console.error('Failed to parse wishlist from local storage:', err)
      return initialWishlist
    }
  })

  useEffect(() => {
    localStorage.setItem('quickcart_wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = useCallback((product) => {
    setWishlist((current) => {
      if (current.some((item) => item.id === product.id)) {
        return current; // already exists
      }
      return [...current, product];
    })
  }, [])

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((current) => current.filter((item) => item.id !== productId))
  }, [])

  const isInWishlist = useCallback((productId) => {
    return wishlist.some((item) => item.id === productId)
  }, [wishlist])

  const value = useMemo(
    () => ({ wishlist, addToWishlist, removeFromWishlist, isInWishlist }),
    [wishlist, addToWishlist, removeFromWishlist, isInWishlist]
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
