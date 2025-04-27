document.addEventListener('DOMContentLoaded', () => {
    // --- Sample Product Data (Updated) ---
    const sampleProducts = [
        { id: 1, name: "Modern Sunglasses", price: 55.00, category: "Accessories", subcategory: "Glasses", location: "UCC", condition: "New", vendorRating: 4.5, imageUrl: "https://picsum.photos/seed/p1/300/300", description: "Stylish shades for sunny days.", popularityScore: 85, liked: false },
        { id: 2, name: "Wireless Noise-Cancelling Headphones", price: 199.99, category: "Electronics", subcategory: "Audio", location: "KNUST", condition: "New", vendorRating: 4.8, imageUrl: "https://picsum.photos/seed/p2/300/300", description: "Immersive sound experience.", popularityScore: 95, liked: true }, // Example liked
        { id: 3, name: "Minimalist Cotton T-Shirt", price: 25.50, category: "Clothing", subcategory: "Tops", location: "UCC", condition: "Good", vendorRating: 4.0, imageUrl: "https://picsum.photos/seed/p3/300/300", description: "Comfortable and versatile tee.", popularityScore: 70, liked: false },
        { id: 4, name: "Smart LED Desk Lamp", price: 75.00, category: "Home Goods", subcategory: "Lighting", location: "UCC", condition: "Fairly Used", vendorRating: 4.2, imageUrl: "https://picsum.photos/seed/p4/300/300", description: "Adjustable brightness and color temperature.", popularityScore: 88, liked: false },
        { id: 5, name: "Classic Aviator Glasses", price: 65.00, category: "Accessories", subcategory: "Glasses", location: "KNUST", condition: "Used", vendorRating: 3.8, imageUrl: "https://picsum.photos/seed/p5/300/300", description: "Timeless aviator design.", popularityScore: 92, liked: false },
        { id: 6, name: "Portable Bluetooth Speaker", price: 49.95, category: "Electronics", subcategory: "Audio", location: "UCC", condition: "New", vendorRating: 4.1, imageUrl: "https://picsum.photos/seed/p6/300/300", description: "Compact speaker with great sound.", popularityScore: 80, liked: true }, // Example liked
        { id: 7, name: "Organic Linen Shirt - Long title example that needs to be truncated after two lines to show how ellipsis works", price: 85.00, category: "Clothing", subcategory: "Tops", location: "KNUST", condition: "New", vendorRating: 4.6, imageUrl: "https://picsum.photos/seed/p7/300/300", description: "Breathable linen for warm weather.", popularityScore: 78, liked: false },
        { id: 8, name: "Ceramic Coffee Mug Set", price: 32.00, category: "Home Goods", subcategory: "Kitchenware", location: "UCC", condition: "Good", vendorRating: 3.5, imageUrl: "https://picsum.photos/seed/p8/300/300", description: "Set of 4 stylish mugs.", popularityScore: 65, liked: false },
        { id: 9, name: "Gaming Mouse RGB", price: 59.99, category: "Electronics", subcategory: "Peripherals", location: "KNUST", condition: "Fairly Used", vendorRating: 4.9, imageUrl: "https://picsum.photos/seed/p9/300/300", description: "High-precision gaming mouse.", popularityScore: 90, liked: false },
        { id: 10, name: "Designer Reading Glasses", price: 120.00, category: "Accessories", subcategory: "Glasses", location: "UCC", condition: "New", vendorRating: 4.3, imageUrl: "https://picsum.photos/seed/p10/300/300", description: "Elegant frames for reading.", popularityScore: 75, liked: false },
        { id: 11, name: "Smartphone Tripod Stand", price: 19.99, category: "Electronics", subcategory: "Accessories", location: "UCC", condition: "Used", vendorRating: 3.9, imageUrl: "https://picsum.photos/seed/p11/300/300", description: "Stable tripod for mobile photography.", popularityScore: 72, liked: false },
        { id: 12, name: "Running Shoes - Lightweight", price: 95.50, category: "Clothing", subcategory: "Footwear", location: "KNUST", condition: "New", vendorRating: 4.7, imageUrl: "https://picsum.photos/seed/p12/300/300", description: "Comfortable shoes for running.", popularityScore: 89, liked: false },
    ];
    let allProducts = []; // Will hold the data after potential fetch

    // --- DOM Element References ---
    const productGrid = document.getElementById('product-grid');
    const skeletonLoader = document.getElementById('skeleton-loader'); // Added
    const searchInput = document.getElementById('search-input');
    const filterBtn = document.getElementById('filter-btn');
    const filterModal = document.getElementById('filter-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    const categoryFiltersContainer = document.getElementById('category-filters');
    const locationFiltersContainer = document.getElementById('location-filters'); // Added
    const conditionFiltersContainer = document.getElementById('condition-filters'); // Added
    const ratingFiltersContainer = document.getElementById('rating-filters'); // Added
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const sortControl = document.getElementById('sort-control');
    const sortOptionsContainer = document.getElementById('sort-options');
    const sortButtons = sortOptionsContainer.querySelectorAll('button');
    const noResultsMessage = document.getElementById('no-results-message');
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    const headerSearchSticky = document.querySelector('.header-search-sticky');
    const mainContent = document.getElementById('main-content');
    const header = document.querySelector('.header');

    // --- State Variables ---
    let currentFilters = {
        searchTerm: '',
        categories: [], // Now can hold categories or subcategories
        locations: [], // Added
        condition: null, // Added (single value expected)
        minVendorRating: null, // Added
        minPrice: null,
        maxPrice: null,
    };
    let currentSort = 'relevance';
    let searchDebounceTimer;

    // --- Core Functions ---

    // Function to render skeleton loaders
    function renderSkeletonLoader(count) {
        skeletonLoader.innerHTML = ''; // Clear previous skeletons
        productGrid.style.display = 'none'; // Hide actual grid
        skeletonLoader.style.display = 'grid'; // Show skeleton grid

        for (let i = 0; i < count; i++) {
            const skeletonItem = document.createElement('div');
            skeletonItem.className = 'product-item-skeleton';
            skeletonItem.innerHTML = `
                <div class="skeleton skeleton-image"></div>
                <div class="skeleton-info">
                    <div class="skeleton skeleton-text skeleton-text-long"></div>
                    <div class="skeleton skeleton-text skeleton-text-short"></div>
                    <div class="skeleton skeleton-price"></div>
                    <div class="skeleton skeleton-button"></div>
                </div>
            `;
            skeletonLoader.appendChild(skeletonItem);
        }
    }

    // Function to render products in the grid (Updated with icons, rating)
    function renderProducts(productsToRender) {
        productGrid.innerHTML = ''; // Clear existing grid
        skeletonLoader.style.display = 'none'; // Hide skeleton

        if (productsToRender.length === 0) {
            noResultsMessage.style.display = 'block';
            productGrid.style.display = 'none';
        } else {
            noResultsMessage.style.display = 'none';
            productGrid.style.display = 'grid';

            productsToRender.forEach(product => {
                const productItem = document.createElement('div');
                productItem.className = 'product-item';
                productItem.dataset.productId = product.id; // Add ID for reference

                // Determine initial state of love icon
                const isLiked = product.liked || false;
                const activeClass = isLiked ? 'active' : '';
                const heartIconClass = isLiked ? 'fa-solid' : 'fa-regular';

                productItem.innerHTML = `
                    <div class="product-image-wrapper">
                        <div class="product-image-container">
                            <img src="${product.imageUrl}" alt="${product.name}" class="product-image" loading="lazy">
                            <button class="love-icon ${activeClass}" aria-label="Add to favorites" data-id="${product.id}">
                                <i class="fa-regular fa-heart"></i> <i class="fa-solid fa-heart"></i>
                            </button>
                            ${product.vendorRating ? `
                            <div class="rating-display">
                                <i class="fa-solid fa-star"></i>
                                <span>${product.vendorRating.toFixed(1)}</span>
                            </div>` : ''}
                        </div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.name}</h3>
                        <p class="product-price">$${product.price.toFixed(2)}</p>
                        <a href="#" class="product-details-btn">(View details)</a>
                    </div>
                `;
                productGrid.appendChild(productItem);
            });

            // Add event listeners to newly rendered love icons
            addLoveIconListeners();
        }
    }

    // Function to add listeners to love icons
    function addLoveIconListeners() {
        document.querySelectorAll('.love-icon').forEach(button => {
            // Remove existing listener before adding a new one to prevent duplicates
             button.removeEventListener('click', handleLoveIconClick);
             button.addEventListener('click', handleLoveIconClick);
        });
    }

    // Handler for love icon clicks
    function handleLoveIconClick(event) {
        const button = event.currentTarget;
        const productId = parseInt(button.dataset.id, 10);
        button.classList.toggle('active');
        const isActive = button.classList.contains('active');

        // Find the product in the *currently displayed data* (or original source if needed)
        // and update its liked state (this is visual only for now)
        const product = allProducts.find(p => p.id === productId);
        if (product) {
             product.liked = isActive;
        }

        console.log(`Product ${productId} liked state: ${isActive}`);
        // Here you would typically trigger an update to a cart/wishlist state
        // e.g., updateCart(productId, isActive);
    }


    // Function to populate category filters (Example: Simple list, Needs enhancement for Subcategories)
    function populateCategories() {
        // Group products by category and then subcategory
        const categories = allProducts.reduce((acc, product) => {
            const cat = product.category || 'Uncategorized';
            const subCat = product.subcategory || 'General';
            if (!acc[cat]) {
                acc[cat] = new Set();
            }
            acc[cat].add(subCat);
            return acc;
        }, {});

        categoryFiltersContainer.innerHTML = ''; // Clear existing
        Object.keys(categories).sort().forEach(category => {
            const categoryGroup = document.createElement('div');
            categoryGroup.className = 'category-group';

            // Category Title (Optional - maybe make it a checkbox too?)
             const categoryTitle = document.createElement('span');
             categoryTitle.className = 'category-title';
             categoryTitle.textContent = category;
             categoryGroup.appendChild(categoryTitle);

            const subcategoryOptions = document.createElement('div');
            subcategoryOptions.className = 'subcategory-options';

            // Subcategory Checkboxes
            const subcategories = Array.from(categories[category]).sort();
            subcategories.forEach(subcategory => {
                const div = document.createElement('div');
                const checkboxId = `cat-${category.toLowerCase().replace(/\s+/g, '-')}-${subcategory.toLowerCase().replace(/\s+/g, '-')}`;
                // Use subcategory as the value for filtering
                div.innerHTML = `
                    <input type="checkbox" id="${checkboxId}" name="category" value="${subcategory}" data-category="${category}">
                    <label for="${checkboxId}">${subcategory}</label>
                `;
                subcategoryOptions.appendChild(div);
             });

             categoryGroup.appendChild(subcategoryOptions);
             categoryFiltersContainer.appendChild(categoryGroup);
        });
    }

     // Function to populate other simple filters (like location) - Reuse for Condition, Rating if needed
    function populateSimpleFilter(container, products, property) {
        const uniqueValues = [...new Set(products.map(p => p[property]).filter(Boolean))]; // Get unique non-empty values
        container.innerHTML = ''; // Clear existing
        uniqueValues.sort().forEach(value => {
            const div = document.createElement('div');
            const checkboxId = `${property}-${value.toLowerCase().replace(/\s+/g, '-')}`;
            div.innerHTML = `
                <input type="checkbox" id="${checkboxId}" name="${property}" value="${value}">
                <label for="${checkboxId}">${value}</label>
            `;
             container.appendChild(div);
        });
         // Optionally add an 'Any' or default option if using checkboxes for single choice (like condition/rating radios)
    }


    // Function to filter and sort products based on current state (Updated)
    function filterAndSortProducts() {
        let filteredProducts = [...allProducts]; // Start with all products

        // 1. Apply Search Filter
        if (currentFilters.searchTerm) {
            const searchTermLower = currentFilters.searchTerm.toLowerCase();
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(searchTermLower) ||
                (product.description && product.description.toLowerCase().includes(searchTermLower))
            );
        }

        // 2. Apply Subcategory Filter (Using checkbox values which are subcategories)
        if (currentFilters.categories.length > 0) {
             filteredProducts = filteredProducts.filter(product =>
                 currentFilters.categories.includes(product.subcategory) // Filter by subcategory
             );
        }

        // 3. Apply Location Filter
        if (currentFilters.locations.length > 0) {
            filteredProducts = filteredProducts.filter(product =>
                currentFilters.locations.includes(product.location)
            );
        }

        // 4. Apply Condition Filter
        if (currentFilters.condition) {
            filteredProducts = filteredProducts.filter(product =>
                product.condition === currentFilters.condition
            );
        }

        // 5. Apply Vendor Rating Filter
        if (currentFilters.minVendorRating !== null) {
            filteredProducts = filteredProducts.filter(product =>
                 (product.vendorRating || 0) >= currentFilters.minVendorRating
            );
        }


        // 6. Apply Price Filter
        const minPrice = currentFilters.minPrice !== null ? parseFloat(currentFilters.minPrice) : null;
        const maxPrice = currentFilters.maxPrice !== null ? parseFloat(currentFilters.maxPrice) : null;

        if (minPrice !== null) {
             filteredProducts = filteredProducts.filter(product => product.price >= minPrice);
        }
         if (maxPrice !== null) {
             filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
         }

        // 7. Apply Sorting
        switch (currentSort) {
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'popularity':
                 filteredProducts.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
                break;
            case 'relevance': // Default order (or by ID if needed)
                 filteredProducts.sort((a, b) => a.id - b.id); // Simple sort by ID
                 break;
        }

        // 8. Render the final list
        renderProducts(filteredProducts);
    }

    // --- Event Listeners ---

    // Search Input (with Debounce)
    searchInput.addEventListener('input', () => {
        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
            currentFilters.searchTerm = searchInput.value.trim();
            filterAndSortProducts();
        }, 350); // Slightly longer debounce
    });

    // Filter Modal Toggle
    filterBtn.addEventListener('click', () => {
        filterModal.classList.add('active');
        // Optional: Trap focus within the modal
    });

    closeModalBtn.addEventListener('click', () => {
        filterModal.classList.remove('active');
    });

    filterModal.addEventListener('click', (event) => {
        if (event.target === filterModal) {
            filterModal.classList.remove('active');
        }
    });


    // Apply Filters (Updated)
    applyFiltersBtn.addEventListener('click', () => {
        // Update categories (subcategories)
        const selectedCategoryCheckboxes = categoryFiltersContainer.querySelectorAll('input[name="category"]:checked');
        currentFilters.categories = Array.from(selectedCategoryCheckboxes).map(cb => cb.value);

        // Update locations
        const selectedLocationCheckboxes = locationFiltersContainer.querySelectorAll('input[name="location"]:checked');
        currentFilters.locations = Array.from(selectedLocationCheckboxes).map(cb => cb.value);

        // Update condition (radio button)
        const selectedConditionRadio = conditionFiltersContainer.querySelector('input[name="condition"]:checked');
        currentFilters.condition = selectedConditionRadio ? selectedConditionRadio.value : null;
        if (currentFilters.condition === "") currentFilters.condition = null; // Treat empty value as null


         // Update vendor rating (radio button)
        const selectedRatingRadio = ratingFiltersContainer.querySelector('input[name="vendor_rating"]:checked');
        const ratingValue = selectedRatingRadio ? selectedRatingRadio.value : null;
        currentFilters.minVendorRating = ratingValue === "" ? null : parseFloat(ratingValue);


        // Update price range
        const minPriceValue = minPriceInput.value.trim();
        const maxPriceValue = maxPriceInput.value.trim();
        currentFilters.minPrice = minPriceValue === '' ? null : parseFloat(minPriceValue);
        currentFilters.maxPrice = maxPriceValue === '' ? null : parseFloat(maxPriceValue);

        // Validate/Swap price range
         if (currentFilters.minPrice !== null && currentFilters.maxPrice !== null && currentFilters.minPrice > currentFilters.maxPrice) {
             [currentFilters.minPrice, currentFilters.maxPrice] = [currentFilters.maxPrice, currentFilters.minPrice];
             minPriceInput.value = currentFilters.minPrice;
             maxPriceInput.value = currentFilters.maxPrice;
         }

        filterAndSortProducts();
        filterModal.classList.remove('active');
    });

    // Reset Filters (Updated)
    resetFiltersBtn.addEventListener('click', () => {
        // Clear state
        currentFilters = {
            searchTerm: searchInput.value.trim(), // Keep search term? Or reset? currentFilters.searchTerm = '';
            categories: [],
            locations: [],
            condition: null,
            minVendorRating: null,
            minPrice: null,
            maxPrice: null,
        };
        // currentSort = 'relevance'; // Optionally reset sort

        // Clear form elements
        categoryFiltersContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => cb.checked = false);
        locationFiltersContainer.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => cb.checked = false);
        // Check the 'Any' or default radio for condition/rating
        const defaultCondition = conditionFiltersContainer.querySelector('input[name="condition"][value=""]');
        if(defaultCondition) defaultCondition.checked = true;
        const defaultRating = ratingFiltersContainer.querySelector('input[name="vendor_rating"][value=""]');
        if(defaultRating) defaultRating.checked = true;

        minPriceInput.value = '';
        maxPriceInput.value = '';

        // Update sort button text if resetting sort
        // const sortControlText = sortControl.querySelector('span');
        // sortControlText.textContent = `Sort by: Relevance`;

        filterAndSortProducts();
        filterModal.classList.remove('active');
    });

    // Sort Control Toggle Dropdown
     sortControl.addEventListener('click', (event) => {
        if (!event.target.closest('.sort-options')) {
             sortControl.classList.toggle('open');
         }
     });

     // Sort Option Selection
     sortButtons.forEach(button => {
         button.addEventListener('click', () => {
             currentSort = button.getAttribute('data-sort');
             const sortControlText = sortControl.querySelector('span');
             sortControlText.textContent = `Sort by: ${button.textContent}`; // Update display text
             sortControl.classList.remove('open');
             filterAndSortProducts();
         });
     });

     // Close sort dropdown if clicking outside
      document.addEventListener('click', (event) => {
          if (!sortControl.contains(event.target) && sortControl.classList.contains('open')) {
              sortControl.classList.remove('open');
          }
      });

    // Scroll-to-Top Button Visibility & Action
    const scrollThreshold = 300;
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
        handleStickyHeader(); // Check sticky header on scroll
    }, { passive: true }); // Use passive listener for scroll performance

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Sticky Header Logic ---
    let stickyOffsetTop = 0;
    let headerSearchHeight = 0;

     function calculateStickyValues() {
         stickyOffsetTop = headerSearchSticky.offsetTop;
         headerSearchHeight = headerSearchSticky.offsetHeight;
         // Set initial main content padding based on calculated height
         // This prevents content jump IF the header is already meant to be sticky on load (offset=0)
         // Update: We only add padding when it becomes sticky.
     }

    function handleStickyHeader() {
         const isSticky = headerSearchSticky.classList.contains('sticky');
         if (window.scrollY > stickyOffsetTop) {
             if (!isSticky) {
                 headerSearchSticky.classList.add('sticky');
                 // Dynamically set padding top based on the actual height when it becomes sticky
                 mainContent.style.paddingTop = `${headerSearchSticky.offsetHeight}px`;
             }
         } else {
             if (isSticky) {
                 headerSearchSticky.classList.remove('sticky');
                 mainContent.style.paddingTop = ''; // Remove the dynamically added padding
             }
         }
     }

     // Recalculate on resize
     window.addEventListener('resize', () => {
         calculateStickyValues();
         handleStickyHeader(); // Re-check state
     });


    // --- Initial Setup ---
    function initializeApp() {
        renderSkeletonLoader(12); // Show 12 skeletons initially

        // Simulate data fetching
        setTimeout(() => {
            allProducts = [...sampleProducts]; // Use sample data directly
            calculateStickyValues();
            populateCategories();
            populateSimpleFilter(locationFiltersContainer, allProducts, 'location');
            // Populate Condition/Rating Filters (radios are static HTML here, but could be dynamic)
            filterAndSortProducts(); // Initial render
            handleStickyHeader(); // Check sticky state after load
        }, 1000); // Simulate 1 second load time
    }

    initializeApp(); // Start the application

}); // End DOMContentLoaded