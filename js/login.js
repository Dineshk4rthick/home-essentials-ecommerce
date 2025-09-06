// Login and Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.orders = [];
        this.addresses = [];
        this.init();
    }

    init() {
        this.loadUserData();
        this.bindEvents();
        this.checkAuthState();
        this.loadDemoData();
        this.checkURLHash();
    }

    loadUserData() {
        const userData = localStorage.getItem('homeEssentials_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }

        const ordersData = localStorage.getItem('homeEssentials_orders');
        if (ordersData) {
            this.orders = JSON.parse(ordersData);
        }

        const addressesData = localStorage.getItem('homeEssentials_addresses');
        if (addressesData) {
            this.addresses = JSON.parse(addressesData);
        }
    }

    saveUserData() {
        if (this.currentUser) {
            localStorage.setItem('homeEssentials_user', JSON.stringify(this.currentUser));
        }
        localStorage.setItem('homeEssentials_orders', JSON.stringify(this.orders));
        localStorage.setItem('homeEssentials_addresses', JSON.stringify(this.addresses));
    }

    loadDemoData() {
        // Load demo orders if no orders exist
        if (this.orders.length === 0) {
            this.orders = [
                {
                    id: 'HE001',
                    date: '2025-01-10',
                    status: 'delivered',
                    items: [
                        {
                            id: 1,
                            name: 'Multi-Tier Storage Rack',
                            price: 2499,
                            quantity: 1,
                            image: 'assets/images/storage-rack.jpg'
                        },
                        {
                            id: 2,
                            name: 'Non-Stick Cookware Set',
                            price: 3499,
                            quantity: 1,
                            image: 'assets/images/cookware-set.jpg'
                        }
                    ],
                    total: 5998,
                    shipping: 0,
                    tax: 1079,
                    grandTotal: 7077,
                    shippingAddress: {
                        name: 'John Doe',
                        phone: '+91 98765 43210',
                        address: '123 Main Street, Apartment 4B',
                        city: 'New Delhi',
                        state: 'Delhi',
                        pincode: '110001'
                    },
                    trackingNumber: 'HE2025001234567'
                },
                {
                    id: 'HE002',
                    date: '2025-01-08',
                    status: 'shipped',
                    items: [
                        {
                            id: 3,
                            name: 'Bathroom Organizer Set',
                            price: 1299,
                            quantity: 2,
                            image: 'assets/images/bathroom-organizer.jpg'
                        }
                    ],
                    total: 2598,
                    shipping: 99,
                    tax: 486,
                    grandTotal: 3183,
                    shippingAddress: {
                        name: 'John Doe',
                        phone: '+91 98765 43210',
                        address: '123 Main Street, Apartment 4B',
                        city: 'New Delhi',
                        state: 'Delhi',
                        pincode: '110001'
                    },
                    trackingNumber: 'HE2025001234568'
                },
                {
                    id: 'HE003',
                    date: '2025-01-05',
                    status: 'processing',
                    items: [
                        {
                            id: 4,
                            name: 'Kids Safety Mat',
                            price: 899,
                            quantity: 1,
                            image: 'assets/images/kids-mat.jpg'
                        }
                    ],
                    total: 899,
                    shipping: 0,
                    tax: 162,
                    grandTotal: 1061,
                    shippingAddress: {
                        name: 'John Doe',
                        phone: '+91 98765 43210',
                        address: '123 Main Street, Apartment 4B',
                        city: 'New Delhi',
                        state: 'Delhi',
                        pincode: '110001'
                    },
                    trackingNumber: null
                }
            ];
        }

        // Load demo addresses if no addresses exist
        if (this.addresses.length === 0) {
            this.addresses = [
                {
                    id: 1,
                    type: 'Home',
                    name: 'John Doe',
                    phone: '+91 98765 43210',
                    address: '123 Main Street, Apartment 4B',
                    city: 'New Delhi',
                    state: 'Delhi',
                    pincode: '110001',
                    isDefault: true
                },
                {
                    id: 2,
                    type: 'Office',
                    name: 'John Doe',
                    phone: '+91 98765 43210',
                    address: '456 Business Park, Floor 3',
                    city: 'Gurgaon',
                    state: 'Haryana',
                    pincode: '122001',
                    isDefault: false
                }
            ];
        }
    }

    bindEvents() {
        // Form switching
        const showSignup = document.getElementById('show-signup');
        const showLogin = document.getElementById('show-login');
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');

        if (showSignup) {
            showSignup.addEventListener('click', (e) => {
                e.preventDefault();
                loginForm.style.display = 'none';
                signupForm.style.display = 'block';
            });
        }

        if (showLogin) {
            showLogin.addEventListener('click', (e) => {
                e.preventDefault();
                signupForm.style.display = 'none';
                loginForm.style.display = 'block';
            });
        }

        // Password toggles
        this.bindPasswordToggle('login-password-toggle', 'login-password');
        this.bindPasswordToggle('signup-password-toggle', 'signup-password');
        this.bindPasswordToggle('signup-confirm-password-toggle', 'signup-confirm-password');

        // Form submissions
        const loginFormElement = document.getElementById('login-form-element');
        const signupFormElement = document.getElementById('signup-form-element');

        if (loginFormElement) {
            loginFormElement.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (signupFormElement) {
            signupFormElement.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSignup();
            });
        }

        // Dashboard tabs
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });

        // User menu toggle
        const userBtn = document.getElementById('user-btn');
        const userDropdown = document.getElementById('user-dropdown');
        
        if (userBtn && userDropdown) {
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                userDropdown.classList.remove('active');
            });
        }

        // Logout
        const logoutActions = document.querySelectorAll('#logout-action, #dashboard-logout');
        logoutActions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        });

        // Order filter
        const orderFilter = document.getElementById('order-filter');
        if (orderFilter) {
            orderFilter.addEventListener('change', (e) => {
                this.filterOrders(e.target.value);
            });
        }

        // Password strength checker
        const signupPassword = document.getElementById('signup-password');
        if (signupPassword) {
            signupPassword.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        }

        // Modal close
        const orderDetailsClose = document.getElementById('order-details-close');
        const orderDetailsModal = document.getElementById('order-details-modal');
        
        if (orderDetailsClose && orderDetailsModal) {
            orderDetailsClose.addEventListener('click', () => {
                orderDetailsModal.style.display = 'none';
            });

            orderDetailsModal.addEventListener('click', (e) => {
                if (e.target === orderDetailsModal) {
                    orderDetailsModal.style.display = 'none';
                }
            });
        }
    }

    bindPasswordToggle(toggleId, inputId) {
        const toggle = document.getElementById(toggleId);
        const input = document.getElementById(inputId);
        
        if (toggle && input) {
            toggle.addEventListener('click', () => {
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                
                const icon = toggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-eye');
                    icon.classList.toggle('fa-eye-slash');
                }
            });
        }
    }

    checkPasswordStrength(password) {
        const strengthDiv = document.getElementById('password-strength');
        if (!strengthDiv) return;

        let strength = 0;
        let message = '';

        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;

        switch (strength) {
            case 0:
            case 1:
                message = 'Weak password';
                strengthDiv.className = 'password-strength weak';
                break;
            case 2:
            case 3:
                message = 'Medium password';
                strengthDiv.className = 'password-strength medium';
                break;
            case 4:
                message = 'Strong password';
                strengthDiv.className = 'password-strength strong';
                break;
        }

        strengthDiv.textContent = message;
    }

    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // Simple validation (in real app, this would be server-side)
        if (!email || !password) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        // Demo login - accept any email/password
        this.currentUser = {
            id: 1,
            email: email,
            firstName: 'John',
            lastName: 'Doe',
            phone: '+91 98765 43210',
            joinDate: '2024-01-15'
        };

        this.saveUserData();
        this.showDashboard();
        this.updateHeaderUserInfo();
        this.showMessage('Login successful!', 'success');
    }

    handleSignup() {
        const firstName = document.getElementById('signup-firstname').value;
        const lastName = document.getElementById('signup-lastname').value;
        const email = document.getElementById('signup-email').value;
        const phone = document.getElementById('signup-phone').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const agreeTerms = document.getElementById('agree-terms').checked;

        // Validation
        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage('Passwords do not match', 'error');
            return;
        }

        if (!agreeTerms) {
            this.showMessage('Please agree to the terms and conditions', 'error');
            return;
        }

        // Create user
        this.currentUser = {
            id: Date.now(),
            email: email,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            joinDate: new Date().toISOString().split('T')[0]
        };

        this.saveUserData();
        this.showDashboard();
        this.updateHeaderUserInfo();
        this.showMessage('Account created successfully!', 'success');
    }

    handleLogout() {
        this.currentUser = null;
        localStorage.removeItem('homeEssentials_user');
        
        // Show login form only if elements exist (on login page)
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const userDashboard = document.getElementById('user-dashboard');
        const loginFormElement = document.getElementById('login-form-element');
        const signupFormElement = document.getElementById('signup-form-element');
        
        if (loginForm) loginForm.style.display = 'block';
        if (signupForm) signupForm.style.display = 'none';
        if (userDashboard) userDashboard.style.display = 'none';
        
        // Reset forms only if they exist
        if (loginFormElement) loginFormElement.reset();
        if (signupFormElement) signupFormElement.reset();
        
        this.updateHeaderUserInfo();
        this.showMessage('Logged out successfully', 'success');
        
        // If not on login page, redirect to login page
        if (!loginForm && window.location.pathname !== '/login.html') {
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        }
    }

    checkAuthState() {
        if (this.currentUser) {
            this.showDashboard();
            this.updateHeaderUserInfo();
        }
    }

    showDashboard() {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('signup-form').style.display = 'none';
        document.getElementById('user-dashboard').style.display = 'block';
        
        // Update dashboard user name
        const dashboardUserName = document.getElementById('dashboard-user-name');
        if (dashboardUserName && this.currentUser) {
            dashboardUserName.textContent = this.currentUser.firstName;
        }
        
        // Load dashboard data
        this.loadOrders();
        this.loadProfile();
        this.loadAddresses();
    }

    updateHeaderUserInfo() {
        const userName = document.getElementById('user-name');
        const userEmail = document.getElementById('user-email');
        const loginAction = document.getElementById('login-action');
        const ordersAction = document.getElementById('orders-action');
        const profileAction = document.getElementById('profile-action');
        const logoutAction = document.getElementById('logout-action');

        if (this.currentUser) {
            userName.textContent = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
            userEmail.textContent = this.currentUser.email;
            
            loginAction.style.display = 'none';
            ordersAction.style.display = 'block';
            profileAction.style.display = 'block';
            logoutAction.style.display = 'block';
        } else {
            userName.textContent = 'Guest';
            userEmail.textContent = 'Not logged in';
            
            loginAction.style.display = 'block';
            ordersAction.style.display = 'none';
            profileAction.style.display = 'none';
            logoutAction.style.display = 'none';
        }
    }

    switchTab(tab) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}-tab`).classList.add('active');

        // Load tab-specific data
        switch (tab) {
            case 'orders':
                this.loadOrders();
                break;
            case 'profile':
                this.loadProfile();
                break;
            case 'addresses':
                this.loadAddresses();
                break;
        }
    }

    loadOrders() {
        const ordersList = document.getElementById('orders-list');
        if (!ordersList) return;

        if (this.orders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box"></i>
                    <h3>No Orders Yet</h3>
                    <p>Start shopping to see your orders here</p>
                    <a href="products.html" class="btn btn-primary">Browse Products</a>
                </div>
            `;
            return;
        }

        ordersList.innerHTML = this.orders.map(order => `
            <div class="order-card" onclick="authSystem.showOrderDetails('${order.id}')">
                <div class="order-header">
                    <div>
                        <div class="order-number">Order #${order.id}</div>
                        <div class="order-date">Placed on ${this.formatDate(order.date)}</div>
                    </div>
                    <div class="order-status ${order.status}">${order.status}</div>
                </div>
                
                <div class="order-items">
                    ${order.items.slice(0, 2).map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}" class="order-item-image">
                            <div class="order-item-details">
                                <div class="order-item-name">${item.name}</div>
                                <div class="order-item-quantity">Qty: ${item.quantity}</div>
                            </div>
                            <div class="order-item-price">₹${item.price.toLocaleString()}</div>
                        </div>
                    `).join('')}
                    ${order.items.length > 2 ? `<div class="order-item-more">+${order.items.length - 2} more items</div>` : ''}
                </div>
                
                <div class="order-total">
                    <div class="order-total-label">Total Amount</div>
                    <div class="order-total-amount">₹${order.grandTotal.toLocaleString()}</div>
                </div>
            </div>
        `).join('');
    }

    filterOrders(status) {
        const filteredOrders = status === 'all' ? this.orders : this.orders.filter(order => order.status === status);
        
        const ordersList = document.getElementById('orders-list');
        if (!ordersList) return;

        if (filteredOrders.length === 0) {
            ordersList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-box"></i>
                    <h3>No Orders Found</h3>
                    <p>No orders match the selected filter</p>
                </div>
            `;
            return;
        }

        ordersList.innerHTML = filteredOrders.map(order => `
            <div class="order-card" onclick="authSystem.showOrderDetails('${order.id}')">
                <div class="order-header">
                    <div>
                        <div class="order-number">Order #${order.id}</div>
                        <div class="order-date">Placed on ${this.formatDate(order.date)}</div>
                    </div>
                    <div class="order-status ${order.status}">${order.status}</div>
                </div>
                
                <div class="order-items">
                    ${order.items.slice(0, 2).map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}" class="order-item-image">
                            <div class="order-item-details">
                                <div class="order-item-name">${item.name}</div>
                                <div class="order-item-quantity">Qty: ${item.quantity}</div>
                            </div>
                            <div class="order-item-price">₹${item.price.toLocaleString()}</div>
                        </div>
                    `).join('')}
                    ${order.items.length > 2 ? `<div class="order-item-more">+${order.items.length - 2} more items</div>` : ''}
                </div>
                
                <div class="order-total">
                    <div class="order-total-label">Total Amount</div>
                    <div class="order-total-amount">₹${order.grandTotal.toLocaleString()}</div>
                </div>
            </div>
        `).join('');
    }

    showOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const modal = document.getElementById('order-details-modal');
        const modalBody = document.getElementById('order-details-body');
        
        if (!modal || !modalBody) return;

        modalBody.innerHTML = `
            <div class="order-details">
                <div class="order-info">
                    <h4>Order #${order.id}</h4>
                    <p><strong>Order Date:</strong> ${this.formatDate(order.date)}</p>
                    <p><strong>Status:</strong> <span class="order-status ${order.status}">${order.status}</span></p>
                    ${order.trackingNumber ? `<p><strong>Tracking Number:</strong> ${order.trackingNumber}</p>` : ''}
                </div>
                
                <div class="order-items-detailed">
                    <h5>Items Ordered</h5>
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}" class="order-item-image">
                            <div class="order-item-details">
                                <div class="order-item-name">${item.name}</div>
                                <div class="order-item-quantity">Quantity: ${item.quantity}</div>
                            </div>
                            <div class="order-item-price">₹${item.price.toLocaleString()}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="order-summary">
                    <h5>Order Summary</h5>
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>₹${order.total.toLocaleString()}</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping:</span>
                        <span>${order.shipping === 0 ? 'Free' : '₹' + order.shipping.toLocaleString()}</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax (18%):</span>
                        <span>₹${order.tax.toLocaleString()}</span>
                    </div>
                    <div class="summary-row total">
                        <span><strong>Total:</strong></span>
                        <span><strong>₹${order.grandTotal.toLocaleString()}</strong></span>
                    </div>
                </div>
                
                <div class="shipping-address">
                    <h5>Shipping Address</h5>
                    <p>
                        ${order.shippingAddress.name}<br>
                        ${order.shippingAddress.address}<br>
                        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br>
                        Phone: ${order.shippingAddress.phone}
                    </p>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    loadProfile() {
        if (!this.currentUser) return;

        const fields = ['firstname', 'lastname', 'email', 'phone'];
        fields.forEach(field => {
            const input = document.getElementById(`profile-${field}`);
            if (input) {
                const value = this.currentUser[field] || this.currentUser[field.replace('name', 'Name')] || '';
                input.value = value;
            }
        });

        // Profile form submission
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.onsubmit = (e) => {
                e.preventDefault();
                this.updateProfile();
            };
        }
    }

    updateProfile() {
        if (!this.currentUser) return;

        const firstName = document.getElementById('profile-firstname').value;
        const lastName = document.getElementById('profile-lastname').value;
        const phone = document.getElementById('profile-phone').value;

        this.currentUser.firstName = firstName;
        this.currentUser.lastName = lastName;
        this.currentUser.phone = phone;

        this.saveUserData();
        this.updateHeaderUserInfo();
        this.showMessage('Profile updated successfully!', 'success');
    }

    loadAddresses() {
        const addressesList = document.getElementById('addresses-list');
        if (!addressesList) return;

        if (this.addresses.length === 0) {
            addressesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-map-marker-alt"></i>
                    <h3>No Addresses Saved</h3>
                    <p>Add your shipping addresses for faster checkout</p>
                </div>
            `;
            return;
        }

        addressesList.innerHTML = this.addresses.map(address => `
            <div class="address-card ${address.isDefault ? 'default' : ''}">
                <div class="address-type">${address.type}</div>
                <div class="address-details">
                    <strong>${address.name}</strong><br>
                    ${address.address}<br>
                    ${address.city}, ${address.state} ${address.pincode}<br>
                    Phone: ${address.phone}
                </div>
                <div class="address-actions">
                    <button class="address-action" onclick="authSystem.editAddress(${address.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="address-action" onclick="authSystem.deleteAddress(${address.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    editAddress(addressId) {
        // In a real application, this would open an edit form
        this.showMessage('Edit address functionality would be implemented here', 'info');
    }

    deleteAddress(addressId) {
        if (confirm('Are you sure you want to delete this address?')) {
            this.addresses = this.addresses.filter(addr => addr.id !== addressId);
            this.saveUserData();
            this.loadAddresses();
            this.showMessage('Address deleted successfully', 'success');
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;

        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        messageDiv.style.backgroundColor = colors[type] || colors.info;

        messageDiv.textContent = message;
        document.body.appendChild(messageDiv);

        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(messageDiv);
            }, 300);
        }, 3000);

        // Add CSS for animations if not already present
        if (!document.querySelector('#message-animations')) {
            const style = document.createElement('style');
            style.id = 'message-animations';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Method to add order from checkout page
    addOrder(orderData) {
        const newOrder = {
            id: 'HE' + String(Date.now()).slice(-6),
            date: new Date().toISOString().split('T')[0],
            status: 'pending',
            ...orderData
        };

        this.orders.unshift(newOrder);
        this.saveUserData();
        return newOrder;
    }

    // Method to check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Method to get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Method to navigate to specific dashboard section
    navigateToDashboard(section = 'orders') {
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }
        
        // If already on login page, just switch to dashboard
        if (window.location.pathname.includes('login.html')) {
            this.showDashboard();
            this.switchTab(section);
        } else {
            // Navigate to login page with hash
            window.location.href = `login.html#${section}`;
        }
    }

    // Check URL hash on page load to navigate to specific section
    checkURLHash() {
        const hash = window.location.hash.substring(1);
        if (hash && this.currentUser) {
            this.showDashboard();
            this.switchTab(hash);
        }
    }
}

// Initialize auth system
const authSystem = new AuthSystem();

// Add CSS for order details modal
if (!document.querySelector('#order-details-styles')) {
    const style = document.createElement('style');
    style.id = 'order-details-styles';
    style.textContent = `
        .order-details {
            max-width: 100%;
        }
        
        .order-info {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e1e5e9;
        }
        
        .order-info h4 {
            color: var(--primary-color);
            margin-bottom: 10px;
        }
        
        .order-info p {
            margin-bottom: 8px;
            color: var(--text-color);
        }
        
        .order-items-detailed {
            margin-bottom: 25px;
        }
        
        .order-items-detailed h5 {
            color: var(--text-color);
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .order-summary {
            margin-bottom: 25px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .order-summary h5 {
            color: var(--text-color);
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            color: var(--text-color);
        }
        
        .summary-row.total {
            border-top: 1px solid #e1e5e9;
            padding-top: 10px;
            font-size: 1.1rem;
        }
        
        .shipping-address {
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        .shipping-address h5 {
            color: var(--text-color);
            margin-bottom: 15px;
            font-size: 1.2rem;
        }
        
        .shipping-address p {
            color: var(--text-color);
            line-height: 1.6;
            margin: 0;
        }
    `;
    document.head.appendChild(style);
}

// Export for other modules
window.authSystem = authSystem;
