import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiClock,
  FiHome,
  FiMapPin,
  FiPackage,
  FiTruck,
  FiUser,
} from 'react-icons/fi'
import ProductCard from '../components/ProductCard'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import './Home.css'

import { homeCategories, homeProducts, roles, benefits } from '../data/homeData'

const roleIconMap = {
  user: <FiUser />,
  home: <FiHome />,
  truck: <FiTruck />,
}

const benefitIconMap = {
  clock: <FiClock />,
  package: <FiPackage />,
  truck: <FiTruck />,
}

function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="section-header">
      <div>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {action ? (
        <Link className="section-action" to={action.href}>
          {action.label}
          <FiArrowRight />
        </Link>
      ) : null}
    </div>
  )
}

function CategoryCard({ category }) {
  return (
    <Link className="category-card" to="/categories">
      <div className="category-image" style={{ backgroundColor: category.accent }}>
        <img src={category.image} alt="" loading="lazy" />
      </div>
      <div>
        <h3>{category.name}</h3>
        <p>{category.detail}</p>
      </div>
    </Link>
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
      <Link to="/products">
        Explore essentials
        <FiArrowRight />
      </Link>
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
          <Link className="role-card" to={role.href} key={role.title}>
            <span>{roleIconMap[role.icon]}</span>
            <h3>{role.title}</h3>
            <p>{role.text}</p>
            <strong>
              Continue as {role.title}
              <FiArrowRight />
            </strong>
          </Link>
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
            <span>{benefitIconMap[benefit.icon]}</span>
            <h3>{benefit.title}</h3>
            <p>{benefit.text}</p>
          </article>
        ))}
      </div>
    </section>
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
            {homeCategories.map((category) => (
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
            {homeProducts.map((product) => (
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
