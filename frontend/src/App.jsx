import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import ProductCatalog from './components/ProductCatalog'
import CartDrawer from './components/CartDrawer'
import './App.css'

/**
 * Main App Component
 * Manages global state: cart, theme, search, category filters.
 * Fetches product data from the Java REST API backend.
 */
function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  
  // Product state
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  
  // Cart state
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  // Toast state
  const [toasts, setToasts] = useState([])

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  // Show toast notification
  const showToast = useCallback((message) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 300)
    }, 2500)
  }, [])

  // Fetch products from the REST API
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (activeCategory) params.append('category', activeCategory)
      if (sortBy) params.append('sort', sortBy)
      if (priceRange.min) params.append('minPrice', priceRange.min)
      if (priceRange.max) params.append('maxPrice', priceRange.max)
      
      const queryString = params.toString()
      const url = `/api/products${queryString ? `?${queryString}` : ''}`
      
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch products')
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      // Fallback: If API is not running, use embedded mock data
      console.warn('API unavailable, using mock data:', err.message)
      setProducts(getMockProducts())
      setError(null) // Don't show error for mock data
    } finally {
      setLoading(false)
    }
  }, [searchQuery, activeCategory, sortBy, priceRange])

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/products/categories')
      if (!response.ok) throw new Error('Failed to fetch categories')
      const data = await response.json()
      setCategories(data)
    } catch {
      setCategories(['Electronics', 'Footwear', 'Accessories', 'Beauty', 'Apparel'])
    }
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchProducts])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // Cart operations
  const addToCart = useCallback((product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    showToast(`${product.name} added to cart!`)
  }, [showToast])

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(item => item.id !== productId))
  }, [])

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => setCart([]), [])

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Checkout
  const handleCheckout = useCallback(async () => {
    if (cart.length === 0) return
    
    const order = {
      customerName: "Demo User",
      customerEmail: "demo@shopverse.com",
      shippingAddress: "123 Tech Park, Mumbai, India",
      totalAmount: cartTotal,
      items: cart.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
      })
      
      if (response.ok) {
        showToast('🎉 Order placed successfully!')
        clearCart()
        setIsCartOpen(false)
      }
    } catch {
      showToast('🎉 Order placed successfully! (Demo mode)')
      clearCart()
      setIsCartOpen(false)
    }
  }, [cart, cartTotal, clearCart, showToast])

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  return (
    <div className="app">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
        theme={theme}
        onThemeToggle={toggleTheme}
      />

      <main className="main-content">
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">🔥 New Arrivals</div>
            <h1 className="hero-title">
              Discover <span className="gradient-text">Premium</span> Products
            </h1>
            <p className="hero-subtitle">
              Explore our curated collection of top-tier products. 
              Built with React.js frontend & Java Spring Boot REST API backend.
            </p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-value">{products.length}+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{categories.length}</span>
                <span className="stat-label">Categories</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">4.8</span>
                <span className="stat-label">Avg Rating</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-orb orb-1"></div>
            <div className="hero-orb orb-2"></div>
            <div className="hero-orb orb-3"></div>
          </div>
        </section>

        <ProductCatalog
          products={products}
          categories={categories}
          loading={loading}
          error={error}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          onAddToCart={addToCart}
          cart={cart}
        />
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onClearCart={clearCart}
        onCheckout={handleCheckout}
        cartTotal={cartTotal}
      />

      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-success ${toast.exiting ? 'toast-exit' : ''}`}>
            <span>✓</span> {toast.message}
          </div>
        ))}
      </div>

      <footer className="app-footer">
        <div className="footer-content">
          <p className="footer-text">
            <span className="gradient-text">InighoStore</span> — E-Commerce Product Catalog & Cart
          </p>
          <p className="footer-tech">
            Built with React.js · Java Spring Boot · MySQL/H2 · REST API
          </p>
        </div>
      </footer>
    </div>
  )
}

/**
 * Fallback mock product data when the Java API server is not running.
 * Allows the frontend to function independently for demo purposes.
 */
function getMockProducts() {
  return [
    { id: 1, name: 'MacBook Pro 16"', description: 'Apple M3 Pro chip, 18GB RAM, 512GB SSD. Stunning Liquid Retina XDR display with ProMotion technology.', price: 2499.00, imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop', category: 'Electronics', stock: 25, rating: 4.9, reviewsCount: 2847 },
    { id: 2, name: 'iPhone 15 Pro Max', description: '6.7-inch Super Retina XDR, A17 Pro chip, 256GB. Titanium design with Action button.', price: 1199.00, imageUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop', category: 'Electronics', stock: 50, rating: 4.8, reviewsCount: 5621 },
    { id: 3, name: 'Sony WH-1000XM5', description: 'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling.', price: 349.99, imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=400&fit=crop', category: 'Electronics', stock: 100, rating: 4.7, reviewsCount: 3412 },
    { id: 4, name: 'Nike Air Max 270', description: 'Max Air unit delivers unrivaled comfort. Breathable mesh upper with sleek, modern design.', price: 150.00, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', category: 'Footwear', stock: 75, rating: 4.5, reviewsCount: 1893 },
    { id: 5, name: 'Samsung Galaxy S24 Ultra', description: '6.8-inch Dynamic AMOLED, Snapdragon 8 Gen 3, 200MP camera with Galaxy AI features.', price: 1299.99, imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', category: 'Electronics', stock: 40, rating: 4.7, reviewsCount: 4215 },
    { id: 6, name: 'Apple Watch Ultra 2', description: '49mm titanium case, precision dual-frequency GPS. The most rugged and capable Apple Watch.', price: 799.00, imageUrl: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop', category: 'Accessories', stock: 30, rating: 4.8, reviewsCount: 1567 },
    { id: 7, name: 'Dyson Airwrap Multi-Styler', description: 'Complete long barrel set. Coanda air styling technology for curls, waves, and smooth blowouts.', price: 599.99, imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&h=400&fit=crop', category: 'Beauty', stock: 20, rating: 4.6, reviewsCount: 2341 },
    { id: 8, name: "Levi's 501 Original Jeans", description: 'The original straight fit jean. Button fly. Sits at waist. Premium selvedge denim.', price: 69.50, imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', category: 'Apparel', stock: 200, rating: 4.4, reviewsCount: 8762 },
    { id: 9, name: 'Canon EOS R6 Mark II', description: '24.2MP Full-Frame CMOS sensor, 40fps continuous shooting, 4K 60p video recording.', price: 2499.00, imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=400&fit=crop', category: 'Electronics', stock: 15, rating: 4.9, reviewsCount: 987 },
    { id: 10, name: 'Bose QuietComfort Ultra', description: 'Spatial audio with Immersive Audio. World-class noise cancellation. Up to 24hr battery.', price: 429.00, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop', category: 'Electronics', stock: 60, rating: 4.6, reviewsCount: 2156 },
    { id: 11, name: 'Adidas Ultraboost Light', description: 'Lightest Ultraboost ever. BOOST midsole and Continental rubber outsole for unmatched grip.', price: 190.00, imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop', category: 'Footwear', stock: 85, rating: 4.5, reviewsCount: 3421 },
    { id: 12, name: 'Ray-Ban Aviator Classic', description: 'Iconic aviator shape with crystal green lenses. Gold-tone metal frame. UV400 protection.', price: 163.00, imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop', category: 'Accessories', stock: 120, rating: 4.3, reviewsCount: 6543 },
    { id: 13, name: 'iPad Air M2', description: '11-inch Liquid Retina display, M2 chip, 128GB. Works with Apple Pencil Pro and Magic Keyboard.', price: 599.00, imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop', category: 'Electronics', stock: 45, rating: 4.7, reviewsCount: 3891 },
    { id: 14, name: 'The North Face Nuptse Jacket', description: '700-fill goose down insulation. Water-resistant DryVent shell. Iconic puffer silhouette.', price: 320.00, imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop', category: 'Apparel', stock: 55, rating: 4.6, reviewsCount: 2187 },
    { id: 15, name: 'Glossier Boy Brow', description: 'Grooming pomade that thickens and shapes brows. Available in 5 shades. Cruelty-free.', price: 17.00, imageUrl: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400&h=400&fit=crop', category: 'Beauty', stock: 300, rating: 4.4, reviewsCount: 12453 },
    { id: 16, name: 'AirPods Pro 2nd Gen', description: 'Active Noise Cancellation up to 2x more. Adaptive Audio. Personalized Spatial Audio with head tracking.', price: 249.00, imageUrl: 'https://images.unsplash.com/photo-1588423771073-b8903fde1c68?w=400&h=400&fit=crop', category: 'Electronics', stock: 90, rating: 4.8, reviewsCount: 7823 },
  ]
}

export default App
