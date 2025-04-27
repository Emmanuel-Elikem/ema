function setupCarousel() {
    const bannerSlides = document.querySelectorAll('.banner-slide');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    const prevButton = document.querySelector('.carousel-arrow.prev');
    const nextButton = document.querySelector('.carousel-arrow.next');
    const carousel = document.querySelector('.banner-carousel');
    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        if (!bannerSlides.length || !indicators.length) return;
        bannerSlides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        currentSlide = index;
        if (currentSlide >= bannerSlides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = bannerSlides.length - 1;

        bannerSlides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }
    
    function startAutoSlide() {
        stopAutoSlide(); // Clear any existing interval
        autoSlideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000); // Change slide every 5 seconds (changed from 500ms)
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }

    // Setup click handlers for indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide(); // Stop auto-sliding when user interacts
            startAutoSlide(); // Restart timer
        });
    });
    
    // Setup navigation buttons
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            showSlide(currentSlide - 1);
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            showSlide(currentSlide + 1);
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    // Pause auto-slide on hover
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
    }

    // Initialize the carousel
    showSlide(0); // Show first slide initially
    startAutoSlide(); // Start auto-slide
}

document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.querySelector('.loading-overlay');
    const skeletonElements = document.querySelectorAll('.skeleton');
    const navItems = document.querySelectorAll('.floating-nav .nav-item');
    const navIndicator = document.querySelector('.floating-nav .nav-indicator');
    const navList = document.querySelector('.floating-nav ul');
    const filterTabs = document.querySelectorAll('.filter-tab');
    const productGrid = document.querySelector('.product-grid');
    
    // --- Loading Simulation ---
    function hideLoadingState() {
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
            setTimeout(() => {
                if (loadingOverlay.parentNode) {
                    loadingOverlay.parentNode.removeChild(loadingOverlay);
                }
            }, 500);
        }
        
        skeletonElements.forEach(el => {
            el.classList.remove('skeleton');
            // Load initial content after skeleton removal
            if (el.classList.contains('product-grid')) {
                loadProducts('trending'); // Load default filter products
            }
        });
        
        // Setup carousel after removing skeleton state
        setupCarousel();
    }

    setTimeout(hideLoadingState, 2000); // Simulate 2 seconds loading

    // Rest of your code (navigation, filter tabs)...
    
    // --- Floating Navbar Interaction ---
    function moveIndicator(activeIndex) {
        const activeItem = navItems[activeIndex];
        if (!activeItem || !navIndicator || !navList) return;
        const itemRect = activeItem.getBoundingClientRect();
        const navListRect = navList.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const listStart = navListRect.left;
        const indicatorWidth = navIndicator.offsetWidth;
        const indicatorLeft = itemCenter - listStart - (indicatorWidth / 2);
        navIndicator.style.left = `${indicatorLeft}px`;
    }

    navItems.forEach((item, index) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            moveIndicator(index);
            console.log(`Nav item ${index + 1} clicked`);
        });
    });

    const initialActiveIndex = Array.from(navItems).findIndex(item => item.classList.contains('active'));
    if (initialActiveIndex !== -1) {
        setTimeout(() => moveIndicator(initialActiveIndex), 100);
    }

    const resizeObserver = new ResizeObserver(() => {
        const currentActiveIndex = Array.from(navItems).findIndex(item => item.classList.contains('active'));
        if (currentActiveIndex !== -1) {
            moveIndicator(currentActiveIndex);
        }
    });
    resizeObserver.observe(document.body);

    // --- Product Filter Tab Interaction ---
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filterType = tab.getAttribute('data-filter');
            console.log(`Selected Filter: ${filterType}`);
            loadProducts(filterType); // Function to load products based on filter
        });
    });

    // --- Function to Load Products (Example) ---
    function loadProducts(filter) {
        if (!productGrid) return;

        // 1. Show skeleton loader again while fetching
        productGrid.classList.add('skeleton');
        productGrid.innerHTML = `
            <div class="product-card"></div>
            <div class="product-card"></div>
            <div class="product-card"></div>
            <div class="product-card"></div>
        `; // Reset to skeleton cards

        // 2. Simulate fetching data (replace with actual fetch call)
        console.log(`Loading products for: ${filter}...`);
        setTimeout(() => {
            // 3. Remove skeleton and display fetched data
            productGrid.classList.remove('skeleton');
            productGrid.innerHTML = ''; // Clear skeleton cards

            // Example: Generate dummy product cards based on filter
            const numProducts = filter === 'top-vendors' ? 3 : 4; // Fewer vendors maybe?
            for (let i = 0; i < numProducts; i++) {
                const card = document.createElement('div');
                card.className = 'product-card';
                // Add actual content to the card based on fetched data
                card.innerHTML = `
                    <img src="placeholder-product-${filter}-${i+1}.png" alt="${filter} Product ${i+1}" style="width:100%; height: 120px; background: #eee; object-fit: cover;">
                    <div style="padding: 8px;">
                        <h4 style="font-size: 0.9em; margin-bottom: 4px;">${filter.charAt(0).toUpperCase() + filter.slice(1)} Item ${i+1}</h4>
                        <p style="font-size: 0.8em; color: var(--secondary-text);">$${(Math.random() * 50 + 10).toFixed(2)}</p>
                    </div>
                `;
                productGrid.appendChild(card);
            }
            // Re-apply pop-in animation to new cards if desired
            productGrid.querySelectorAll('.product-card').forEach((card, index) => {
                card.style.animationDelay = `${0.1 * index}s`; // Simple stagger
                card.style.opacity = 0; // Reset for animation
                card.style.transform = 'scale(0.95)';
                card.style.animation = 'popIn 0.4s ease forwards';
            });

            console.log(`Products loaded for: ${filter}`);
        }, 800); // Simulate network delay
    }
});