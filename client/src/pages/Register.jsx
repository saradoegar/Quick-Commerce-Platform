import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
  FiPhone,
  FiBriefcase,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()

  // Form State
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('customer')
  const [showPassword, setShowPassword] = useState(false)

  // Status and Validation UI State
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Form Input Validations
  const validateForm = () => {
    const newErrors = {}

    // Name Validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    // Email Validation
    if (!email) {
      newErrors.email = 'Email address is required'
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address'
      }
    }

    // Phone Validation
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    // Password Validation
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle Submission (Backend Connected)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await api.auth.register({
        fullName,
        email,
        phone,
        password,
        role,
      })

      const { user: userData, token } = response.data

      // Log user in and save token
      login(userData, token)

      toast.success('Successfully registered and logged in!')
      navigate('/')
    } catch (err) {
      console.error('Registration error:', err)
      
      // Extract specific validation error messages from backend response
      const serverMessage = err.response?.data?.message
      const serverErrors = err.response?.data?.errors
      
      if (serverErrors && serverErrors.length > 0) {
        setSubmitError(serverErrors.join(' | '))
      } else {
        setSubmitError(serverMessage || 'Registration failed. Please try again.')
      }

      toast.error('Registration failed. Please check your credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f9f6f1] font-sans antialiased">
      {/* Back Button floating on top left */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-30 inline-flex items-center gap-2 text-sm font-bold text-[#6b7280] hover:text-[#2f3640] transition-colors bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-[#2f3640]/5"
      >
        <FiArrowLeft /> Back to store
      </Link>

      {/* LEFT COLUMN: Illustration Banner */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#e6f1e7] items-center justify-center">
        {/* Cover Background Image */}
        <img
          src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1200&q=80"
          alt="Grocery bags filled with fresh goods"
          className="absolute inset-0 w-full h-full object-cover brightness-95"
        />
        {/* Soft green overlay */}
        <div className="absolute inset-0 bg-[#4f8f5f]/15 mix-blend-multiply" />
        
        {/* Card Overlay with glassmorphism */}
        <div className="relative z-10 max-w-md p-8 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-white/40 text-center m-6">
          <span className="inline-grid place-items-center w-12 h-11 bg-[#4f8f5f] text-white border-2 border-[#f6b26b]/90 rounded-2xl font-black text-sm shadow-md mb-4">
            QC
          </span>
          <h2 className="text-2xl font-black text-[#2f3640] tracking-tight leading-tight mb-2">
            Welcome to QuickCart
          </h2>
          <p className="text-sm text-[#6b7280] leading-relaxed">
            Get your daily groceries, pantry items, personal care essentials, and cleaning needs delivered directly from our neighborhood warehouses in minutes.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Authentication Form Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          {/* Card Wrapper */}
          <div className="bg-[#fffdf9] border border-[#2f3640]/10 rounded-3xl p-6 sm:p-10 shadow-lg">
            
            {/* Form Header */}
            <div className="text-center mb-8">
              <span className="inline-grid place-items-center w-10 h-9 bg-[#4f8f5f] text-white border-2 border-[#f6b26b]/90 rounded-xl font-black text-xs shadow-md mb-3 lg:hidden">
                QC
              </span>
              <h1 className="text-2xl font-black text-[#2f3640] tracking-tight leading-none mb-2">
                Sign Up
              </h1>
              <p className="text-xs text-[#6b7280] leading-relaxed">
                Create your account to start ordering your essentials.
              </p>
            </div>

            {/* API validation or duplicate email error alert */}
            {submitError && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200/60 rounded-2xl text-xs font-bold text-red-600 leading-relaxed">
                {submitError}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name Input Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="fullName"
                  className="text-xs font-extrabold text-[#2f3640] uppercase tracking-wider block"
                >
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6b7280]">
                    <FiUser size={16} />
                  </span>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Sara Johnson"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }))
                    }}
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#f9f6f1] rounded-xl border ${
                      errors.fullName ? 'border-red-400 focus:ring-red-100' : 'border-transparent focus:ring-[#e6f1e7] focus:border-[#4f8f5f]'
                    } focus:outline-none focus:ring-4 focus:bg-white text-sm transition-all`}
                    required
                  />
                </div>
                {errors.fullName && (
                  <p className="text-[11px] font-bold text-red-500 pl-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email Address Input Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-extrabold text-[#2f3640] uppercase tracking-wider block"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6b7280]">
                    <FiMail size={16} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
                    }}
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#f9f6f1] rounded-xl border ${
                      errors.email ? 'border-red-400 focus:ring-red-100' : 'border-transparent focus:ring-[#e6f1e7] focus:border-[#4f8f5f]'
                    } focus:outline-none focus:ring-4 focus:bg-white text-sm transition-all`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] font-bold text-red-500 pl-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Number Input Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="text-xs font-extrabold text-[#2f3640] uppercase tracking-wider block"
                >
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6b7280]">
                    <FiPhone size={16} />
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91 99999 88888"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }))
                    }}
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-4 py-2.5 bg-[#f9f6f1] rounded-xl border ${
                      errors.phone ? 'border-red-400 focus:ring-red-100' : 'border-transparent focus:ring-[#e6f1e7] focus:border-[#4f8f5f]'
                    } focus:outline-none focus:ring-4 focus:bg-white text-sm transition-all`}
                    required
                  />
                </div>
                {errors.phone && (
                  <p className="text-[11px] font-bold text-red-500 pl-1">{errors.phone}</p>
                )}
              </div>

              {/* Password Input Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="text-xs font-extrabold text-[#2f3640] uppercase tracking-wider block"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6b7280]">
                    <FiLock size={16} />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors((prev) => ({ ...prev, password: '' }))
                    }}
                    disabled={isSubmitting}
                    className={`w-full pl-10 pr-10 py-2.5 bg-[#f9f6f1] rounded-xl border ${
                      errors.password ? 'border-red-400 focus:ring-red-100' : 'border-transparent focus:ring-[#e6f1e7] focus:border-[#4f8f5f]'
                    } focus:outline-none focus:ring-4 focus:bg-white text-sm transition-all`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6b7280] hover:text-[#2f3640] transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] font-bold text-red-500 pl-1">{errors.password}</p>
                )}
              </div>

              {/* Role Selection Dropdown Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="role"
                  className="text-xs font-extrabold text-[#2f3640] uppercase tracking-wider block"
                >
                  Register As
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6b7280]">
                    <FiBriefcase size={16} />
                  </span>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f9f6f1] rounded-xl border border-transparent focus:outline-none focus:ring-4 focus:ring-[#e6f1e7] focus:border-[#4f8f5f] focus:bg-white text-sm transition-all cursor-pointer"
                  >
                    <option value="customer">Customer</option>
                    <option value="warehouse_manager">Warehouse Manager</option>
                    <option value="delivery_partner">Delivery Partner</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 min-h-11 px-4 py-2.5 rounded-xl bg-[#4f8f5f] hover:bg-[#356b46] disabled:bg-[#4f8f5f]/70 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </div>
            </form>

            {/* Footer Routing Link */}
            <div className="text-center mt-6 text-xs text-[#6b7280] font-medium">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-extrabold text-[#4f8f5f] hover:text-[#356b46] transition-colors hover:underline"
              >
                Sign In
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
