import { SlidersHorizontal, Grid3X3, LayoutList, ChevronDown } from 'lucide-react'
import ProductCard from './ProductCard'
import './ProductCatalog.css'

/**
 * ProductCatalog Component
 * Displays filtered product grid with category pills, sort dropdown,
 * price range filters, and loading skeletons.
 */
function ProductCatalog({
  products,
  categories,
  loading,
  error,
  activeCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  onAddToCart,
  cart
}) {
  const isInCart = (productId) => cart.some(item => item.id === productId)

  return (
    <section className="catalog-section" id="product-catalog">
      {/* Toolbar */}
      <div className="catalog-toolbar">
        <div className="toolbar-left">
          <h2 className="catalog-title">
            {activeCategory || 'All Products'}
            <span className="catalog-count">{products.length} items</span>
          </h2>
        </div>
        
        <div className="toolbar-right">
          {/* Sort Dropdown */}
          <div className="sort-wrapper" id="sort-dropdown">
            <SlidersHorizontal size={14} />
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name">Name: A → Z</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown size={14} className="sort-chevron" />
          </div>

          {/* Price Range */}
          <div className="price-filter" id="price-filter">
            <input
              type="number"
              className="price-input"
              placeholder="Min $"
              value={priceRange.min}
              onChange={(e) => onPriceRangeChange({ ...priceRange, min: e.target.value })}
            />
            <span className="price-sep">—</span>
            <input
              type="number"
              className="price-input"
              placeholder="Max $"
              value={priceRange.max}
              onChange={(e) => onPriceRangeChange({ ...priceRange, max: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-pills" id="category-filters">
        <button
          className={`pill ${activeCategory === '' ? 'pill-active' : ''}`}
          onClick={() => onCategoryChange('')}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`pill ${activeCategory === cat ? 'pill-active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {getCategoryEmoji(cat)} {cat}
          </button>
        ))}
      </div>

      {/* Active filters */}
      {(activeCategory || sortBy || priceRange.min || priceRange.max) && (
        <div className="active-filters">
          {activeCategory && (
            <span className="filter-tag">
              {activeCategory}
              <button onClick={() => onCategoryChange('')}>✕</button>
            </span>
          )}
          {sortBy && (
            <span className="filter-tag">
              {getSortLabel(sortBy)}
              <button onClick={() => onSortChange('')}>✕</button>
            </span>
          )}
          {(priceRange.min || priceRange.max) && (
            <span className="filter-tag">
              ${priceRange.min || '0'} — ${priceRange.max || '∞'}
              <button onClick={() => onPriceRangeChange({ min: '', max: '' })}>✕</button>
            </span>
          )}
          <button
            className="clear-all-btn"
            onClick={() => {
              onCategoryChange('')
              onSortChange('')
              onPriceRangeChange({ min: '', max: '' })
            }}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="catalog-error">
          <p>⚠️ {error}</p>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="products-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton skeleton-image"></div>
              <div className="skeleton-body">
                <div className="skeleton skeleton-title"></div>
                <div className="skeleton skeleton-desc"></div>
                <div className="skeleton skeleton-price"></div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="catalog-empty">
          <div className="empty-icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your search or filter criteria</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              onCategoryChange('')
              onSortChange('')
              onPriceRangeChange({ min: '', max: '' })
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        /* Product Grid */
        <div className="products-grid" id="products-grid">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              isInCart={isInCart(product.id)}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function getCategoryEmoji(category) {
  const emojis = {
    'Electronics': '⚡',
    'Footwear': '👟',
    'Accessories': '⌚',
    'Beauty': '✨',
    'Apparel': '👕',
  }
  return emojis[category] || '📦'
}

function getSortLabel(sort) {
  const labels = {
    'price-asc': 'Price ↑',
    'price-desc': 'Price ↓',
    'name': 'A → Z',
    'rating': 'Top Rated',
  }
  return labels[sort] || sort
}

export default ProductCatalog
