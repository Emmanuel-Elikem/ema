document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded. Starting script execution...");

    // --- DOM ELEMENTS ---
    // Select elements early, check for existence
    const productsGrid = document.getElementById('productsGrid');
    const filterToggle = document.getElementById('filterToggle');
    const filterPanel = document.getElementById('filterPanel');
    const closeFilter = document.getElementById('closeFilter');
    const overlay = document.getElementById('overlay');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const sortToggle = document.getElementById('sortToggle');
    const sortDropdown = document.getElementById('sortDropdown');
    const searchInput = document.getElementById('searchInput');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const toast = document.getElementById('toast');
    const currentSortLabel = document.getElementById('currentSortLabel');
    const topHeader = document.getElementById('topHeader');
    const searchHeader = document.getElementById('searchHeader');
    const scrollableContainer = document.getElementById('scrollableContainer');
    const mainContainer = document.querySelector('.main-container');

    // Basic check for core elements needed for layout/display
    if (!productsGrid || !scrollableContainer || !mainContainer || !topHeader || !searchHeader) {
        console.error("Essential layout or product grid element not found! Aborting major script functions.");
        if (productsGrid) productsGrid.innerHTML = "<p style='color:red;'>Error: Page structure incomplete. Cannot load products.</p>";
        return; // Stop if critical elements are missing
    }
    console.log("Essential DOM elements found.");

    // --- STATE ---
    let allProducts = []; // Will be filled by API data
    let currentProducts = []; // Holds the currently displayed/filtered/sorted products
    let currentSort = 'newest';
    let isFilterResetPending = false;
    let lastScrollY = 0;

    // --- API URL ---
    const API_BASE_URL = 'https://ema-campusshop-backend.onrender.com/api'; // Your Django API base URL

    // --- ===== FUNCTION DEFINITIONS ===== ---
    // (Define ALL functions needed by the script here, BEFORE they are called)

    function showSkeletons(count = 10) {
        console.log("Showing skeletons...");
        productsGrid.innerHTML = ''; // Clear grid
        for (let i = 0; i < count; i++) {
            productsGrid.innerHTML += `
                <div class="product-card-skeleton border border-gray-100 rounded-xl overflow-hidden bg-white h-full">
                    <div class="skeleton h-40 sm:h-48 w-full"></div>
                    <div class="p-3 space-y-2">
                        <div class="skeleton h-4 rounded w-3/4"></div>
                        <div class="skeleton h-4 rounded w-1/2"></div>
                        <div class="skeleton h-3 rounded w-1/4 mt-1"></div>
                    </div>
                </div>
            `;
        }
    }

// browse.js

// ... (other functions like showSkeletons, handleFavoriteClick, etc. remain as they are) ...

