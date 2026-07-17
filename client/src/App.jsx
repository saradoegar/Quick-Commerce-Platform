import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
      <Toaster position="top-right" />
    </>
  )
}

export default App
