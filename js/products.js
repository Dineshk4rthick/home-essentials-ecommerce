// Product Database
const products = [
    // Storage Organizers
    {
        id: 1,
        title: "Airtight Storage Containers Set",
        category: "storage",
        price: 1299,
        originalPrice: 1899,
        description: "Premium airtight containers perfect for kitchen storage. Keeps food fresh longer with leak-proof design.",
        image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        rating: 4.8,
        reviews: 324,
        inStock: true,
        featured: true,
        discount: 32
    },
    {
        id: 2,
        title: "Vacuum Storage Bags",
        category: "storage",
        price: 899,
        originalPrice: 1299,
        description: "Space-saving vacuum storage bags for clothes, bedding, and seasonal items. Reduces storage space by 80%.",
        image: "assets/images/vaccum storage bag.jpg",
        rating: 4.6,
        reviews: 156,
        inStock: true,
        featured: false,
        discount: 31
    },
    {
        id: 3,
        title: "Kitchen Organizer Rack",
        category: "storage",
        price: 1599,
        originalPrice: 2299,
        description: "Multi-tier kitchen organizer rack with adjustable shelves. Perfect for spices, utensils, and cookware.",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        rating: 4.7,
        reviews: 89,
        inStock: true,
        featured: true,
        discount: 30
    },
    {
        id: 4,
        title: "Wardrobe Organization Set",
        category: "storage",
        price: 2199,
        originalPrice: 2999,
        description: "Complete wardrobe organization system with hanging organizers, drawer dividers, and shoe racks.",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        rating: 4.9,
        reviews: 267,
        inStock: true,
        featured: false,
        discount: 27
    },
    {
        id: 5,
        title: "Drawer Dividers Set",
        category: "storage",
        price: 799,
        originalPrice: 1199,
        description: "Adjustable drawer dividers for organized storage. Perfect for office supplies, jewelry, and small items.",
        image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        rating: 4.5,
        reviews: 123,
        inStock: true,
        featured: false,
        discount: 33
    },
    {
        id: 6,
        title: "Under-Bed Storage Box",
        category: "storage",
        price: 1499,
        originalPrice: 1999,
        description: "Large under-bed storage box with wheels for easy access. Ideal for seasonal clothing and bedding.",
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        rating: 4.4,
        reviews: 98,
        inStock: true,
        featured: false,
        discount: 25
    },

    // Cookware
    {
        id: 7,
        title: "Non-Stick Pan Set",
        category: "cookware",
        price: 2499,
        originalPrice: 3499,
        description: "Professional-grade non-stick pan set with ceramic coating. Includes 3 different sizes for all cooking needs.",
        image: "assets/images/pan.webp",
        rating: 4.8,
        reviews: 445,
        inStock: true,
        featured: true,
        discount: 29
    },
    {
        id: 8,
        title: "Pressure Cooker",
        category: "cookware",
        price: 1899,
        originalPrice: 2599,
        description: "Heavy-duty pressure cooker with multiple safety features. Cooks food 70% faster while retaining nutrients.",
        image: "assets/images/cooker.jpg",
        rating: 4.7,
        reviews: 234,
        inStock: true,
        featured: false,
        discount: 27
    },
    {
        id: 9,
        title: "Kitchen Utensil Set",
        category: "cookware",
        price: 1299,
        originalPrice: 1799,
        description: "Complete kitchen utensil set with wooden handles. Includes all essential tools for modern cooking.",
        image: "assets/images/utensil.jpg",
        rating: 4.6,
        reviews: 178,
        inStock: true,
        featured: true,
        discount: 28
    },

    // Bathroom Essentials
    {
        id: 10,
        title: "Towel Warmer Rack",
        category: "bathroom",
        price: 1799,
        originalPrice: 2399,
        description: "Electric towel warmer rack with timer function. Keeps towels warm and dry while preventing bacterial growth.",
        image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        rating: 4.5,
        reviews: 67,
        inStock: true,
        featured: false,
        discount: 25
    },
    {
        id: 11,
        title: "Shower Organizer",
        category: "bathroom",
        price: 1199,
        originalPrice: 1699,
        description: "Rust-proof shower organizer with multiple compartments. Easy installation without drilling or tools.",
        image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        rating: 4.4,
        reviews: 145,
        inStock: true,
        featured: false,
        discount: 29
    },
    {
        id: 12,
        title: "Bath Mat Set",
        category: "bathroom",
        price: 899,
        originalPrice: 1299,
        description: "Luxury bath mat set with anti-slip backing. Super absorbent and quick-drying microfiber material.",
        image: "https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        rating: 4.6,
        reviews: 203,
        inStock: true,
        featured: false,
        discount: 31
    },

    // Kids Products
    {
        id: 13,
        title: "Kids Storage Bins",
        category: "kids",
        price: 1099,
        originalPrice: 1599,
        description: "Colorful and safe storage bins for children's toys. Made from non-toxic materials with fun animal designs.",
        image: "assets/images/kids.jpg",
        rating: 4.7,
        reviews: 189,
        inStock: true,
        featured: true,
        discount: 31
    },
    {
        id: 14,
        title: "Toy Organization System",
        category: "kids",
        price: 1899,
        originalPrice: 2499,
        description: "Complete toy organization system with bins, shelves, and labels. Teaches kids to keep things organized.",
        image: "assets/images/toy.jpg",
        rating: 4.8,
        reviews: 134,
        inStock: true,
        featured: false,
        discount: 24
    },

    // Floor Mats
    {
        id: 15,
        title: "Anti-Slip Door Mat",
        category: "mats",
        price: 799,
        originalPrice: 1199,
        description: "Heavy-duty anti-slip door mat with excellent dirt trapping ability. Weather-resistant and easy to clean.",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        rating: 4.3,
        reviews: 287,
        inStock: true,
        featured: false,
        discount: 33
    },
    {
        id: 16,
        title: "Kitchen Floor Mat",
        category: "mats",
        price: 1299,
        originalPrice: 1799,
        description: "Cushioned kitchen floor mat that reduces fatigue. Waterproof and stain-resistant with beveled edges.",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        rating: 4.5,
        reviews: 156,
        inStock: true,
        featured: false,
        discount: 28
    },

    // Sofa Covers
    {
        id: 17,
        title: "Premium Sofa Cover Set",
        category: "sofa",
        price: 2299,
        originalPrice: 2999,
        description: "Stretchable premium sofa cover set that fits most sofas. Protects furniture from stains, pets, and wear.",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        rating: 4.6,
        reviews: 198,
        inStock: true,
        featured: false,
        discount: 23
    },

    // Trash Solutions
    {
        id: 18,
        title: "Smart Trash Can",
        category: "trash",
        price: 1599,
        originalPrice: 2199,
        description: "Motion sensor trash can with automatic lid opening. Hygienic and convenient with long battery life.",
        image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
        rating: 4.4,
        reviews: 89,
        inStock: true,
        featured: false,
        discount: 27
    }
];

