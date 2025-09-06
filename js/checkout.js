// Checkout Page JavaScript

class CheckoutPage {
    constructor() {
        this.cart = null;
        this.deliveryCost = 0;
        this.discount = 0;
        this.taxRate = 0.18; // 18% GST
        this.promoCode = null;
        
        this.init();
    }

    init() {
        this.loadCart();
        this.setupTabs();
        this.setupForms();
        this.setupPaymentMethods();
        this.setupDeliveryOptions();
        this.setupPromoCode();
        this.setupOrderPlacement();
        this.setupModal();
        this.renderCartItems();
        this.updateTotals();
    }

    // Load cart from localStorage
    loadCart() {
        if (typeof Cart !== 'undefined') {
            this.cart = new Cart();
        } else {
            // Fallback cart data
            this.cart = {
                items: JSON.parse(localStorage.getItem('cart') || '[]'),
                getTotal: function() {
                    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
                }
            };
        }
    }

    // Setup account tabs
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                
                // Remove active class from all tabs
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked tab
                button.classList.add('active');
                document.getElementById(`${tabName}-tab`).classList.add('active');
            });
        });
    }

    // Setup form validation
    setupForms() {
        const shippingForm = document.getElementById('shipping-form');
        const loginForm = document.querySelector('.login-form');
        const registerForm = document.querySelector('.register-form');

        if (shippingForm) {
            this.setupFormValidation(shippingForm);
        }
        if (loginForm) {
            this.setupFormValidation(loginForm);
        }
        if (registerForm) {
            this.setupFormValidation(registerForm);
        }

        // Real-time validation
        this.setupRealTimeValidation();
    }

    setupFormValidation(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm(form)) {
                this.handleFormSubmit(form);
            }
        });
    }

    setupRealTimeValidation() {
        const inputs = document.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Special validation for specific fields
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }

        const pincodeInput = document.getElementById('pincode');
        if (pincodeInput) {
            pincodeInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
            });
        }

        // Card number formatting
        const cardNumber = document.getElementById('card-number');
        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
        }

        // Expiry date formatting
        const expiryInput = document.getElementById('expiry');
        if (expiryInput) {
            expiryInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }

        // CVV formatting
        const cvvInput = document.getElementById('cvv');
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
            });
        }
    }

    validateField(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.form-error');
        let isValid = true;
        let errorMessage = '';

        formGroup.classList.remove('error');

        // Required field validation
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && field.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.id === 'phone' && field.value.trim()) {
            if (field.value.length !== 10) {
                isValid = false;
                errorMessage = 'Please enter a valid 10-digit phone number';
            }
        }

        // PIN code validation
        if (field.id === 'pincode' && field.value.trim()) {
            if (field.value.length !== 6) {
                isValid = false;
                errorMessage = 'Please enter a valid 6-digit PIN code';
            }
        }

        // Card number validation
        if (field.id === 'card-number' && field.value.trim()) {
            const cardNumber = field.value.replace(/\s/g, '');
            if (cardNumber.length < 13 || cardNumber.length > 19) {
                isValid = false;
                errorMessage = 'Please enter a valid card number';
            }
        }

        // Expiry date validation
        if (field.id === 'expiry' && field.value.trim()) {
            const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
            if (!expiryRegex.test(field.value)) {
                isValid = false;
                errorMessage = 'Please enter a valid expiry date (MM/YY)';
            }
        }

        // CVV validation
        if (field.id === 'cvv' && field.value.trim()) {
            if (field.value.length !== 3) {
                isValid = false;
                errorMessage = 'Please enter a valid 3-digit CVV';
            }
        }

        if (!isValid) {
            formGroup.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
            }
        }

        return isValid;
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
    }

    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    handleFormSubmit(form) {
        if (form.classList.contains('login-form')) {
            this.handleLogin(form);
        } else if (form.classList.contains('register-form')) {
            this.handleRegister(form);
        }
    }

    handleLogin(form) {
        const formData = new FormData(form);
        // Simulate login
        this.showNotification('Login successful!', 'success');
        // Switch to guest tab after login
        document.querySelector('[data-tab="guest"]').click();
    }

    handleRegister(form) {
        const formData = new FormData(form);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm-password');

        if (password !== confirmPassword) {
            this.showNotification('Passwords do not match', 'error');
            return;
        }

        // Simulate registration
        this.showNotification('Account created successfully!', 'success');
        // Switch to guest tab after registration
        document.querySelector('[data-tab="guest"]').click();
    }

    // Setup payment methods
    setupPaymentMethods() {
        const paymentRadios = document.querySelectorAll('input[name="payment"]');
        const cardDetails = document.getElementById('card-details');

        paymentRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.value === 'card') {
                    cardDetails.style.display = 'block';
                } else {
                    cardDetails.style.display = 'none';
                }
            });
        });
    }

    // Setup delivery options
    setupDeliveryOptions() {
        const deliveryRadios = document.querySelectorAll('input[name="delivery"]');
        
        deliveryRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                switch (radio.value) {
                    case 'standard':
                        this.deliveryCost = 0;
                        break;
                    case 'express':
                        this.deliveryCost = 99;
                        break;
                    case 'next-day':
                        this.deliveryCost = 199;
                        break;
                }
                this.updateTotals();
            });
        });
    }

    // Setup promo code
    setupPromoCode() {
        const promoInput = document.getElementById('promo-code');
        const applyBtn = document.getElementById('apply-promo');

        applyBtn.addEventListener('click', () => {
            const code = promoInput.value.trim().toUpperCase();
            this.applyPromoCode(code);
        });

        promoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const code = promoInput.value.trim().toUpperCase();
                this.applyPromoCode(code);
            }
        });
    }

    applyPromoCode(code) {
        const validCodes = {
            'WELCOME10': 10,
            'SAVE20': 20,
            'FIRST50': 50,
            'NEWYEAR': 15
        };

        if (validCodes[code]) {
            this.discount = validCodes[code];
            this.promoCode = code;
            this.showNotification(`Promo code applied! You saved ₹${this.discount}`, 'success');
            document.querySelector('.promo-discount').style.display = 'flex';
        } else {
            this.showNotification('Invalid promo code', 'error');
            this.discount = 0;
            this.promoCode = null;
            document.querySelector('.promo-discount').style.display = 'none';
        }
        
        this.updateTotals();
    }

    // Setup order placement
    setupOrderPlacement() {
        const placeOrderBtn = document.getElementById('place-order');
        
        placeOrderBtn.addEventListener('click', () => {
            this.placeOrder();
        });
    }

    async placeOrder() {
        // Validate shipping form
        const shippingForm = document.getElementById('shipping-form');
        if (!this.validateForm(shippingForm)) {
            this.showNotification('Please fill in all required shipping information', 'error');
            return;
        }

        // Validate payment method
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        if (!selectedPayment) {
            this.showNotification('Please select a payment method', 'error');
            return;
        }

        // Validate card details if card payment
        if (selectedPayment.value === 'card') {
            const cardForm = document.querySelector('.card-form');
            if (!this.validateForm(cardForm)) {
                this.showNotification('Please fill in all card details', 'error');
                return;
            }
        }

        // Show loading state
        const placeOrderBtn = document.getElementById('place-order');
        placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        placeOrderBtn.disabled = true;

        try {
            // Simulate order processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Generate order details
            const orderDetails = this.generateOrderDetails();
            
            // Save order to authentication system if user is logged in
            if (window.authSystem && window.authSystem.isLoggedIn()) {
                const orderData = {
                    items: this.cart.items,
                    total: this.cart.getTotal(),
                    shipping: this.deliveryCost,
                    tax: Math.round((this.cart.getTotal() - this.discount) * this.taxRate),
                    grandTotal: orderDetails.total,
                    shippingAddress: this.getShippingAddressObject()
                };
                
                window.authSystem.addOrder(orderData);
            }
            
            // Show confirmation modal
            this.showOrderConfirmation(orderDetails);
            
            // Clear cart
            this.clearCart();
            
            // Track order placement
            this.trackOrderPlacement(orderDetails);
            
        } catch (error) {
            console.error('Order placement error:', error);
            this.showNotification('There was an error processing your order. Please try again.', 'error');
        } finally {
            // Reset button
            placeOrderBtn.innerHTML = '<i class="fas fa-lock"></i> Place Secure Order';
            placeOrderBtn.disabled = false;
        }
    }

    generateOrderDetails() {
        const orderNumber = 'HE-' + new Date().getFullYear() + '-' + 
                          String(Math.floor(Math.random() * 10000)).padStart(4, '0');
        
        const subtotal = this.cart.getTotal();
        const tax = Math.round((subtotal - this.discount) * this.taxRate);
        const total = subtotal + this.deliveryCost + tax - this.discount;
        
        const selectedDelivery = document.querySelector('input[name="delivery"]:checked');
        const deliveryOption = selectedDelivery ? selectedDelivery.value : 'standard';
        
        let deliveryDays = 7;
        switch (deliveryOption) {
            case 'express':
                deliveryDays = 3;
                break;
            case 'next-day':
                deliveryDays = 1;
                break;
        }
        
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
        
        const shippingAddress = this.getShippingAddress();
        
        return {
            orderNumber,
            total,
            deliveryDate: deliveryDate.toLocaleDateString('en-IN'),
            address: shippingAddress,
            items: this.cart.items
        };
    }

    getShippingAddress() {
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const pincode = document.getElementById('pincode').value;
        
        return `${firstName} ${lastName}, ${address}, ${city}, ${state} - ${pincode}`;
    }

    getShippingAddressObject() {
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const pincode = document.getElementById('pincode').value;
        
        return {
            name: `${firstName} ${lastName}`,
            phone: phone,
            address: address,
            city: city,
            state: state,
            pincode: pincode
        };
    }

    showOrderConfirmation(orderDetails) {
        const modal = document.getElementById('order-confirmation-modal');
        const overlay = document.getElementById('modal-overlay');
        
        // Update modal content
        document.getElementById('order-number').textContent = orderDetails.orderNumber;
        document.getElementById('order-total').textContent = `₹${orderDetails.total}`;
        document.getElementById('delivery-address').textContent = orderDetails.address;
        document.getElementById('expected-delivery').textContent = orderDetails.deliveryDate;
        
        // Show modal
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    clearCart() {
        localStorage.removeItem('cart');
        if (this.cart && this.cart.clearCart) {
            this.cart.clearCart();
        }
    }

    // Setup modal
    setupModal() {
        const modal = document.getElementById('order-confirmation-modal');
        const overlay = document.getElementById('modal-overlay');
        const trackOrderBtn = document.getElementById('track-order');
        const continueShoppingBtn = document.getElementById('continue-shopping');

        const closeModal = () => {
            modal.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        overlay.addEventListener('click', closeModal);

        trackOrderBtn.addEventListener('click', () => {
            // Simulate order tracking
            this.showNotification('Order tracking feature coming soon!', 'info');
            closeModal();
        });

        continueShoppingBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Render cart items
    renderCartItems() {
        const cartItemsContainer = document.getElementById('checkout-cart-items');
        
        if (!this.cart.items || this.cart.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <p>Your cart is empty</p>
                    <a href="products.html" class="btn btn-primary">Continue Shopping</a>
                </div>
            `;
            return;
        }

        cartItemsContainer.innerHTML = this.cart.items.map(item => `
            <div class="cart-item">
                <div class="item-image">
                    <i class="fas fa-box"></i>
                </div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-price">₹${item.price}</div>
                    <div class="item-quantity">Qty: ${item.quantity}</div>
                </div>
                <div class="item-total">₹${item.price * item.quantity}</div>
            </div>
        `).join('');
    }

    // Update totals
    updateTotals() {
        const subtotal = this.cart.getTotal();
        const tax = Math.round((subtotal - this.discount) * this.taxRate);
        const total = subtotal + this.deliveryCost + tax - this.discount;

        document.getElementById('subtotal').textContent = `₹${subtotal}`;
        document.getElementById('delivery-cost').textContent = 
            this.deliveryCost === 0 ? 'Free' : `₹${this.deliveryCost}`;
        document.getElementById('discount-amount').textContent = `-₹${this.discount}`;
        document.getElementById('tax-amount').textContent = `₹${tax}`;
        document.getElementById('final-total').textContent = `₹${total}`;
    }

    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 
                                type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 1rem 1.5rem;
                    border-radius: 12px;
                    color: white;
                    z-index: 1002;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    max-width: 400px;
                }
                .notification-success { background: #27ae60; }
                .notification-error { background: #e74c3c; }
                .notification-info { background: #3498db; }
                .notification.show { transform: translateX(0); }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Analytics
    trackOrderPlacement(orderDetails) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: orderDetails.orderNumber,
                value: orderDetails.total,
                currency: 'INR',
                items: orderDetails.items.map(item => ({
                    item_id: item.id,
                    item_name: item.name,
                    category: item.category,
                    quantity: item.quantity,
                    price: item.price
                }))
            });
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CheckoutPage();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CheckoutPage;
}
