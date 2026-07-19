import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verify session token on mount
    const checkSession = async () => {
      const token = localStorage.getItem('quickcart_token')
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const response = await api.auth.getMe()
        if (response.data && response.data.user) {
          setUser(response.data.user)
        }
      } catch (err) {
        console.error('Session verification failed:', err)
        localStorage.removeItem('quickcart_token')
      } finally {
        setIsLoading(false)
      }
    }
    
    checkSession()
  }, [])

  const login = (userData, token) => {
    setUser(userData)
    localStorage.setItem('quickcart_token', token)
  }

  const logout = async () => {
    try {
      await api.auth.logout()
    } catch (err) {
      console.error('API logout failed:', err)
    } finally {
      setUser(null)
      localStorage.removeItem('quickcart_token')
      localStorage.removeItem('quickcart_orders')
    }
  }

  const value = useMemo(
    () => ({ user, isLoading, login, logout }),
    [user, isLoading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