// Category mapping
const categoryNames = {
    storage: "Storage Organizers",
    cookware: "Cookware",
    bathroom: "Bathroom Essentials",
    kids: "Kids Products",
    mats: "Floor Mats",
    sofa: "Sofa Covers",
    trash: "Trash Solutions"
};

// Utility functions
function formatPrice(price) {
    return `₹${price.toLocaleString('en-IN')}`;
}

function calculateDiscount(original, current) {
    return Math.round(((original - current) / original) * 100);
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
                <div class="product-discount">${product.discount}% OFF</div>
                <button class="product-wishlist" data-id="${product.id}" aria-label="Add to wishlist">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <div class="product-category">${categoryNames[product.category]}</div>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <div class="stars">${generateStars(product.rating)}</div>
                    <span class="rating-text">(${product.reviews} reviews)</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${formatPrice(product.price)}</span>
                    <span class="original-price">${formatPrice(product.originalPrice)}</span>
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                    <button class="quick-view" data-id="${product.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Get products by category
function getProductsByCategory(category) {
    if (!category || category === 'all') {
        return products;
    }
    return products.filter(product => product.category === category);
}

// Get featured products
function getFeaturedProducts(limit = 6) {
    return products.filter(product => product.featured).slice(0, limit);
}

// Search products
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        categoryNames[product.category].toLowerCase().includes(searchTerm)
    );
}

// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === parseInt(id));
}

