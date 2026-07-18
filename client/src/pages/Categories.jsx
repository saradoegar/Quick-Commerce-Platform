import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiArrowRight, FiGrid } from 'react-icons/fi'
import { categories } from '../data/categories'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Home.css'
import './Products.css'

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return categories
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(query) ||
        cat.description.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const featuredCategories = useMemo(() => {
    return filteredCategories.filter((cat) => cat.featured)
  }, [filteredCategories])

  const nonFeaturedCategories = useMemo(() => {
    return filteredCategories.filter((cat) => !cat.featured)
  }, [filteredCategories])

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  return (
    <div className="home-page">
      <Navbar />

      <main className="products-page min-h-screen pb-16">
        {/* Breadcrumb & Header */}
        <section className="products-header pb-6">
          <nav aria-label="Breadcrumb" className="mb-4">
            <Link to="/">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="font-semibold text-[#2c3e50]">Categories</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="eyebrow uppercase tracking-wider text-xs font-semibold text-emerald-600 mb-1">
                Explore Departments
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
                Categories
              </h1>
              <p className="text-gray-500 mt-1">
                Browse our curated selection of fresh everyday essentials and home products.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <label htmlFor="category-search" className="sr-only">
                Search Categories
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FiSearch size={18} />
              </div>
              <input
                id="category-search"
                type="search"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm text-sm transition-all"
              />
            </div>
          </div>
        </section>

        <div className="commerce-container px-4 md:px-8 max-w-7xl mx-auto mt-8">
          {filteredCategories.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm p-8">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <FiGrid size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">No Categories Found</h2>
              <p className="text-gray-500 max-w-md mb-6">
                We couldn't find any category matching "{searchQuery}". Try revising your search query or clear the filter.
              </p>
              <button
                onClick={handleClearSearch}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-xl shadow-sm transition-all"
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Section */}
              {featuredCategories.length > 0 && (
                <section aria-labelledby="featured-heading">
                  <div className="flex items-center justify-between mb-6">
                    <h2
                      id="featured-heading"
                      className="text-xl md:text-2xl font-extrabold text-gray-800"
                    >
                      Featured Categories
                    </h2>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Handpicked
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredCategories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/products?category=${category.slug}`}
                        className="group flex flex-col bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                      >
                        <div className="h-44 w-full overflow-hidden relative">
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm text-xs font-semibold text-emerald-700">
                            {category.productCount} Items
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors mb-2">
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                              {category.description}
                            </p>
                          </div>
                          <div className="flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                            <span>Explore Dept</span>
                            <FiArrowRight className="ml-1.5" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* All Categories Grid */}
              <section aria-labelledby="all-heading">
                <h2
                  id="all-heading"
                  className="text-xl md:text-2xl font-extrabold text-gray-800 mb-6"
                >
                  {searchQuery ? 'Search Results' : 'All Categories'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(searchQuery ? filteredCategories : nonFeaturedCategories).map((category) => (
                    <Link
                      key={category.id}
                      to={`/products?category=${category.slug}`}
                      className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                      <div className="h-40 w-full overflow-hidden relative">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full shadow-sm text-xs font-medium text-gray-700">
                          {category.productCount} Items
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-base font-bold text-gray-800 group-hover:text-emerald-600 transition-colors mb-1.5">
                            {category.name}
                          </h3>
                          <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                            {category.description}
                          </p>
                        </div>
                        <div className="flex items-center text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                          <span>Browse Products</span>
                          <FiArrowRight className="ml-1" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
