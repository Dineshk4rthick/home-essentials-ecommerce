// Main JavaScript File for Home Essentials Website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

window.addEventListener('load', function() {
    // Check Font Awesome loading
    checkFontAwesome();
    
    // Ensure all scripts are loaded, then update user menu
    setTimeout(() => {
        if (typeof updateUserMenuDisplay === 'function') {
            updateUserMenuDisplay();
        }
    }, 100);
});

function initializeWebsite() {
    // Initialize all components
    initializeNavigation();
    initializeSearch();
    initializeHeroAnimations();
    initializeCategoryCards();
    initializeNewsletterForm();
    initializeScrollEffects();
    initializeResponsiveFeatures();
    initializeUserMenu();
    
    // Performance optimizations
    initializeLazyLoading();
    initializeImageOptimization();
}

// Navigation functionality
function initializeNavigation() {
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Close nav menu when clicking on links (for mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
        });
    });

    // Handle dropdown menus
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            });
        }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Active link highlighting
    updateActiveNavLink();
    
    // Scroll header behavior
    initializeScrollHeader();
}

function updateActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

function initializeScrollHeader() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }

        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchContainer = document.querySelector('.search-container');

    if (searchInput && searchBtn && searchContainer) {
        // Mobile search toggle
        if (window.innerWidth <= 768) {
            searchContainer.classList.add('mobile-search');
            searchBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (searchContainer.classList.contains('expanded')) {
                    // If expanded, perform search
                    if (searchInput.value.trim()) {
                        performSearch();
                    } else {
                        // If empty, collapse search
                        searchContainer.classList.remove('expanded');
                        searchInput.blur();
                    }
                } else {
                    // Expand search box
                    searchContainer.classList.add('expanded');
                    searchInput.focus();
                }
            });
        }

        // Search on enter key
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Desktop search on button click
        if (window.innerWidth > 768) {
            searchBtn.addEventListener('click', performSearch);
        }

        // Live search suggestions (debounced)
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (e.target.value.length >= 2) {
                    showSearchSuggestions(e.target.value);
                } else {
                    hideSearchSuggestions();
                }
            }, 300);
        });

        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchContainer.contains(e.target)) {
                hideSearchSuggestions();
                if (window.innerWidth <= 768 && !searchInput.value.trim()) {
                    searchContainer.classList.remove('expanded');
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                searchContainer.classList.remove('mobile-search', 'expanded');
            } else {
                searchContainer.classList.add('mobile-search');
            }
        });
    }
}

function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    
    if (query.length === 0) {
        showNotification('Please enter a search term', 'warning');
        return;
    }

    // Redirect to products page with search query
    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
}

function showSearchSuggestions(query) {
    if (typeof searchProducts !== 'function') return;
    
    const results = searchProducts(query).slice(0, 5);
    const searchContainer = document.querySelector('.search-container');
    
    // Remove existing suggestions
    const existingSuggestions = document.querySelector('.search-suggestions');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }

    if (results.length === 0) return;

    const suggestionsHTML = `
        <div class="search-suggestions">
            ${results.map(product => `
                <div class="search-suggestion" onclick="window.location.href='products.html?id=${product.id}'">
                    <img src="${product.image}" alt="${product.title}" width="40" height="40">
                    <div class="suggestion-info">
                        <div class="suggestion-title">${product.title}</div>
                        <div class="suggestion-price">${formatPrice(product.price)}</div>
                    </div>
                </div>
            `).join('')}
            <div class="search-suggestion search-all" onclick="performSearch()">
                <i class="fas fa-search"></i>
                <span>Search for "${query}"</span>
            </div>
        </div>
    `;

    searchContainer.insertAdjacentHTML('beforeend', suggestionsHTML);
}

function hideSearchSuggestions() {
    const suggestions = document.querySelector('.search-suggestions');
    if (suggestions) {
        suggestions.remove();
    }
}

// Hero section animations
function initializeHeroAnimations() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    // Parallax effect for hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Typing effect for hero title (optional enhancement)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.dataset.typewriter) {
        initializeTypewriter(heroTitle);
    }
}

function initializeTypewriter(element) {
    const text = element.textContent;
    const gradientText = element.querySelector('.gradient-text');
    const gradientTextContent = gradientText ? gradientText.textContent : '';
    
    element.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    typeWriter();
}