// Sort products
function sortProducts(productsArray, sortBy) {
    const sorted = [...productsArray];
    
    switch (sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'newest':
            return sorted.sort((a, b) => b.id - a.id);
        case 'popular':
            return sorted.sort((a, b) => b.reviews - a.reviews);
        default:
            return sorted;
    }
}

// Filter products by price range
function filterByPriceRange(productsArray, minPrice, maxPrice) {
    return productsArray.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );
}

// Filter products by rating
function filterByRating(productsArray, minRating) {
    return productsArray.filter(product => product.rating >= minRating);
}

// Get price range for category
function getPriceRange(category = null) {
    const categoryProducts = category ? getProductsByCategory(category) : products;
    const prices = categoryProducts.map(p => p.price);
    return {
        min: Math.min(...prices),
        max: Math.max(...prices)
    };
}

// Load products into grid
function loadProductsIntoGrid(containerId, productsToShow) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
    
    // Add event listeners for add to cart buttons
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(button.dataset.id);
            const product = getProductById(productId);
            if (product) {
                addToCart(product);
                showNotification(`${product.title} added to cart!`, 'success');
            }
        });
    });
    
    // Add event listeners for wishlist buttons
    container.querySelectorAll('.product-wishlist').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productId = parseInt(button.dataset.id);
            toggleWishlist(productId);
        });
    });
    
    // Add event listeners for quick view
    container.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(button.dataset.id);
            showQuickView(productId);
        });
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// Wishlist functionality
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    const button = document.querySelector(`[data-id="${productId}"].product-wishlist`);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        button.innerHTML = '<i class="far fa-heart"></i>';
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push(productId);
        button.innerHTML = '<i class="fas fa-heart"></i>';
        showNotification('Added to wishlist', 'success');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Update wishlist icons on page load
function updateWishlistIcons() {
    wishlist.forEach(productId => {
        const button = document.querySelector(`[data-id="${productId}"].product-wishlist`);
        if (button) {
            button.innerHTML = '<i class="fas fa-heart"></i>';
        }
    });
}

// Quick view functionality
function showQuickView(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-overlay"></div>
        <div class="quick-view-content">
            <button class="quick-view-close">
                <i class="fas fa-times"></i>
            </button>
            <div class="quick-view-product">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="product-discount">${product.discount}% OFF</div>
                </div>
                <div class="quick-view-info">
                    <div class="product-category">${categoryNames[product.category]}</div>
                    <h2 class="product-title">${product.title}</h2>
                    <div class="product-rating">
                        <div class="stars">${generateStars(product.rating)}</div>
                        <span class="rating-text">(${product.reviews} reviews)</span>
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <span class="current-price">${formatPrice(product.price)}</span>
                        <span class="original-price">${formatPrice(product.originalPrice)}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary add-to-cart-modal" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                        <button class="btn btn-outline wishlist-modal" data-id="${product.id}">
                            <i class="${wishlist.includes(product.id) ? 'fas' : 'far'} fa-heart"></i>
                            Wishlist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 100);
    
    // Add event listeners
    modal.querySelector('.quick-view-close').addEventListener('click', () => closeQuickView(modal));
    modal.querySelector('.quick-view-overlay').addEventListener('click', () => closeQuickView(modal));
    modal.querySelector('.add-to-cart-modal').addEventListener('click', () => {
        addToCart(product);
        showNotification(`${product.title} added to cart!`, 'success');
        closeQuickView(modal);
    });
    modal.querySelector('.wishlist-modal').addEventListener('click', () => {
        toggleWishlist(product.id);
        const icon = modal.querySelector('.wishlist-modal i');
        icon.className = wishlist.includes(product.id) ? 'fas fa-heart' : 'far fa-heart';
    });
}

function closeQuickView(modal) {
    modal.classList.remove('active');
    setTimeout(() => document.body.removeChild(modal), 300);
}

// Initialize products on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load featured products on homepage
    if (document.getElementById('featured-products-grid')) {
        const featuredProducts = getFeaturedProducts();
        loadProductsIntoGrid('featured-products-grid', featuredProducts);
    }
    
    // Update wishlist icons
    updateWishlistIcons();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        categoryNames,
        getProductsByCategory,
        getFeaturedProducts,
        searchProducts,
        getProductById,
        sortProducts,
        filterByPriceRange,
        filterByRating,
        getPriceRange,
        loadProductsIntoGrid
    };
}
