// Products Page Functionality
class ProductsPage {
    constructor() {
        this.currentProducts = [];
        this.filteredProducts = [];
        this.currentFilters = {
            category: 'all',
            priceMin: 799,
            priceMax: 2499,
            rating: 'all',
            inStock: true,
            featured: false,
            search: ''
        };
        this.currentSort = 'default';
        this.currentView = 'grid';
        this.productsPerPage = 12;
        this.currentPage = 1;
        
        this.init();
    }

    init() {
        this.loadProducts();
        this.bindEvents();
        this.parseURLParams();
        this.applyFilters();
        this.updateDisplay();
    }

    loadProducts() {
        this.currentProducts = [...products];
        this.filteredProducts = [...products];
    }

    bindEvents() {
        // Category filters
        document.querySelectorAll('input[name="category"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.applyFilters();
                this.updateURL();
            });
        });

        // Rating filters
        document.querySelectorAll('input[name="rating"]').forEach(input => {
            input.addEventListener('change', (e) => {
                this.currentFilters.rating = e.target.value;
                this.applyFilters();
            });
        });

        // Price range inputs
        const priceMin = document.getElementById('price-min');
        const priceMax = document.getElementById('price-max');
        const priceRangeMin = document.getElementById('price-range-min');
        const priceRangeMax = document.getElementById('price-range-max');

        if (priceMin && priceMax) {
            priceMin.addEventListener('input', (e) => {
                const value = parseInt(e.target.value) || 799;
                this.currentFilters.priceMin = value;
                priceRangeMin.value = value;
                this.applyFilters();
            });

            priceMax.addEventListener('input', (e) => {
                const value = parseInt(e.target.value) || 2499;
                this.currentFilters.priceMax = value;
                priceRangeMax.value = value;
                this.applyFilters();
            });
        }

        if (priceRangeMin && priceRangeMax) {
            priceRangeMin.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.currentFilters.priceMin = value;
                priceMin.value = value;
                this.applyFilters();
            });

            priceRangeMax.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                this.currentFilters.priceMax = value;
                priceMax.value = value;
                this.applyFilters();
            });
        }

        // Availability filters
        const inStockFilter = document.getElementById('in-stock');
        const featuredFilter = document.getElementById('featured');

        if (inStockFilter) {
            inStockFilter.addEventListener('change', (e) => {
                this.currentFilters.inStock = e.target.checked;
                this.applyFilters();
            });
        }

        if (featuredFilter) {
            featuredFilter.addEventListener('change', (e) => {
                this.currentFilters.featured = e.target.checked;
                this.applyFilters();
            });
        }

        // Sort dropdown
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applySorting();
                this.updateDisplay();
            });
        }

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.closest('.view-btn').dataset.view;
                this.switchView(view);
            });
        });

        // Mobile filters toggle
        const filtersToggle = document.getElementById('filters-toggle');
        if (filtersToggle) {
            filtersToggle.addEventListener('click', () => {
                this.toggleMobileFilters();
            });
        }

        // Clear filters
        const clearFiltersBtn = document.getElementById('clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }

        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.currentFilters.search = e.target.value.trim();
                    this.applyFilters();
                }, 300);
            });
        }

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMore();
            });
        }

        // Close mobile filters when clicking overlay
        document.addEventListener('click', (e) => {
            const sidebar = document.querySelector('.filters-sidebar');
            const toggle = document.getElementById('filters-toggle');
            
            if (sidebar && sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && !toggle.contains(e.target)) {
                this.closeMobileFilters();
            }
        });
    }

    parseURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Category filter
        const category = urlParams.get('category');
        if (category && category !== 'all') {
            this.currentFilters.category = category;
            const categoryInput = document.querySelector(`input[name="category"][value="${category}"]`);
            if (categoryInput) {
                categoryInput.checked = true;
            }
        }

        // Search query
        const search = urlParams.get('search');
        if (search) {
            this.currentFilters.search = search;
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.value = search;
            }
        }

        // Product ID (for direct product view)
        const productId = urlParams.get('id');
        if (productId) {
            this.showProductModal(parseInt(productId));
        }
    }

    applyFilters() {
        let filtered = [...this.currentProducts];

        // Category filter
        if (this.currentFilters.category !== 'all') {
            filtered = filtered.filter(product => 
                product.category === this.currentFilters.category
            );
        }

        // Price range filter
        filtered = filtered.filter(product => 
            product.price >= this.currentFilters.priceMin && 
            product.price <= this.currentFilters.priceMax
        );

        // Rating filter
        if (this.currentFilters.rating !== 'all') {
            const minRating = parseFloat(this.currentFilters.rating);
            filtered = filtered.filter(product => product.rating >= minRating);
        }

        // Stock filter
        if (this.currentFilters.inStock) {
            filtered = filtered.filter(product => product.inStock);
        }

        // Featured filter
        if (this.currentFilters.featured) {
            filtered = filtered.filter(product => product.featured);
        }

        // Search filter
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(product =>
                product.title.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                categoryNames[product.category].toLowerCase().includes(searchTerm)
            );
        }

        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.applySorting();
        this.updateDisplay();
        this.updateActiveFilters();
    }

    applySorting() {
        switch (this.currentSort) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                this.filteredProducts.sort((a, b) => b.id - a.id);
                break;
            case 'popular':
                this.filteredProducts.sort((a, b) => b.reviews - a.reviews);
                break;
            default:
                // Default sorting (featured first, then by ID)
                this.filteredProducts.sort((a, b) => {
                    if (a.featured && !b.featured) return -1;
                    if (!a.featured && b.featured) return 1;
                    return a.id - b.id;
                });
        }
    }

    updateDisplay() {
        this.updatePageTitle();
        this.updateProductsCount();
        this.updateProductsGrid();
        this.updateLoadMoreButton();
        this.updateNoResultsMessage();
    }

    updatePageTitle() {
        const pageTitle = document.getElementById('page-title');
        const pageSubtitle = document.getElementById('page-subtitle');
        const breadcrumbCurrent = document.getElementById('breadcrumb-current');
        
        let title = 'All Products';
        let subtitle = 'Discover our complete collection of quality home essentials';

        if (this.currentFilters.category !== 'all') {
            title = categoryNames[this.currentFilters.category];
            subtitle = `Browse our ${categoryNames[this.currentFilters.category].toLowerCase()} collection`;
        }

        if (this.currentFilters.search) {
            title = `Search Results for "${this.currentFilters.search}"`;
            subtitle = `Found ${this.filteredProducts.length} products matching your search`;
        }

        if (pageTitle) pageTitle.textContent = title;
        if (pageSubtitle) pageSubtitle.textContent = subtitle;
        if (breadcrumbCurrent) breadcrumbCurrent.textContent = title;
        
        // Update page title
        document.title = `${title} - Home Essentials`;
    }

    updateProductsCount() {
        const countsElement = document.getElementById('products-count');
        if (countsElement) {
            const count = this.filteredProducts.length;
            countsElement.textContent = `${count} product${count !== 1 ? 's' : ''}`;
        }
    }

    updateProductsGrid() {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        if (this.filteredProducts.length === 0) {
            grid.innerHTML = '';
            return;
        }

        const productsToShow = this.filteredProducts.slice(0, this.currentPage * this.productsPerPage);
        
        grid.innerHTML = productsToShow.map(product => createProductCard(product)).join('');
        
        // Set view class
        grid.className = `products-grid ${this.currentView}-view`;
        
        // Add event listeners
        this.bindProductEvents(grid);
    }

    bindProductEvents(container) {
        // Add to cart buttons
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

        // Wishlist buttons
        container.querySelectorAll('.product-wishlist').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = parseInt(button.dataset.id);
                toggleWishlist(productId);
            });
        });

        // Quick view buttons
        container.querySelectorAll('.quick-view').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = parseInt(button.dataset.id);
                showQuickView(productId);
            });
        });

        // Product card clicks
        container.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('button')) {
                    const productId = parseInt(card.dataset.id);
                    this.showProductModal(productId);
                }
            });
        });
    }

    updateLoadMoreButton() {
        const loadMoreSection = document.getElementById('load-more-section');
        if (!loadMoreSection) return;

        const totalProducts = this.filteredProducts.length;
        const shownProducts = this.currentPage * this.productsPerPage;

        if (shownProducts < totalProducts) {
            loadMoreSection.style.display = 'block';
            const remaining = totalProducts - shownProducts;
            const loadMoreBtn = document.getElementById('load-more-btn');
            if (loadMoreBtn) {
                loadMoreBtn.innerHTML = `
                    <i class="fas fa-plus"></i>
                    Load More Products (${remaining} remaining)
                `;
            }
        } else {
            loadMoreSection.style.display = 'none';
        }
    }

    updateNoResultsMessage() {
        const noResults = document.getElementById('no-results');
        const grid = document.getElementById('products-grid');
        
        if (this.filteredProducts.length === 0) {
            if (noResults) noResults.style.display = 'block';
            if (grid) grid.style.display = 'none';
        } else {
            if (noResults) noResults.style.display = 'none';
            if (grid) grid.style.display = 'grid';
        }
    }

    updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('active-filters');
        const activeFiltersList = document.getElementById('active-filters-list');
        
        if (!activeFiltersContainer || !activeFiltersList) return;

        const activeFilters = [];

        // Category filter
        if (this.currentFilters.category !== 'all') {
            activeFilters.push({
                type: 'category',
                label: categoryNames[this.currentFilters.category],
                value: this.currentFilters.category
            });
        }

        // Price range filter
        if (this.currentFilters.priceMin > 799 || this.currentFilters.priceMax < 2499) {
            activeFilters.push({
                type: 'price',
                label: `₹${this.currentFilters.priceMin} - ₹${this.currentFilters.priceMax}`,
                value: 'price'
            });
        }

        // Rating filter
        if (this.currentFilters.rating !== 'all') {
            activeFilters.push({
                type: 'rating',
                label: `${this.currentFilters.rating}+ Stars`,
                value: this.currentFilters.rating
            });
        }

        // Featured filter
        if (this.currentFilters.featured) {
            activeFilters.push({
                type: 'featured',
                label: 'Featured Products',
                value: 'featured'
            });
        }

        // Search filter
        if (this.currentFilters.search) {
            activeFilters.push({
                type: 'search',
                label: `Search: "${this.currentFilters.search}"`,
                value: 'search'
            });
        }

        if (activeFilters.length > 0) {
            activeFiltersList.innerHTML = activeFilters.map(filter => `
                <div class="active-filter">
                    <span>${filter.label}</span>
                    <button class="remove-filter" data-type="${filter.type}" data-value="${filter.value}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `).join('');

            activeFiltersContainer.style.display = 'block';

            // Bind remove filter events
            activeFiltersList.querySelectorAll('.remove-filter').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const type = e.target.closest('.remove-filter').dataset.type;
                    this.removeFilter(type);
                });
            });
        } else {
            activeFiltersContainer.style.display = 'none';
        }
    }

    removeFilter(type) {
        switch (type) {
            case 'category':
                this.currentFilters.category = 'all';
                document.querySelector('input[name="category"][value="all"]').checked = true;
                break;
            case 'price':
                this.currentFilters.priceMin = 799;
                this.currentFilters.priceMax = 2499;
                document.getElementById('price-min').value = 799;
                document.getElementById('price-max').value = 2499;
                document.getElementById('price-range-min').value = 799;
                document.getElementById('price-range-max').value = 2499;
                break;
            case 'rating':
                this.currentFilters.rating = 'all';
                document.querySelector('input[name="rating"][value="all"]').checked = true;
                break;
            case 'featured':
                this.currentFilters.featured = false;
                document.getElementById('featured').checked = false;
                break;
            case 'search':
                this.currentFilters.search = '';
                document.getElementById('search-input').value = '';
                break;
        }

        this.applyFilters();
        this.updateURL();
    }

    switchView(view) {
        this.currentView = view;
        
        // Update button states
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === view) {
                btn.classList.add('active');
            }
        });

        // Update grid class
        const grid = document.getElementById('products-grid');
        if (grid) {
            grid.className = `products-grid ${view}-view`;
        }

        // Store preference
        localStorage.setItem('preferred-view', view);
    }

    toggleMobileFilters() {
        const sidebar = document.querySelector('.filters-sidebar');
        const overlay = document.querySelector('.filters-overlay') || this.createFiltersOverlay();
        
        if (sidebar) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            
            if (sidebar.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }

    closeMobileFilters() {
        const sidebar = document.querySelector('.filters-sidebar');
        const overlay = document.querySelector('.filters-overlay');
        
        if (sidebar) {
            sidebar.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    createFiltersOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'filters-overlay';
        document.body.appendChild(overlay);
        
        overlay.addEventListener('click', () => {
            this.closeMobileFilters();
        });
        
        return overlay;
    }

    clearAllFilters() {
        // Reset all filter values
        this.currentFilters = {
            category: 'all',
            priceMin: 799,
            priceMax: 2499,
            rating: 'all',
            inStock: true,
            featured: false,
            search: ''
        };

        // Reset form elements
        document.querySelector('input[name="category"][value="all"]').checked = true;
        document.querySelector('input[name="rating"][value="all"]').checked = true;
        document.getElementById('price-min').value = 799;
        document.getElementById('price-max').value = 2499;
        document.getElementById('price-range-min').value = 799;
        document.getElementById('price-range-max').value = 2499;
        document.getElementById('in-stock').checked = true;
        document.getElementById('featured').checked = false;
        document.getElementById('search-input').value = '';

        // Reset sort
        this.currentSort = 'default';
        document.getElementById('sort-select').value = 'default';

        // Apply changes
        this.applyFilters();
        this.updateURL();
        
        showNotification('All filters cleared', 'info');
    }

    loadMore() {
        this.currentPage++;
        this.updateProductsGrid();
        this.updateLoadMoreButton();

        // Scroll to first new product
        const grid = document.getElementById('products-grid');
        if (grid) {
            const newProducts = grid.querySelectorAll('.product-card');
            const firstNewProduct = newProducts[(this.currentPage - 1) * this.productsPerPage];
            if (firstNewProduct) {
                firstNewProduct.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }

    showProductModal(productId) {
        const product = getProductById(productId);
        if (product) {
            showQuickView(productId);
        }
    }

    updateURL() {
        const params = new URLSearchParams();
        
        if (this.currentFilters.category !== 'all') {
            params.set('category', this.currentFilters.category);
        }
        
        if (this.currentFilters.search) {
            params.set('search', this.currentFilters.search);
        }

        const newURL = params.toString() ? 
            `${window.location.pathname}?${params.toString()}` : 
            window.location.pathname;
            
        window.history.replaceState({}, '', newURL);
    }

    // Get current state for analytics
    getAnalyticsData() {
        return {
            totalProducts: this.currentProducts.length,
            filteredProducts: this.filteredProducts.length,
            currentFilters: this.currentFilters,
            currentSort: this.currentSort,
            currentView: this.currentView,
            currentPage: this.currentPage
        };
    }
}

// Global functions for filter clearing
function clearAllFilters() {
    if (window.productsPage) {
        window.productsPage.clearAllFilters();
    }
}

// Initialize products page
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('products-grid')) {
        window.productsPage = new ProductsPage();
        
        // Load saved view preference
        const savedView = localStorage.getItem('preferred-view');
        if (savedView) {
            window.productsPage.switchView(savedView);
        }

        // Track page view
        if (typeof trackEvent === 'function') {
            trackEvent('products_page_view', window.productsPage.getAnalyticsData());
        }
    }
});

// Handle browser back/forward
window.addEventListener('popstate', function() {
    if (window.productsPage) {
        window.productsPage.parseURLParams();
        window.productsPage.applyFilters();
    }
});

// Keyboard shortcuts for power users
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'f':
                e.preventDefault();
                document.getElementById('search-input').focus();
                break;
            case 'g':
                e.preventDefault();
                if (window.productsPage) {
                    window.productsPage.switchView('grid');
                }
                break;
            case 'l':
                e.preventDefault();
                if (window.productsPage) {
                    window.productsPage.switchView('list');
                }
                break;
        }
    }
    
    if (e.key === 'Escape') {
        if (window.productsPage) {
            window.productsPage.closeMobileFilters();
        }
    }
});