// Category cards interaction
function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            if (category) {
                window.location.href = `products.html?category=${category}`;
            }
        });

        // Add hover effect with sound (optional)
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Newsletter form handling
function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Simulate newsletter subscription
            const button = newsletterForm.querySelector('button');
            const originalText = button.innerHTML;
            
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            button.disabled = true;

            setTimeout(() => {
                showNotification('Successfully subscribed to newsletter!', 'success');
                emailInput.value = '';
                button.innerHTML = originalText;
                button.disabled = false;
                
                // Store subscription in localStorage (for demo)
                const subscriptions = JSON.parse(localStorage.getItem('newsletter_subscriptions') || '[]');
                subscriptions.push({
                    email: email,
                    date: new Date().toISOString()
                });
                localStorage.setItem('newsletter_subscriptions', JSON.stringify(subscriptions));
            }, 2000);
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Scroll effects and animations
function initializeScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.product-card, .category-card, .feature-card').forEach(el => {
        observer.observe(el);
    });

    // Back to top button
    createBackToTopButton();
}

function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
    
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Responsive features
function initializeResponsiveFeatures() {
    // Touch gestures for mobile
    if ('ontouchstart' in window) {
        enableTouchGestures();
    }

    // Responsive image loading
    handleResponsiveImages();
    
    // Viewport height fix for mobile
    fixViewportHeight();
}

function enableTouchGestures() {
    let startX, startY, endX, endY;

    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        handleGesture();
    });

    function handleGesture() {
        const diffX = startX - endX;
        const diffY = startY - endY;

        // Swipe detection
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    // Swipe left
                    handleSwipeLeft();
                } else {
                    // Swipe right
                    handleSwipeRight();
                }
            }
        }
    }

    function handleSwipeLeft() {
        // Close cart if open
        if (cart && cart.isOpen) {
            cart.closeCart();
        }
    }

    function handleSwipeRight() {
        // Open cart if it has items
        if (cart && cart.getItemCount() > 0) {
            cart.openCart();
        }
    }
}

function handleResponsiveImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

function fixViewportHeight() {
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setVH();
    window.addEventListener('resize', setVH);
}

// Lazy loading for performance
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    // Add fade-in effect when images load
    lazyImages.forEach(img => {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });
}

// Image optimization
function initializeImageOptimization() {
    // Preload critical images
    const criticalImages = [
        'hero-bg.jpg',
        'logo.png'
    ];

    criticalImages.forEach(imageName => {
        const img = new Image();
        img.src = `assets/images/${imageName}`;
    });

    // Optimize background images for retina displays
    if (window.devicePixelRatio > 1) {
        const bgImages = document.querySelectorAll('[data-bg-2x]');
        bgImages.forEach(element => {
            const highResImage = element.dataset.bg2x;
            element.style.backgroundImage = `url(${highResImage})`;
        });
    }
}

// User Menu functionality
function initializeUserMenu() {
    const userBtn = document.getElementById('user-btn');
    const userText = document.getElementById('user-text');
    const userDropdown = document.getElementById('user-dropdown');
    const logoutAction = document.getElementById('logout-action');
    const ordersAction = document.getElementById('orders-action');
    const profileAction = document.getElementById('profile-action');
    
    if (userBtn && userDropdown) {
        // Toggle dropdown on click
        userBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const isLoggedIn = localStorage.getItem('homeEssentials_user');
            
            if (isLoggedIn) {
                // If logged in, show dropdown
                userDropdown.classList.toggle('active');
            } else {
                // If not logged in, redirect to login page
                window.location.href = 'login.html';
            }
        });

        document.addEventListener('click', (e) => {
            if (!userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });

        // Handle logout click
        if (logoutAction) {
            logoutAction.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (window.authSystem) {
                    window.authSystem.handleLogout();
                } else {
                    // Fallback logout
                    localStorage.removeItem('homeEssentials_user');
                    showNotification('Logged out successfully!', 'success');
                    updateUserMenuDisplay();
                }
                userDropdown.classList.remove('active');
            });
        }

        // Handle orders click
        if (ordersAction) {
            ordersAction.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const userData = localStorage.getItem('homeEssentials_user');
                if (userData) {
                    window.location.href = 'login.html#orders';
                } else {
                    window.location.href = 'login.html';
                }
                userDropdown.classList.remove('active');
            });
        }

        // Handle profile click
        if (profileAction) {
            profileAction.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const userData = localStorage.getItem('homeEssentials_user');
                if (userData) {
                    window.location.href = 'login.html#profile';
                } else {
                    window.location.href = 'login.html';
                }
                userDropdown.classList.remove('active');
            });
        }
    }
    
    // Initial update
    updateUserMenuDisplay();
}

