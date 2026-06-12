import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package } from 'lucide-react'
import './CartDrawer.css'

/**
 * CartDrawer Component
 * Slide-out cart panel showing cart items, quantity controls,
 * price breakdown, and checkout functionality.
 */
function CartDrawer({ isOpen, onClose, cart, onUpdateQuantity, onRemoveItem, onClearCart, onCheckout, cartTotal }) {
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const shippingCost = cartTotal > 500 ? 0 : 9.99
  const tax = cartTotal * 0.08
  const orderTotal = cartTotal + shippingCost + tax

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop ${isOpen ? 'cart-backdrop-open' : ''}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`cart-drawer ${isOpen ? 'cart-drawer-open' : ''}`}
        id="cart-drawer"
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="drawer-header">
          <div className="drawer-title-row">
            <ShoppingBag size={22} />
            <h2 className="drawer-title">Your Cart</h2>
            <span className="drawer-count badge badge-primary">{cart.length}</span>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close cart" id="close-cart">
            <X size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart */
          <div className="drawer-empty">
            <div className="empty-cart-icon">
              <Package size={48} />
            </div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any items yet.</p>
            <button className="btn btn-primary" onClick={onClose}>
              Continue Shopping
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="drawer-items">
              {cart.map((item) => (
                <div key={item.id} className="cart-item" id={`cart-item-${item.id}`}>
                  <div className="item-image-wrapper">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="item-image"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div className="item-image-fallback" style={{ display: 'none' }}>
                      {item.name.charAt(0)}
                    </div>
                  </div>
                  
                  <div className="item-details">
                    <h4 className="item-name">{item.name}</h4>
                    <span className="item-category">{item.category}</span>
                    <span className="item-price">{formatPrice(item.price)}</span>
                  </div>
                  
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button
                      className="remove-btn"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="drawer-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? 'free-shipping' : ''}>
                  {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              
              {shippingCost === 0 && (
                <div className="free-ship-notice">
                  🎉 You qualified for free shipping!
                </div>
              )}

              <div className="summary-divider"></div>
              
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>

              <button
                className="checkout-btn"
                onClick={onCheckout}
                id="checkout-button"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>

              <button className="clear-cart-btn" onClick={onClearCart}>
                Clear Cart
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

export default CartDrawer
