import {
  FiArrowRight,
  FiClock,
  FiHome,
  FiMapPin,
  FiMenu,
  FiPackage,
  FiSearch,
  FiShoppingBag,
  FiTruck,
  FiUser,
} from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import './Home.css'

const categories = [
  {
    name: 'Fruits & Veggies',
    detail: 'Fresh picks for daily meals',
    accent: '#E8F1D9',
    image:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=360&q=80',
  },
  {
    name: 'Dairy & Breakfast',
    detail: 'Milk, curd, eggs, and breads',
    accent: '#F3E9DC',
    image:
      'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=360&q=80',
  },
  {
    name: 'Snacks & Drinks',
    detail: 'Tea-time bites and beverages',
    accent: '#F9E4C8',
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=360&q=80',
  },
  {
    name: 'Home Essentials',
    detail: 'Cleaning, personal care, and more',
    accent: '#E6F1E7',
    image:
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=360&q=80',
  },
]

const products = [
  {
    name: 'Amul Taaza Milk',
    meta: '500 ml',
    price: 'Rs 28',
    express: true,
    image:
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=360&q=80',
  },
  {
    name: 'Banana Robusta',
    meta: '6 pieces',
    price: 'Rs 48',
    express: true,
    image:
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=360&q=80',
  },
  {
    name: 'Aashirvaad Atta',
    meta: '5 kg pack',
    price: 'Rs 245',
    express: false,
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=360&q=80',
  },
  {
    name: 'Surf Excel Liquid',
    meta: '1 litre',
    price: 'Rs 199',
    express: true,
    image:
      'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=360&q=80',
  },
]

const roles = [
  {
    icon: <FiUser />,
    title: 'Customer',
    text: 'Search products, place orders, track delivery, manage addresses.',
    href: '/login',
  },
  {
    icon: <FiHome />,
    title: 'Warehouse Manager',
    text: 'Review inventory, process orders, pack items, update stock.',
    href: '/login',
  },
  {
    icon: <FiTruck />,
    title: 'Delivery Partner',
    text: 'Accept delivery requests, update status, view assigned orders.',
    href: '/login',
  },
]

const benefits = [
  {
    icon: <FiClock />,
    title: 'Minimum-time delivery',
    text: 'Fast-moving essentials are routed from the nearest active warehouse.',
  },
  {
    icon: <FiPackage />,
    title: 'Wide daily catalog',
    text: 'Groceries, snacks, personal care, household supplies, and more in one place.',
  },
  {
    icon: <FiTruck />,
    title: 'Order visibility',
    text: 'Customers and teams can follow order progress from packing to delivery.',
  },
]

function Navbar() {
  return (
    <header className="home-nav">
      <a className="brand" href="/">
        <span className="brand-mark">QC</span>
        QuickCart
      </a>

      <nav className="nav-links" aria-label="Primary navigation">
        <a href="/">Home</a>
        <a href="/products">Products</a>
        <a href="/categories">Categories</a>
        <a href="#roles">Roles</a>
        <a href="/orders">Orders</a>
      </nav>

      <div className="nav-actions">
        <button className="icon-button" type="button" aria-label="Search">
          <FiSearch />
        </button>
        <a className="cart-button" href="/cart">
          <FiShoppingBag />
          Cart
        </a>
        <a className="login-button" href="/login">
          Login
        </a>
        <button className="menu-button" type="button" aria-label="Open menu">
          <FiMenu />
        </button>
      </div>
    </header>
  )
}

function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="section-header">
      <div>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action ? (
        <a className="section-action" href={action.href}>
          {action.label}
          <FiArrowRight />
        </a>
      ) : null}
    </div>
  )
}

function CategoryCard({ category }) {
  return (
    <a className="category-card" href="/categories">
      <div className="category-image" style={{ backgroundColor: category.accent }}>
        <img src={category.image} alt="" loading="lazy" />
      </div>
      <div>
        <h3>{category.name}</h3>
        <p>{category.detail}</p>
      </div>
    </a>
  )
}

function PromoBanner() {
  return (
    <section className="promo-banner" aria-label="Weekly grocery offer">
      <div>
        <p className="eyebrow">QuickCart Express</p>
        <h2>Daily essentials delivered from nearby warehouses.</h2>
        <p>
          Prioritize express products for minimum-time delivery, or schedule larger
          baskets when you are restocking for the week.
        </p>
      </div>
      <a href="/products">
        Explore essentials
        <FiArrowRight />
      </a>
    </section>
  )
}

function RoleAccess() {
  return (
    <section className="home-section role-section" id="roles">
      <SectionHeader
        eyebrow="Role based access"
        title="One platform for customers and operations teams"
        action={{ label: 'Login', href: '/login' }}
      />
      <div className="role-grid">
        {roles.map((role) => (
          <a className="role-card" href={role.href} key={role.title}>
            <span>{role.icon}</span>
            <h3>{role.title}</h3>
            <p>{role.text}</p>
            <strong>
              Continue as {role.title}
              <FiArrowRight />
            </strong>
          </a>
        ))}
      </div>
    </section>
  )
}

function WhyChooseUs() {
  return (
    <section className="home-section">
      <SectionHeader eyebrow="Why customers stay" title="Fast commerce that stays practical" />
      <div className="benefit-grid">
        {benefits.map((benefit) => (
          <article className="benefit-card" key={benefit.title}>
            <span>{benefit.icon}</span>
            <h3>{benefit.title}</h3>
            <p>{benefit.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="home-footer">
      <div>
        <a className="brand" href="/">
          <span className="brand-mark">QC</span>
          QuickCart
        </a>
        <p>Daily essentials, packed well and delivered with care.</p>
      </div>
      <nav aria-label="Footer navigation">
        <a href="/products">Products</a>
        <a href="/categories">Categories</a>
        <a href="/login">Login</a>
      </nav>
    </footer>
  )
}

function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <main>
        <section className="hero-section">
          <div className="hero-copy">
            <p className="eyebrow">
              <FiMapPin />
              Delivering daily essentials in your neighborhood
            </p>
            <h1>Daily essentials delivered fast, from groceries to home needs.</h1>
            <p>
              Shop fruits, dairy, snacks, personal care, cleaning supplies, and
              everyday staples from a wide local catalog built for quick delivery.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="/products">
                Start shopping
                <FiArrowRight />
              </a>
              <a className="secondary-action" href="/categories">
                Browse categories
              </a>
            </div>
          </div>

          <aside className="hero-card" aria-label="Fresh grocery preview">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=760&q=80"
              alt="Fresh vegetables arranged in a grocery market"
            />
            <div className="delivery-note">
              <span>Today</span>
              <strong>Express essentials arriving in 15-25 minutes</strong>
            </div>
          </aside>
        </section>

        <section className="home-section">
          <SectionHeader
            eyebrow="Shop by aisle"
            title="Essentials across every aisle"
            action={{ label: 'View all', href: '/categories' }}
          />
          <div className="category-grid">
            {categories.map((category) => (
              <CategoryCard category={category} key={category.name} />
            ))}
          </div>
        </section>

        <section className="home-section">
          <SectionHeader
            eyebrow="Fresh this week"
            title="Express and everyday products"
            action={{ label: 'Shop products', href: '/products' }}
          />
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard product={product} key={product.name} />
            ))}
          </div>
        </section>

        <PromoBanner />
        <RoleAccess />
        <WhyChooseUs />
      </main>

      <Footer />
    </div>
  )
}

export default Home
