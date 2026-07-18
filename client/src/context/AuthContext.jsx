import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for saved session on mount
    const checkSession = () => {
      try {
        const saved = localStorage.getItem('quickcart_session')
        if (saved) {
          setUser(JSON.parse(saved))
        }
      } catch (err) {
        console.error('Failed to parse saved auth session:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    // Simulate minor delay to look premium/authentic
    const timer = setTimeout(checkSession, 300)
    return () => clearTimeout(timer)
  }, [])

  const login = (email, name = 'Sara Johnson') => {
    const sessionData = { email, name, isLoggedIn: true }
    setUser(sessionData)
    localStorage.setItem('quickcart_session', JSON.stringify(sessionData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('quickcart_session')
    localStorage.removeItem('quickcart_orders') // Clear mock session orders if needed
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