function renderProducts(productsToRender) {
    console.log(`Attempting to render ${productsToRender?.length || 0} products...`);
    productsGrid.innerHTML = ''; // Clear grid/skeletons

    if (!productsToRender || productsToRender.length === 0) {
        console.log("No products to render.");
        productsGrid.innerHTML = `
            <div class="col-span-full text-center py-16 px-4">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-16 w-16 mx-auto text-gray-300">
                   <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM13.5 10.5h-3" />
                 </svg>
                <h3 class="mt-4 text-lg font-semibold text-text-dark">No Products Found</h3>
                <p class="mt-1 text-sm text-text-light">Try adjusting your search or filters, or check back later.</p>
            </div>
        `;
        return;
    }

    productsToRender.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card bg-white rounded-xl overflow-hidden shadow-subtle hover:shadow-lifted transition-shadow duration-300 ease-modern flex flex-col animate-fadeIn';
        productCard.style.animationDelay = `${index * 60}ms`;

        const isFavorite = false; // Default to not favorite until backend logic exists
        const heartIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>`;
        const ratingHTML = ''; // No rating from API yet - Hide this section

        const priceValue = parseFloat(product.price || 0);

        productCard.innerHTML = `
            <div class="relative group">
                <img src="${product.image || 'images/placeholder.png'}" alt="${product.name || 'Product Image'}" class="aspect-square w-full object-cover bg-gray-100">
                <button class="favorite-button absolute top-3 right-3 h-9 w-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 hover:scale-110 transition-all duration-200 ${isFavorite ? 'favorited' : ''}" data-product-id="${product.id}">
                    ${heartIconSVG}
                </button>
            </div>
            <div class="p-3 sm:p-4 flex flex-col flex-grow">
                 <h3 class="product-name text-sm font-semibold text-text-dark leading-snug mb-1.5 h-[2.6em] line-clamp-2" title="${product.name || ''}">
                    ${product.name || 'Product Name Unavailable'}
                </h3>
                <div class="flex justify-between items-center mt-auto pt-2">
                    <div class="product-price text-base font-bold text-text-dark">GH₵ ${priceValue.toFixed(2)}</div>
                    ${ratingHTML}
                 </div>
                 <a href="product-detail.html?id=${product.id}" class="view-product-button mt-3 w-full text-center py-2 px-3 border border-gray-200 rounded-lg text-xs font-semibold text-text-dark hover:bg-gray-100 hover:border-gray-300 transition-colors duration-200">
                     View Details </a>
            </div>
        `;
        productsGrid.appendChild(productCard);

        const favButton = productCard.querySelector('.favorite-button');
        if (favButton) favButton.addEventListener('click', handleFavoriteClick);
    }); // End of forEach loop

    console.log("Finished rendering products.");
} // End of renderProducts function

    function handleFavoriteClick(event) {
        // Your existing favorite logic
         const button = event.currentTarget;
         const productId = button.dataset.productId;
         const isFavorited = button.classList.toggle('favorited');
         if (isFavorited) {
             button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5 text-red-500"><path d="M11.645 20.91a.75.75 0 0 1-1.29 0C8.635 18.87 2.25 13.165 2.25 8.25a5.585 5.585 0 0 1 10.062-3.72.75.75 0 0 1 1.29 0c.001.002.002.004.003.006a5.585 5.585 0 0 1 10.062 3.72c0 4.915-6.385 10.62-8.103 12.66Z" /></svg>`;
             showToast(`Product ${productId} added to favorites!`);
         } else {
             button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>`;
             showToast(`Product ${productId} removed from favorites.`);
         }
         event.stopPropagation();
    }

    function sortProducts(productsArray, sortType) {
        console.log(`Client-side sorting by: ${sortType}`);
        const sorted = [...productsArray]; // Create a copy to sort
        try {
            switch (sortType) {
                case 'popular':
                case 'rating':
                     console.warn(`Client-side sorting by '${sortType}' is inaccurate without backend data.`);
                     // Fallback or no-op
                     break;
                case 'price-asc':
                    sorted.sort((a, b) => parseFloat(a.price || 0) - parseFloat(b.price || 0));
                    break;
                case 'price-desc':
                    sorted.sort((a, b) => parseFloat(b.price || 0) - parseFloat(a.price || 0));
                    break;
                case 'newest':
                default:
                    // Use 'created_at' from API
                    sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                    break;
            }
        } catch (error) {
             console.error("Error during sorting:", error);
             return productsArray; // Return original array on error
        }
        return sorted;
    }

    function applyFiltersAndSearch(searchQuery = '') {
        console.log(`Client-side filtering/searching for: "${searchQuery}"`);
        showSkeletons(currentProducts.length > 0 ? currentProducts.length : 8);

        setTimeout(() => {
            let filtered = [...allProducts]; // Start with the full list fetched from API

            // Apply filters from the panel if it exists
            if (filterPanel) {
                const form = filterPanel;
                const selectedCategories = Array.from(form.querySelectorAll('input[name="category"]:checked')).map(cb => String(cb.value)); // Assuming value is category ID

                const minPriceInput = document.getElementById('minPrice');
                const maxPriceInput = document.getElementById('maxPrice');
                const minPrice = parseFloat(minPriceInput?.value) || 0;
                const maxPrice = parseFloat(maxPriceInput?.value) || Infinity;

                // --- Filtering Logic (Client-side) ---
                filtered = filtered.filter(product => {
                    // Category filter (assumes filter form uses category ID as value)
                    if (selectedCategories.length > 0 && !selectedCategories.includes(String(product.category))) {
                        return false;
                    }
                    // Price filter
                    const productPrice = parseFloat(product.price || 0);
                    if (productPrice < minPrice || productPrice > maxPrice) {
                        return false;
                    }
                    // Add other client-side filters here if needed (e.g., condition, campus - if data available)

                    return true; // Keep product if no filters exclude it
                });
            } else {
                 console.warn("Filter panel not found, skipping panel-based filtering.");
            }

            // Apply search query
            const query = searchQuery.toLowerCase().trim();
            if (query) {
                filtered = filtered.filter(product => {
                    const productName = (product.name || '').toLowerCase();
                    const productDesc = (product.description || '').toLowerCase();
                    return productName.includes(query) || productDesc.includes(query);
                });
            }

            // Sort the results and render
            currentProducts = sortProducts(filtered, currentSort);
            renderProducts(currentProducts);

            // Show feedback toast
            const filterCount = (filterPanel ? Array.from(filterPanel.querySelectorAll('input:checked')).length : 0); // Simple count of checked filters
            if (filterCount > 0 || query) {
                 showToast(`${currentProducts.length} product${currentProducts.length !== 1 ? 's' : ''} found`);
            }
        }, 50); // Small delay for visual update
    }

    function showToast(message) {
         if (!toast) return;
         toast.textContent = message;
         toast.classList.remove('translate-y-20', 'opacity-0');
         toast.classList.add('translate-y-0', 'opacity-100');
         if (toast.timer) clearTimeout(toast.timer);
         toast.timer = setTimeout(() => {
             toast.classList.remove('translate-y-0', 'opacity-100');
             toast.classList.add('translate-y-20', 'opacity-0');
             toast.timer = null;
         }, 2500);
    }

    function toggleFilterPanel(show = true) {
         if (!filterPanel || !overlay) return;
         if (show) {
            filterPanel.classList.add('show');
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        } else {
            filterPanel.classList.remove('show');
            overlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    function resetFilterForm() {
         if (!filterPanel) return;
         const form = filterPanel;
         // ... (Keep your existing form reset logic) ...
         form.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
         form.querySelectorAll('input[type="radio"]').forEach(rb => rb.checked = false);
         const defaultRating = form.querySelector('input[name="rating"][value="0"]');
         if (defaultRating) defaultRating.checked = true;
         form.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
         form.querySelectorAll('details.category-details').forEach(detail => detail.removeAttribute('open'));
         isFilterResetPending = true;
         console.log("Filter form visually reset.");
         if (resetFilterBtn) {
              resetFilterBtn.classList.add('bg-gray-300');
              setTimeout(()=> resetFilterBtn.classList.remove('bg-gray-300'), 200);
         }
    }

    function calculateHeaderHeights() {
        const topH = topHeader.offsetHeight; // Use offsetHeight for actual rendered height
        const searchH = searchHeader.offsetHeight;
        // console.log("Calculated Heights - Top:", topH, "Search:", searchH);
        return topH + searchH;
    }

    function positionElements() {
        console.log("Running positionElements...");
        try {
            const topH = topHeader.offsetHeight;
            const totalHeaderHeight = calculateHeaderHeights();

            searchHeader.style.top = `${topH}px`;

            const mainContainerMarginTop = totalHeaderHeight - 20; // Your -mt-5 offset? Adjust if needed
            mainContainer.style.marginTop = `${mainContainerMarginTop}px`;
            // Calculate height dynamically, considering potential viewport units
            mainContainer.style.height = `calc(100vh - ${mainContainerMarginTop}px)`;
            console.log("Main container positioned. marginTop:", mainContainerMarginTop);
        } catch (error) {
             console.error("Error in positionElements:", error);
        }
    }

    function adjustStickyHeader() {
        if (!scrollableContainer) return;
        const scrollY = scrollableContainer.scrollTop;
        const scrollThreshold = 50;
        if (!topHeader || !searchHeader || !mainContainer) return;
        const topH = topHeader.offsetHeight;
        const searchH = searchHeader.offsetHeight;
        const scrollingDown = scrollY > lastScrollY;

        if (scrollY > scrollThreshold && scrollingDown && !topHeader.classList.contains('top-header-hidden')) {
             topHeader.classList.add('top-header-hidden');
             searchHeader.style.top = '0px';
             const mainContainerTop = searchH - 20; // Offset
             mainContainer.style.marginTop = `${mainContainerTop}px`;
             mainContainer.style.height = `calc(100vh - ${mainContainerTop}px)`;
             // console.log("Hiding top header");
        } else if ((!scrollingDown || scrollY <= scrollThreshold) && topHeader.classList.contains('top-header-hidden')) {
             topHeader.classList.remove('top-header-hidden');
             searchHeader.style.top = `${topH}px`;
             const totalHeaderHeight = topH + searchH;
             const mainContainerTop = totalHeaderHeight - 20; // Offset
             mainContainer.style.marginTop = `${mainContainerTop}px`;
             mainContainer.style.height = `calc(100vh - ${mainContainerTop}px)`;
             // console.log("Showing top header");
        }
        lastScrollY = scrollY <= 0 ? 0 : scrollY;
    }

    async function loadAndRenderProducts() {
        console.log("Fetching products from API...");
        showSkeletons();

        try {
            const response = await fetch(`${API_BASE_URL}/products/`);
            if (!response.ok) {
                 let errorDetail = response.statusText;
                 try { const errorData = await response.json(); errorDetail = errorData.detail || JSON.stringify(errorData); } catch (e) {}
                 throw new Error(`API error! Status: ${response.status} - ${errorDetail}`);
            }

             // IMPORTANT: Check if your API uses pagination. If so, the products are usually in a 'results' key.
             // const responseData = await response.json();
             // const fetchedProducts = responseData.results || responseData; // Adjust based on actual API response structure

             // Assuming direct array response for now:
             const fetchedProducts = await response.json();

            console.log(`Products fetched successfully: ${fetchedProducts?.length || 0} items.`);
            console.log("Sample Product Data:", fetchedProducts?.[0]); // Log first product to check fields

            allProducts = Array.isArray(fetchedProducts) ? [...fetchedProducts] : []; // Ensure allProducts is an array
            currentSort = 'newest';

            if(currentSortLabel) currentSortLabel.textContent = 'Newest';
             if(sortDropdown) {
                sortDropdown.querySelectorAll('.sort-option').forEach(opt => opt.classList.remove('bg-primary-light', 'font-semibold'));
                sortDropdown.querySelector('.sort-option[data-sort="newest"]')?.classList.add('bg-primary-light', 'font-semibold');
            }

            currentProducts = sortProducts([...allProducts], currentSort);
            renderProducts(currentProducts);

        } catch (error) {
            console.error('Failed to load products:', error);
            if(productsGrid) productsGrid.innerHTML = `<p style="color: red;">Error loading products: ${error.message}. Check API server and console.</p>`;
        }
    }

    // --- ===== Main Execution Flow ===== ---

    console.log("Setting up initial page state and listeners...");

    // 1. Initial positioning of headers and main container
    positionElements();

    // 2. Setup Event Listeners for UI elements
    // Filter toggle/close
    if (filterToggle) filterToggle.addEventListener('click', () => toggleFilterPanel(true));
    if (closeFilter) closeFilter.addEventListener('click', () => toggleFilterPanel(false));
    if (overlay) overlay.addEventListener('click', () => {
        toggleFilterPanel(false);
        if (sortDropdown) sortDropdown.classList.remove('show');
    });

    // Scroll-to-top button
    if (scrollTopBtn && scrollableContainer) {
        scrollTopBtn.addEventListener('click', () => {
            scrollableContainer.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Scroll listener for headers and scroll-to-top button
    if (scrollableContainer) {
        scrollableContainer.addEventListener('scroll', () => {
            const scrollY = scrollableContainer.scrollTop;
            // Toggle scroll-to-top button visibility
            if (scrollTopBtn) {
                 if (scrollY > 300) scrollTopBtn.classList.add('visible');
                 else scrollTopBtn.classList.remove('visible');
            }
            // Adjust header visibility on scroll
            adjustStickyHeader();
        }, { passive: true }); // Use passive listener for scroll performance
    }

    // Sort dropdown toggle
    if (sortToggle) {
        sortToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent document click listener from closing it immediately
            if (sortDropdown) sortDropdown.classList.toggle('show');
        });
    }

    // Sort option selection
    if (sortDropdown) {
         sortDropdown.querySelectorAll('.sort-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent link navigation if it's an anchor
                const sortType = option.dataset.sort;
                if (currentSort === sortType) {
                    sortDropdown.classList.remove('show'); return; // No change
                }
                currentSort = sortType;
                if (currentSortLabel) currentSortLabel.textContent = option.textContent;
                sortDropdown.querySelectorAll('.sort-option').forEach(opt => opt.classList.remove('bg-primary-light', 'font-semibold'));
                option.classList.add('bg-primary-light', 'font-semibold');
                sortDropdown.classList.remove('show');
                currentProducts = sortProducts(currentProducts, currentSort); // Re-sort CURRENT displayed products
                renderProducts(currentProducts); // Re-render
                showToast(`Sorted by ${option.textContent}`);
            });
        });
    }

    // Search input handler
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                applyFiltersAndSearch(e.target.value); // Trigger client-side filtering/search
            }, 350); // Debounce search input
        });
    }

    // Filter panel buttons
    if (resetFilterBtn) resetFilterBtn.addEventListener('click', resetFilterForm);
    if (applyFilterBtn) applyFilterBtn.addEventListener('click', () => {
        if (isFilterResetPending) {
            resetFilterForm(); // Ensure form is visually reset first
            applyFiltersAndSearch(); // Apply with no query/filters
            isFilterResetPending = false; // Reset the flag *after* applying
            showToast('Filters reset');
        } else {
            applyFiltersAndSearch(searchInput?.value.trim() || ''); // Apply current filters/search
        }
        toggleFilterPanel(false); // Close panel after applying/resetting
    });

    // Filter panel category/subcategory interactions (keep your logic)
    if (filterPanel) {
         filterPanel.querySelectorAll('input.category-checkbox').forEach(catCheckbox => {
            catCheckbox.addEventListener('change', (e) => { /* Your existing subcategory toggle logic */ });
         });
         filterPanel.querySelectorAll('.accordion-content input[type="checkbox"]').forEach(subCheckbox => {
            subCheckbox.addEventListener('change', (e) => { /* Your existing parent category check logic */ });
         });
    }

    // Global click listener (e.g., to close dropdowns)
    document.addEventListener('click', (e) => {
        // Close sort dropdown if click is outside
        if (sortDropdown && !sortToggle?.contains(e.target) && !sortDropdown.contains(e.target)) {
            sortDropdown.classList.remove('show');
        }
    });

    // Window resize listener
    window.addEventListener('resize', positionElements); // Recalculate positioning on resize

    // 3. Load initial data from API
    loadAndRenderProducts();

    console.log("Browse Page Initialization Script Finished.");

}); // End of DOMContentLoaded listener