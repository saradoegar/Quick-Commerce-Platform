import { Link } from 'react-router-dom'
import { FiUser, FiMail, FiPhone, FiMapPin, FiHeart, FiShoppingBag, FiLogOut } from 'react-icons/fi'
import FeatureNav from '../components/FeatureNav'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import './Home.css'
import './UserFeatures.css'

function Profile() {
  const { user, logout } = useAuth()
  const { wishlist } = useWishlist()

  return (
    <div className="feature-shell min-h-screen bg-[#f9f6f1]">
      <FeatureNav />
      
      <section className="feature-hero">
        <div>
          <p className="eyebrow">
            <FiUser />
            My Account
          </p>
          <h1>Welcome, {user?.name || 'Customer'}!</h1>
          <p>
            Manage your personal credentials, address book, view order summaries, and wishlist status.
          </p>
        </div>
      </section>

      <main className="feature-section max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* User Info Details Card */}
          <article className="bg-[#fffdf9] border border-[#2f3640]/10 rounded-3xl p-6 shadow-sm md:col-span-2 space-y-4">
            <h2 className="text-lg font-black text-[#2f3640] border-b border-[#2f3640]/5 pb-3">
              Profile Details
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-[#e6f1e7] text-[#4f8f5f] flex items-center justify-center shrink-0">
                  <FiUser size={18} />
                </span>
                <div>
                  <p className="text-[10px] font-extrabold text-[#6b7280] uppercase tracking-wider">Full Name</p>
                  <p className="font-bold text-sm text-[#2f3640]">{user?.name || 'Sara Johnson'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <span className="w-9 h-9 rounded-xl bg-[#e6f1e7] text-[#4f8f5f] flex items-center justify-center shrink-0">
                  <FiMail size={18} />
                </span>
                <div>
                  <p className="text-[10px] font-extrabold text-[#6b7280] uppercase tracking-wider">Email Address</p>
                  <p className="font-bold text-sm text-[#2f3640]">{user?.email || 'sara@example.com'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <span className="w-9 h-9 rounded-xl bg-[#e6f1e7] text-[#4f8f5f] flex items-center justify-center shrink-0">
                  <FiPhone size={18} />
                </span>
                <div>
                  <p className="text-[10px] font-extrabold text-[#6b7280] uppercase tracking-wider">Mobile Number</p>
                  <p className="font-bold text-sm text-[#2f3640]">+91 98765 43210</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-[#2f3640]/5 flex justify-end">
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs transition-colors border border-red-200/50"
                type="button"
              >
                <FiLogOut /> Log Out Account
              </button>
            </div>
          </article>

          {/* Quick Stats Column */}
          <div className="space-y-4">
            
            {/* Wishlist Link Card */}
            <Link
              to="/wishlist"
              className="block bg-white hover:bg-[#fffdf9] border border-[#2f3640]/10 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-[#e6f1e7] text-[#4f8f5f] flex items-center justify-center shrink-0">
                    <FiHeart size={18} />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-[#2f3640]">My Wishlist</h3>
                    <p className="text-[10px] text-[#6b7280] mt-0.5">{wishlist.length} saved favorites</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Addresses Link Card */}
            <Link
              to="/addresses"
              className="block bg-white hover:bg-[#fffdf9] border border-[#2f3640]/10 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-[#e6f1e7] text-[#4f8f5f] flex items-center justify-center shrink-0">
                    <FiMapPin size={18} />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-[#2f3640]">Address Book</h3>
                    <p className="text-[10px] text-[#6b7280] mt-0.5">Manage delivery routes</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Orders Link Card */}
            <Link
              to="/orders"
              className="block bg-white hover:bg-[#fffdf9] border border-[#2f3640]/10 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-[#e6f1e7] text-[#4f8f5f] flex items-center justify-center shrink-0">
                    <FiShoppingBag size={18} />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-[#2f3640]">Order History</h3>
                    <p className="text-[10px] text-[#6b7280] mt-0.5">Track packages & timelines</p>
                  </div>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
