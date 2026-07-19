import { useState, useMemo, useEffect } from 'react'
import {
  FiChevronLeft,
  FiChevronRight,
  FiSearch,
  FiSliders,
  FiGrid,
  FiList,
  FiStar,
} from 'react-icons/fi'
import api from '../services/api'
import ProductCard from '../components/ProductCard'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { filterGroups as staticFilterGroups } from '../data/products'
import './Home.css'
import './Products.css'

function ProductCardSkeleton() {
  return (
    <article className="product-card skeleton">
      <div className="product-image-wrap skeleton-anim" style={{ height: '220px' }}></div>
      <div className="product-info">
        <div>
          <div className="skeleton-line skeleton-anim" style={{ width: '40%', height: '11px', marginBottom: '8px' }}></div>
          <div className="skeleton-line skeleton-anim" style={{ width: '80%', height: '18px', marginBottom: '8px' }}></div>
          <div className="skeleton-line skeleton-anim" style={{ width: '55%', height: '13px', marginBottom: '8px' }}></div>
        </div>
        <div className="skeleton-line skeleton-anim" style={{ width: '35%', height: '16px', margin: '4px 0 10px' }}></div>
        <div className="product-footer" style={{ marginTop: 'auto' }}>
          <div className="skeleton-line skeleton-anim" style={{ width: '50%', height: '22px' }}></div>
          <div className="skeleton-line skeleton-anim" style={{ width: '68px', height: '40px', borderRadius: '16px' }}></div>
        </div>
      </div>
    </article>
  )
}

function FilterGroup({ group, checkedOptions, onChange }) {
  const renderOptionLabel = (title, option) => {
    if (title === 'Rating') {
      const starCount = option.startsWith('4') ? 4 : 3
      return (
        <span className="rating-option-label">
          {option}
          <span className="stars-row">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                fill={i < starCount ? "var(--home-orange)" : "none"}
                color={i < starCount ? "var(--home-orange)" : "rgba(47, 54, 64, 0.2)"}
                size={12}
              />
            ))}
          </span>
        </span>
      )
    }
    return <span>{option}</span>
  }

  return (
    <section className="filter-group">
      <h3>{group.title}</h3>
      <div>
        {group.options.map((option) => {
          const isChecked = checkedOptions.includes(option)
          return (
            <label key={option} className="filter-label">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onChange(group.title, option)}
              />
              <span className={isChecked ? 'checked-option-text' : ''}>
                {renderOptionLabel(group.title, option)}
              </span>
            </label>
          )
        })}
      </div>
    </section>
  )
}

