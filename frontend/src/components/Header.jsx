import { Search, ShoppingCart, Sun, Moon } from 'lucide-react'
import './Header.css'

/**
 * Header Component
 * Sticky glassmorphism navigation with search bar, cart toggle, and theme switch.
 */
function Header({ searchQuery, onSearchChange, cartItemsCount, onCartClick, theme, onThemeToggle }) {
  return (
    <header className="header glass-strong" id="main-header">
      <div className="header-inner">
        {/* Logo */}
        <div className="header-logo" id="logo">
          <div className="logo-icon">
            <img src="/logo.png" alt="InighoStore" className="logo-img" />
          </div>
          <div className="logo-text">
            <span className="logo-name gradient-text">InighoStore</span>
            <span className="logo-tag">Premium Store</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-wrapper" id="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search products, brands, categories..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            id="search-input"
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="header-actions">
          {/* Theme Toggle */}
          <button
            className="icon-btn"
            onClick={onThemeToggle}
            aria-label="Toggle theme"
            id="theme-toggle"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Cart Button */}
          <button
            className="cart-btn"
            onClick={onCartClick}
            aria-label="Open cart"
            id="cart-button"
          >
            <ShoppingCart size={20} />
            {cartItemsCount > 0 && (
              <span className="cart-badge badge badge-primary" id="cart-badge">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
