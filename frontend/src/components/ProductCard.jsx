import { useState } from 'react'
import { ShoppingCart, Star, Check, Eye } from 'lucide-react'
import './ProductCard.css'

/**
 * ProductCard Component
 * Displays a single product with image, details, rating, and add-to-cart functionality.
 * Features hover animations, image error fallback, and responsive layout.
 */
function ProductCard({ product, onAddToCart, isInCart, index }) {
  const [imageError, setImageError] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = () => {
    setIsAdding(true)
    onAddToCart(product)
    setTimeout(() => setIsAdding(false), 600)
  }

  // Generate gradient fallback for broken images
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  ]

  const fallbackGradient = gradients[product.id % gradients.length]

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={`star ${i < Math.floor(rating) ? 'star-filled' : 'star-empty'}`}
      />
    ))
  }

  return (
    <div
      className="product-card"
      style={{ animationDelay: `${index * 0.05}s` }}
      id={`product-${product.id}`}
    >
      {/* Image Section */}
      <div className="card-image-wrapper">
        {imageError ? (
          <div
            className="card-image-fallback"
            style={{ background: fallbackGradient }}
          >
            <span className="fallback-text">{product.name.charAt(0)}</span>
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="card-image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Category Tag */}
        <span className="card-category">{product.category}</span>
        
        {/* Stock indicator */}
        {product.stock <= 10 && (
          <span className="card-stock-low">Only {product.stock} left!</span>
        )}

        {/* Quick view overlay */}
        <div className="card-overlay">
          <button className="overlay-btn" aria-label="Quick view">
            <Eye size={18} />
            Quick View
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div className="card-body">
        <h3 className="card-title">{product.name}</h3>
        
        <p className="card-description">{product.description}</p>
        
        {/* Rating */}
        <div className="card-rating">
          <div className="stars-row">{renderStars(product.rating)}</div>
          <span className="rating-value">{product.rating}</span>
          <span className="rating-count">({product.reviewsCount.toLocaleString()})</span>
        </div>

        {/* Price & Add to Cart */}
        <div className="card-footer">
          <div className="card-price">
            <span className="price-current">{formatPrice(product.price)}</span>
          </div>
          
          <button
            className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''} ${isAdding ? 'adding' : ''}`}
            onClick={handleAddToCart}
            id={`add-to-cart-${product.id}`}
          >
            {isAdding ? (
              <Check size={16} />
            ) : isInCart ? (
              <>
                <Check size={14} />
                <span>In Cart</span>
              </>
            ) : (
              <>
                <ShoppingCart size={14} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
