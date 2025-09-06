// Shopping Cart Management
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.isOpen = false;
        this.init();
    }

    init() {
        this.updateCartCount();
        this.updateCartDisplay();
        this.bindEvents();
    }

    bindEvents() {
        // Cart button click
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => this.toggleCart());
        }

        // Cart close button
        const cartClose = document.getElementById('cart-close');
        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }

        // Cart overlay
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => this.closeCart());
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        }

        // Escape key to close cart
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeCart();
            }
        });
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity
            });
        }

        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
        
        // Add animation to cart button
        this.animateCartButton();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartCount();
                this.updateCartDisplay();
            }
        }
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            const count = this.getItemCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    updateCartDisplay() {
        const cartContent = document.getElementById('cart-content');
        const cartTotal = document.getElementById('cart-total');
        
        if (!cartContent || !cartTotal) return;

        if (this.items.length === 0) {
            cartContent.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started</p>
                </div>
            `;
        } else {
            cartContent.innerHTML = this.items.map(item => this.createCartItemHTML(item)).join('');
            this.bindCartItemEvents();
        }

        cartTotal.textContent = this.formatPrice(this.getTotal());
    }

    createCartItemHTML(item) {
        return `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${this.formatPrice(item.price)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn decrease" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-item" data-id="${item.id}" title="Remove item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    bindCartItemEvents() {
        // Quantity decrease buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.id);
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity - 1);
                }
            });
        });

        // Quantity increase buttons
        document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.id);
                const item = this.items.find(item => item.id === productId);
                if (item) {
                    this.updateQuantity(productId, item.quantity + 1);
                }
            });
        });

        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.currentTarget.dataset.id);
                this.removeItem(productId);
                
                // Show notification
                const item = this.items.find(item => item.id === productId);
                if (typeof showNotification === 'function') {
                    showNotification('Item removed from cart', 'info');
                }
            });
        });
    }

    toggleCart() {
        if (this.isOpen) {
            this.closeCart();
        } else {
            this.openCart();
        }
    }

    openCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            this.isOpen = true;
        }
    }

    closeCart() {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartOverlay = document.getElementById('cart-overlay');
        
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
            this.isOpen = false;
        }
    }

    animateCartButton() {
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.classList.add('cart-bounce');
            setTimeout(() => {
                cartBtn.classList.remove('cart-bounce');
            }, 600);
        }
    }

    // Checkout functionality
    proceedToCheckout() {
        if (this.items.length === 0) {
            this.showNotification('Your cart is empty', 'error');
            return;
        }

        // Save cart to localStorage for checkout page
        localStorage.setItem('cart', JSON.stringify(this.items));
        
        // Redirect to checkout page
        window.location.href = 'checkout.html';
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
        this.updateCartDisplay();
    }

    formatPrice(price) {
        return `₹${price.toLocaleString('en-IN')}`;
    }

    // Get cart summary for display
    getCartSummary() {
        return {
            items: this.items,
            itemCount: this.getItemCount(),
            total: this.getTotal(),
            formattedTotal: this.formatPrice(this.getTotal())
        };
    }

    // Mini cart for header display
    updateMiniCart() {
        const miniCart = document.querySelector('.mini-cart');
        if (!miniCart) return;

        if (this.items.length === 0) {
            miniCart.innerHTML = '<p>Your cart is empty</p>';
            return;
        }

        const miniCartHTML = `
            <div class="mini-cart-items">
                ${this.items.slice(0, 3).map(item => `
                    <div class="mini-cart-item">
                        <img src="${item.image}" alt="${item.title}" width="40" height="40">
                        <div class="mini-cart-item-info">
                            <div class="mini-cart-item-title">${item.title}</div>
                            <div class="mini-cart-item-price">${this.formatPrice(item.price)} x ${item.quantity}</div>
                        </div>
                    </div>
                `).join('')}
                ${this.items.length > 3 ? `<div class="mini-cart-more">+${this.items.length - 3} more items</div>` : ''}
            </div>
            <div class="mini-cart-total">
                <strong>Total: ${this.formatPrice(this.getTotal())}</strong>
            </div>
            <div class="mini-cart-actions">
                <button class="btn btn-outline btn-sm" onclick="cart.openCart()">View Cart</button>
                <button class="btn btn-primary btn-sm" onclick="cart.proceedToCheckout()">Checkout</button>
            </div>
        `;

        miniCart.innerHTML = miniCartHTML;
    }
}

// Initialize cart
const cart = new ShoppingCart();

// Global function to add items to cart (used by product cards)
function addToCart(product, quantity = 1) {
    cart.addItem(product, quantity);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoppingCart, cart, addToCart };
}

// Add CSS animations for cart
const cartStyles = document.createElement('style');
cartStyles.textContent = `
    .cart-bounce {
        animation: cartBounce 0.6s ease-in-out;
    }

    @keyframes cartBounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-10px);
        }
        60% {
            transform: translateY(-5px);
        }
    }

    .cart-empty {
        text-align: center;
        padding: 40px 20px;
        color: #666;
    }

    .cart-empty i {
        font-size: 48px;
        color: #ddd;
        margin-bottom: 20px;
    }

    .cart-empty h3 {
        margin-bottom: 10px;
        color: #333;
    }

    .mini-cart {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        padding: 20px;
        min-width: 300px;
        max-width: 350px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        z-index: 1000;
    }

    .cart-btn:hover .mini-cart {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    .mini-cart-item {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
    }

    .mini-cart-item img {
        border-radius: 4px;
    }

    .mini-cart-item-title {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 5px;
    }

    .mini-cart-item-price {
        font-size: 12px;
        color: #666;
    }

    .mini-cart-more {
        text-align: center;
        font-size: 12px;
        color: #666;
        margin-bottom: 15px;
    }

    .mini-cart-total {
        border-top: 1px solid #eee;
        padding-top: 15px;
        margin-bottom: 15px;
        text-align: center;
    }

    .mini-cart-actions {
        display: flex;
        gap: 10px;
    }

    .btn-sm {
        padding: 8px 16px;
        font-size: 14px;
    }

    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    }

    .notification.show {
        transform: translateX(0);
    }

    .notification-success {
        border-left: 4px solid #4CAF50;
        color: #4CAF50;
    }

    .notification-info {
        border-left: 4px solid #2196F3;
        color: #2196F3;
    }

    .notification-warning {
        border-left: 4px solid #FF9800;
        color: #FF9800;
    }

    .notification-error {
        border-left: 4px solid #F44336;
        color: #F44336;
    }

    .quick-view-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }

    .quick-view-modal.active {
        opacity: 1;
        visibility: visible;
    }

    .quick-view-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
    }

    .quick-view-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 16px;
        max-width: 800px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
    }

    .quick-view-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(0,0,0,0.1);
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        z-index: 1;
        transition: all 0.3s ease;
    }

    .quick-view-close:hover {
        background: rgba(0,0,0,0.2);
    }

    .quick-view-product {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
        padding: 40px;
    }

    .quick-view-image {
        position: relative;
    }

    .quick-view-image img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 12px;
    }

    .quick-view-info {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    @media (max-width: 768px) {
        .quick-view-product {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 20px;
        }
        
        .quick-view-content {
            width: 95%;
        }
        
        .mini-cart {
            min-width: 280px;
        }
        
        .notification {
            right: 10px;
            left: 10px;
            transform: translateY(-100px);
        }
        
        .notification.show {
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(cartStyles);
