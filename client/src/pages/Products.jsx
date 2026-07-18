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
import ProductCard from '../components/ProductCard'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { products as allProducts, filterGroups } from '../data/products'
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
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const catParam = params.get('category')
    if (catParam) {
      const slugMap = {
        'fruits-vegetables': 'Fruits & Veggies',
        'fruits-veggies': 'Fruits & Veggies',
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

  // API loading simulation state
  const [productsList, setProductsList] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Single effect handler simulation for API integrations
  useEffect(() => {
    let active = true

    const fetchProductsData = async () => {
      setIsLoading(true)
      try {
        // Simulating REST API roundtrip delay
        await new Promise((resolve) => setTimeout(resolve, 300))
        if (!active) return

        let result = [...allProducts]

        // 1. Search Query filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase().trim()
          result = result.filter(
            (p) =>
              p.name.toLowerCase().includes(query) ||
              (p.brand && p.brand.toLowerCase().includes(query)) ||
              p.category.toLowerCase().includes(query)
          )
        }

        // 2. Categories filter
        if (selectedCategories.length > 0) {
          result = result.filter((p) => selectedCategories.includes(p.category))
        }

        // 3. Brands filter
        if (selectedBrands.length > 0) {
          result = result.filter((p) => selectedBrands.includes(p.brand))
        }

        // 4. Rating filter
        if (selectedRatings.length > 0) {
          result = result.filter((p) => {
            const ratingNum = parseFloat(p.rating)
            return selectedRatings.some((option) => {
              if (option === '4 stars & above') return ratingNum >= 4.0
              if (option === '3 stars & above') return ratingNum >= 3.0
              return true
            })
          })
        }

        // 5. Price Range filter
        if (selectedPriceRanges.length > 0) {
          result = result.filter((p) => {
            const price = p.price
            return selectedPriceRanges.some((option) => {
              if (option === 'Under Rs 50') return price < 50
              if (option === 'Rs 50 - Rs 150') return price >= 50 && price <= 150
              if (option === 'Rs 150 - Rs 300') return price >= 150 && price <= 300
              if (option === 'Above Rs 300') return price > 300
              return true
            })
          })
        }

        // 6. Availability filter
        if (selectedAvailability.length > 0) {
          result = result.filter((p) => {
            for (const option of selectedAvailability) {
              if (option === 'Express delivery' && !p.express) return false
              if (option === 'In stock' && p.stock.toLowerCase().includes('out of stock')) return false
              if (option === 'Offers available' && !p.discount) return false
            }
            return true
          })
        }

        // Apply Sorting
        if (sortBy === 'Price: Low to High') {
          result.sort((a, b) => a.price - b.price)
        } else if (sortBy === 'Price: High to Low') {
          result.sort((a, b) => b.price - a.price)
        } else if (sortBy === 'Rating') {
          result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
        }

        const total = result.length
        const startIndex = (currentPage - 1) * 12
        const paginated = result.slice(startIndex, startIndex + 12)

        setProductsList(paginated)
        setTotalItems(total)
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
    setCurrentPage(1) // Reset to page 1 on filter change
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
    setCurrentPage(1) // Reset to page 1
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