function updateUserMenuDisplay() {
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');
    const loginAction = document.getElementById('login-action');
    const ordersAction = document.getElementById('orders-action');
    const profileAction = document.getElementById('profile-action');
    const logoutAction = document.getElementById('logout-action');

    // Check localStorage for user data
    const userData = localStorage.getItem('homeEssentials_user');
    const currentUser = userData ? JSON.parse(userData) : null;

    if (currentUser) {
        if (userName) userName.textContent = `${currentUser.firstName} ${currentUser.lastName}`;
        if (userEmail) userEmail.textContent = currentUser.email;
        
        if (loginAction) loginAction.style.display = 'none';
        if (ordersAction) ordersAction.style.display = 'block';
        if (profileAction) profileAction.style.display = 'block';
        if (logoutAction) logoutAction.style.display = 'block';
    } else {
        if (userName) userName.textContent = 'Guest';
        if (userEmail) userEmail.textContent = 'Not logged in';
        
        if (loginAction) loginAction.style.display = 'block';
        if (ordersAction) ordersAction.style.display = 'none';
        if (profileAction) profileAction.style.display = 'none';
        if (logoutAction) logoutAction.style.display = 'none';
    }
    
    // Update user button text based on login status
    updateUserButtonText();
}

function updateUserButtonText() {
    const userBtn = document.getElementById('user-btn');
    const userText = document.getElementById('user-text');
    
    if (userBtn && userText) {
        const isLoggedIn = localStorage.getItem('homeEssentials_user');
        const loginText = userBtn.getAttribute('data-login-text') || 'Login';
        const logoutText = userBtn.getAttribute('data-logout-text') || 'Logout';
        
        if (isLoggedIn) {
            userText.textContent = logoutText;
            userBtn.classList.add('logged-in');
            userBtn.title = 'User Account Menu - Click to logout';
        } else {
            userText.textContent = loginText;
            userBtn.classList.remove('logged-in');
            userBtn.title = 'Click to login';
        }
    }
}

// Check for auth system updates periodically
setInterval(() => {
    updateUserMenuDisplay();
}, 500);