function Products() {
  const [categoriesList, setCategoriesList] = useState([])
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const catParam = params.get('category')
    if (catParam) {
      const slugMap = {
        'fruits-vegetables': 'Organic Fruits & Veggies',
        'fruits-veggies': 'Organic Fruits & Veggies',
        'dairy-eggs': 'Dairy & Breakfast',
        'dairy-breakfast': 'Dairy & Breakfast',
        'snacks-drinks': 'Snacks & Drinks',
        'snacks': 'Snacks & Drinks',
        'beverages': 'Snacks & Drinks',
        'household-essentials': 'Home Essentials',
        'home-essentials': 'Home Essentials',
        'cleaning-supplies': 'Home Essentials',
        'personal-care': 'Home Essentials',
      }
      const mapped = slugMap[catParam]
      return mapped ? [mapped] : []
    }
    return []
  })
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedRatings, setSelectedRatings] = useState([])
  const [selectedAvailability, setSelectedAvailability] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('Sort by: Recommended')
  const [viewMode, setViewMode] = useState('grid')
  const [currentPage, setCurrentPage] = useState(1)

  // API state
  const [productsList, setProductsList] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Load categories list on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.categories.getAll()
        if (res.data && res.data.data) {
          setCategoriesList(res.data.data)
        }
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }
    fetchCategories()
  }, [])

  const filterGroups = useMemo(() => {
    const catOptions = categoriesList.length > 0
      ? categoriesList.map((c) => c.name)
      : ['Organic Fruits & Veggies', 'Dairy & Breakfast', 'Snacks & Drinks', 'Home Essentials']
    
    return [
      {
        title: 'Categories',
        options: catOptions,
      },
      ...staticFilterGroups.slice(1)
    ]
  }, [categoriesList])

  // Single effect handler fetching backend products
  useEffect(() => {
    let active = true

    const fetchProductsData = async () => {
      setIsLoading(true)
      try {
        const params = {
          page: currentPage,
          limit: 12
        }

        // 1. Search Query parameter
        if (searchQuery) {
          params.search = searchQuery
        }

        // 2. Category mapping parameter
        if (selectedCategories.length > 0) {
          // If we have selected multiple, let's pass the first one to match backend single string category query
          params.category = selectedCategories[0]
        }

        // 3. Brand parameter
        if (selectedBrands.length > 0) {
          params.brand = selectedBrands[0]
        }

        // 4. Rating parameter
        if (selectedRatings.length > 0) {
          const ratingNum = selectedRatings.some(o => o.startsWith('4')) ? 4 : 3
          params.rating = ratingNum
        }

        // 5. Price Ranges
        if (selectedPriceRanges.length > 0) {
          let minPrice = Infinity
          let maxPrice = -Infinity
          selectedPriceRanges.forEach((range) => {
            if (range === 'Under Rs 50') {
              minPrice = Math.min(minPrice, 0)
              maxPrice = Math.max(maxPrice, 50)
            } else if (range === 'Rs 50 - Rs 150') {
              minPrice = Math.min(minPrice, 50)
              maxPrice = Math.max(maxPrice, 150)
            } else if (range === 'Rs 150 - Rs 300') {
              minPrice = Math.min(minPrice, 150)
              maxPrice = Math.max(maxPrice, 300)
            } else if (range === 'Above Rs 300') {
              minPrice = Math.min(minPrice, 300)
              maxPrice = Math.max(maxPrice, 10000)
            }
          })
          if (minPrice !== Infinity) params.minPrice = minPrice
          if (maxPrice !== -Infinity) params.maxPrice = maxPrice
        }

        // 6. Availability parameters
        selectedAvailability.forEach((opt) => {
          if (opt === 'Express delivery') params.express = true
          if (opt === 'In stock') params.inStock = true
          if (opt === 'Offers available') params.featured = true
        })

        // 7. Sort option
        if (sortBy === 'Price: Low to High') {
          params.sort = 'priceLowToHigh'
        } else if (sortBy === 'Price: High to Low') {
          params.sort = 'priceHighToLow'
        } else if (sortBy === 'Rating') {
          params.sort = 'rating'
        } else {
          params.sort = 'popularity'
        }

        const res = await api.products.getAll(params)

        if (active && res.data) {
          // Format products mapping _id to id so components aren't broken
          const mapped = (res.data.data || []).map((p) => ({
            ...p,
            id: p._id,
            rating: p.rating || 4.5,
            reviewCount: p.reviewCount || 10,
            stock: p.stock > 0 ? 'In stock' : 'Out of stock',
            express: p.express !== false,
            images: p.images || [p.thumbnail],
            specifications: p.specifications || []
          }))
          setProductsList(mapped)
          setTotalItems(res.data.total || mapped.length)
        }
      } catch (err) {
        console.error('Error fetching catalog data:', err)
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    fetchProductsData()

    return () => {
      active = false
    }
  }, [
    selectedCategories,
    selectedBrands,
    selectedRatings,
    selectedPriceRanges,
    selectedAvailability,
    searchQuery,
    sortBy,
    currentPage,
  ])

  const handleCheckboxChange = (filterTitle, option) => {
    setCurrentPage(1)
    switch (filterTitle) {
      case 'Categories':
        setSelectedCategories((prev) =>
          prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
        )
        break
      case 'Price Range':
        setSelectedPriceRanges((prev) =>
          prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
        )
        break
      case 'Brand':
        setSelectedBrands((prev) =>
          prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
        )
        break
      case 'Rating':
        setSelectedRatings((prev) =>
          prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
        )
        break
      case 'Availability':
        setSelectedAvailability((prev) =>
          prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
        )
        break
      default:
        break
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedPriceRanges([])
    setSelectedBrands([])
    setSelectedRatings([])
    setSelectedAvailability([])
    setSearchQuery('')
    setSortBy('Sort by: Recommended')
    setCurrentPage(1)
  }

  const hasActiveFilters = useMemo(() => {
    return (
      selectedCategories.length > 0 ||
      selectedPriceRanges.length > 0 ||
      selectedBrands.length > 0 ||
      selectedRatings.length > 0 ||
      selectedAvailability.length > 0 ||
      searchQuery !== ''
    )
  }, [
    selectedCategories,
    selectedPriceRanges,
    selectedBrands,
    selectedRatings,
    selectedAvailability,
    searchQuery,
  ])

  const getCheckedOptions = (title) => {
    switch (title) {
      case 'Categories':
        return selectedCategories
      case 'Price Range':
        return selectedPriceRanges
      case 'Brand':
        return selectedBrands
      case 'Rating':
        return selectedRatings
      case 'Availability':
        return selectedAvailability
      default:
        return []
    }
  }

  const totalPages = Math.ceil(totalItems / 12)

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  return (
    <div className="home-page">
      <Navbar />

      <main className="products-page">
        <section className="products-header">
          <nav aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Products</span>
          </nav>
          <div>
            <p className="eyebrow">QuickCart catalog</p>
            <h1>Products</h1>
            <p>Browse daily essentials, express items, and weekly restock products.</p>
          </div>
        </section>

        <section className="products-shell">
          <aside className="filters-panel" aria-label="Product filters">
            <div className="filters-title">
              <div className="title-left">
                <FiSliders />
                <h2>Filters</h2>
              </div>
              {hasActiveFilters && (
                <button className="sidebar-clear-btn" onClick={clearFilters} type="button">
                  Clear All
                </button>
              )}
            </div>
            {filterGroups.map((group) => (
              <FilterGroup
                group={group}
                checkedOptions={getCheckedOptions(group.title)}
                onChange={handleCheckboxChange}
                key={group.title}
              />
            ))}
          </aside>

          <div className="products-content">
            <div className="products-toolbar">
              <label className="product-search">
                <FiSearch />
                <input
                  type="search"
                  placeholder="Search products"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </label>
              <div className="toolbar-right">
                <span className="count-span">{totalItems} products</span>
                <select
                  aria-label="Sort products"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option>Sort by: Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                </select>
                <div className="view-toggle">
                  <button
                    className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    type="button"
                    aria-label="Grid view"
                  >
                    <FiGrid />
                  </button>
                  <button
                    className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    type="button"
                    aria-label="List view"
                  >
                    <FiList />
                  </button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className={`catalog-grid ${viewMode === 'list' ? 'list-mode' : ''}`}>
                {Array.from({ length: 12 }).map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
              </div>
            ) : productsList.length > 0 ? (
              <>
                <div className={`catalog-grid ${viewMode === 'list' ? 'list-mode' : ''}`}>
                  {productsList.map((product) => (
                    <ProductCard product={product} key={product.id} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="pagination" aria-label="Products pagination">
                    <button
                      type="button"
                      aria-label="Previous page"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={{ opacity: currentPage === 1 ? 0.4 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                    >
                      <FiChevronLeft />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        className={currentPage === i + 1 ? 'active-page' : ''}
                        type="button"
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      type="button"
                      aria-label="Next page"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={{ opacity: currentPage === totalPages ? 0.4 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                    >
                      <FiChevronRight />
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon-wrap">
                  <FiSearch />
                </div>
                <h2>No products found</h2>
                <p>We couldn't find any items matching your selected filters or search terms. Try clearing them to see all products.</p>
                <button onClick={clearFilters} className="clear-filters-btn" type="button">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Products