// Listen for storage changes (when user logs in/out in another tab)
window.addEventListener('storage', (e) => {
    if (e.key === 'homeEssentials_user') {
        updateUserMenuDisplay();
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles if they don't exist
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            }
            .notification.show {
                transform: translateX(0);
            }
            .notification-success {
                background: linear-gradient(45deg, #28a745, #20c997);
            }
            .notification-error {
                background: linear-gradient(45deg, #dc3545, #fd7e14);
            }
            .notification-info {
                background: linear-gradient(45deg, #17a2b8, #6f42c1);
            }
            .notification-warning {
                background: linear-gradient(45deg, #ffc107, #fd7e14);
                color: #212529;
            }
            .notification i {
                margin-right: 10px;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility functions
function formatPrice(price) {
    return `₹${price.toLocaleString('en-IN')}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Analytics and tracking (for future implementation)
function trackEvent(eventName, properties = {}) {
    // Google Analytics 4 event tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Console log for development
    console.log('Event tracked:', eventName, properties);
}

// Performance monitoring
function measurePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            console.log(`Page load time: ${loadTime}ms`);
            console.log(`DOM ready time: ${domReadyTime}ms`);
            
            // Track performance metrics
            trackEvent('page_performance', {
                load_time: loadTime,
                dom_ready_time: domReadyTime
            });
        });
    }
}

// Initialize performance monitoring
measurePerformance();

// Global error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno
    });
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add additional CSS for new features
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .search-suggestions {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        z-index: 1000;
        max-height: 300px;
        overflow-y: auto;
    }

    .search-suggestion {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 15px;
        cursor: pointer;
        transition: background-color 0.2s;
        border-bottom: 1px solid #eee;
    }

    .search-suggestion:hover {
        background-color: #f8f9ff;
    }

    .search-suggestion:last-child {
        border-bottom: none;
    }

    .search-suggestion img {
        border-radius: 4px;
        object-fit: cover;
    }

    .suggestion-info {
        flex: 1;
    }

    .suggestion-title {
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 2px;
    }

    .suggestion-price {
        font-size: 12px;
        color: #667eea;
        font-weight: 600;
    }

    .search-all {
        background-color: #f8f9ff;
        color: #667eea;
        font-weight: 500;
    }

    .back-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s ease;
        box-shadow: 0 5px 20px rgba(102, 126, 234, 0.3);
    }

    .back-to-top.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }

    .back-to-top:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    }

    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    img.loaded {
        animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @media (max-width: 768px) {
        .back-to-top {
            bottom: 20px;
            right: 20px;
            width: 45px;
            height: 45px;
        }

        .search-suggestions {
            position: fixed;
            top: 70px;
            left: 15px;
            right: 15px;
        }
    }
`;

document.head.appendChild(additionalStyles);

// Check if Font Awesome is loaded and provide fallbacks
function checkFontAwesome() {
    const testIcon = document.createElement('i');
    testIcon.className = 'fas fa-user';
    testIcon.style.position = 'absolute';
    testIcon.style.left = '-9999px';
    document.body.appendChild(testIcon);
    
    const computedStyle = window.getComputedStyle(testIcon, ':before');
    const content = computedStyle.getPropertyValue('content');
    
    document.body.removeChild(testIcon);
    
    if (!content || content === 'none' || content === '""') {
        // Font Awesome not loaded, use Unicode fallbacks
        const userBtn = document.getElementById('user-btn');
        if (userBtn) {
            const userIcon = userBtn.querySelector('i[data-profile-placeholder]');
            if (userIcon) {
                const placeholder = userIcon.getAttribute('data-profile-placeholder');
                userIcon.textContent = placeholder || '👤';
                userIcon.style.fontFamily = 'inherit';
                userIcon.style.fontSize = '1.2rem';
                userIcon.classList.remove('fas', 'fa-user');
            } else {
                userBtn.innerHTML = '👤';
                userBtn.style.fontSize = '1.2rem';
            }
        }
        
        // Update other icons as well
        const searchBtn = document.getElementById('search-btn');
        if (searchBtn) {
            const searchIcon = searchBtn.querySelector('i');
            if (searchIcon) {
                searchIcon.textContent = '🔍';
                searchIcon.style.fontFamily = 'inherit';
                searchIcon.classList.remove('fas', 'fa-search');
            }
        }
        
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            const cartIcon = cartBtn.querySelector('i');
            if (cartIcon) {
                cartIcon.textContent = '🛒';
                cartIcon.style.fontFamily = 'inherit';
                cartIcon.classList.remove('fas', 'fa-shopping-cart');
            }
        }
        
        // Update dropdown icons
        const dropdownIcons = document.querySelectorAll('.user-dropdown i');
        dropdownIcons.forEach(icon => {
            if (icon.classList.contains('fa-user-circle')) {
                icon.textContent = '👤';
                icon.style.fontFamily = 'inherit';
                icon.classList.remove('fas', 'fa-user-circle');
            } else if (icon.classList.contains('fa-sign-in-alt')) {
                icon.textContent = '🔑';
                icon.style.fontFamily = 'inherit';
                icon.classList.remove('fas', 'fa-sign-in-alt');
            } else if (icon.classList.contains('fa-box')) {
                icon.textContent = '📦';
                icon.style.fontFamily = 'inherit';
                icon.classList.remove('fas', 'fa-box');
            } else if (icon.classList.contains('fa-user-cog')) {
                icon.textContent = '⚙️';
                icon.style.fontFamily = 'inherit';
                icon.classList.remove('fas', 'fa-user-cog');
            } else if (icon.classList.contains('fa-sign-out-alt')) {
                icon.textContent = '🚪';
                icon.style.fontFamily = 'inherit';
                icon.classList.remove('fas', 'fa-sign-out-alt');
            }
        });
    }
}

// Initial check for Font Awesome
checkFontAwesome();
