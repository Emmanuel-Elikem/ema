document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const productDetailPage = document.getElementById('productDetailPage');
    const pageContent = document.querySelector('.page-content');
    const skeletonLoader = document.querySelector('.skeleton-loader');
    const backButton = document.querySelector('.back-button');
    const gallery = document.getElementById('productGallery');
    const galleryDots = document.getElementById('galleryDots');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const fullscreenToggle = document.getElementById('fullscreenToggle');
    const productNameEl = document.getElementById('productName');
    const productPriceEl = document.getElementById('productPrice');
    const specsList = document.getElementById('specsList');
    const descriptionContent = document.getElementById('descriptionContent');
    const productDescriptionEl = document.getElementById('productDescription');
    const toggleDescriptionBtn = document.getElementById('toggleDescriptionBtn');
    const vendorInfoEl = document.getElementById('vendorInfo');
    const reviewList = document.getElementById('reviewList');
    const viewAllReviewsBtn = document.getElementById('viewAllReviewsBtn');
    const reportLink = document.getElementById('reportLink');
    const similarProductsScroll = document.getElementById('similarProductsScroll');
    const callVendorBtn = document.getElementById('callVendorBtn');
    const orderNowBtn = document.getElementById('orderNowBtn');
    const addToCartBtn = document.getElementById('addToCartBtn');
    const whatsappOverlay = document.getElementById('whatsappOverlay');
    const closeOverlayBtn = document.getElementById('closeOverlayBtn');
    const whatsappMessageTextarea = document.getElementById('whatsappMessage');
    const whatsappUserInput = document.getElementById('whatsappUserInput');
    const confirmWhatsappBtn = document.getElementById('confirmWhatsappBtn');
    const fullscreenViewer = document.getElementById('fullscreenViewer');
    const fullscreenImage = document.getElementById('fullscreenImage');
    const closeFullscreenBtn = document.getElementById('closeFullscreenBtn');
    const toastNotification = document.getElementById('toastNotification');
    const variationsSection = document.getElementById('productVariations');
    const variationOptionsContainer = document.getElementById('variationOptions');


    // --- Product Data (Replace with actual API fetch) ---
    const productData = {
        id: 'prod123',
        name: "Stylish Unisex Hoodie - UCC Special Edition",
        price: 85.00,
        currency: "GHS",
        images: [
            'https://via.placeholder.com/600x600/FFCC08/000000?text=Product+Image+1',
            'https://via.placeholder.com/600x600/cccccc/000000?text=Product+Image+2',
            'https://via.placeholder.com/600x600/eeeeee/000000?text=Product+Image+3'
        ],
        specifications: [
            { label: 'Brand', value: 'CampusStyle' },
            { label: 'Color', value: 'Charcoal Grey' },
            { label: 'Condition', value: 'New' },
            { label: 'Material', value: '80% Cotton, 20% Polyester' },
            { label: 'Fit', value: 'Regular' }
        ],
        description: "Stay comfortable and stylish on campus with this exclusive UCC Special Edition hoodie. Made from a soft cotton blend, it features a classic design with the UCC logo subtly embroidered. Perfect for lectures, library sessions, or just hanging out. Available in multiple sizes. Get yours today and show your school pride!",
        vendor: {
            shopName: 'Kofi\'s Campus Wears',
            rating: 4.5, // Average rating out of 5
            phoneNumber: '233240000000' // Use Ghana format without leading +/00 for WhatsApp link
        },
        reviews: [
            { rating: 5, text: "Love this hoodie! So soft and fits perfectly. The UCC embroidery is neat.", reviewer: "Ama P." },
            { rating: 4, text: "Good quality for the price. Keeps me warm during early morning lectures.", reviewer: "Yaw M." },
            { rating: 5, text: "Excellent purchase. Fast delivery from the vendor too!", reviewer: "StudentBuyer1" },
             { rating: 3, text: "It's okay, but the color looked slightly different online. Still wearable though.", reviewer: "Nana K." }
        ],
        similarProducts: [
            { id: 'sim001', name: 'UCC Branded T-Shirt', price: 45.00, image: 'https://via.placeholder.com/150x100/cccccc/000000?text=Similar+1' },
            { id: 'sim002', name: 'Campus Backpack', price: 120.00, image: 'https://via.placeholder.com/150x100/dddddd/000000?text=Similar+2' },
            { id: 'sim003', name: 'Student Laptop Stand', price: 60.00, image: 'https://via.placeholder.com/150x100/eeeeee/000000?text=Similar+3' },
            { id: 'sim004', name: 'Comfortable Slides', price: 55.00, image: 'https://via.placeholder.com/150x100/cccccc/000000?text=Similar+4' }
        ],
        variations: [ // Example variations
            {
                name: "Size",
                options: ["S", "M", "L", "XL"]
            }
            // Add more variation types like "Color" if needed
        ],
        selectedVariation: {} // To store user selection
    };

    let currentImageIndex = 0;
    let autoSlideInterval;
    let toastTimeout;

    // --- Functions ---

    function showToast(message, duration = 3000) {
        if (toastTimeout) clearTimeout(toastTimeout); // Clear previous toast timeout

        toastNotification.textContent = message;
        toastNotification.classList.add('show');

        toastTimeout = setTimeout(() => {
            toastNotification.classList.remove('show');
        }, duration);
    }

    function populateProductDetails() {
        // Basic Info
        productNameEl.textContent = productData.name;
        productPriceEl.textContent = `${productData.currency} ${productData.price.toFixed(2)}`;

        // Image Gallery
        gallery.innerHTML = ''; // Clear previous images
        galleryDots.innerHTML = ''; // Clear previous dots
        productData.images.forEach((imgUrl, index) => {
            const img = document.createElement('img');
            img.src = imgUrl;
            img.alt = `${productData.name} - Image ${index + 1}`;
            img.loading = 'lazy'; // Lazy load images
             img.addEventListener('click', () => showFullscreen(imgUrl)); // Add click for fullscreen
            gallery.appendChild(img);

            // Create dots if more than one image
            if (productData.images.length > 1) {
                const dot = document.createElement('span');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dot.dataset.index = index;
                dot.addEventListener('click', () => goToSlide(index));
                galleryDots.appendChild(dot);
            }
        });

        // Specifications
        specsList.innerHTML = ''; // Clear previous specs
        productData.specifications.forEach(spec => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="spec-label">${spec.label}:</span> <span class="spec-value">${spec.value}</span>`;
            specsList.appendChild(li);
        });

        // Description
        productDescriptionEl.textContent = productData.description;
        // Reset description toggle state
        descriptionContent.classList.remove('expanded');
        toggleDescriptionBtn.innerHTML = 'Show More <span class="arrow">▼</span>';


        // Vendor Info
        vendorInfoEl.innerHTML = `
            <a href="#" class="vendor-name" aria-label="View vendor store: ${productData.vendor.shopName}">${productData.vendor.shopName}</a>
            <span class="vendor-rating">
                Rating: ${productData.vendor.rating.toFixed(1)} <span class="stars">★★★★★</span> </span>
        `;
        // Add logic for star rating display if needed (e.g., fill based on rating)

        // Reviews Preview
        reviewList.innerHTML = ''; // Clear previous reviews
        const reviewsToShow = productData.reviews.slice(0, 3); // Show first 3
        if (reviewsToShow.length > 0) {
            reviewsToShow.forEach(review => {
                 const li = document.createElement('li');
                li.innerHTML = `
                    <div class="review-rating">Rating: ${review.rating}/5 <span class="stars">★★★★★</span></div> <p class="review-text">${review.text}</p>
                    <span class="reviewer">- ${review.reviewer}</span>
                `;
                reviewList.appendChild(li);
            });
             viewAllReviewsBtn.style.display = 'block'; // Show 'View All' if there are reviews
        } else {
             reviewList.innerHTML = '<li>No reviews yet.</li>';
              viewAllReviewsBtn.style.display = 'none'; // Hide 'View All' if no reviews
        }


        // Similar Products
        similarProductsScroll.innerHTML = ''; // Clear previous similar products
        productData.similarProducts.forEach(simProd => {
            const card = document.createElement('div');
            card.classList.add('similar-product-card');
            card.dataset.productId = simProd.id; // For potential navigation
            card.innerHTML = `
                <img src="${simProd.image}" alt="${simProd.name}" loading="lazy">
                <div class="similar-product-info">
                    <div class="similar-product-name">${simProd.name}</div>
                    <div class="similar-product-price">${productData.currency} ${simProd.price.toFixed(2)}</div>
                </div>
            `;
             card.addEventListener('click', () => {
                console.log(`Maps to similar product: ${simProd.id}`);
                // window.location.href = `/product/${simProd.id}`; // Example navigation
                 showToast(`Loading ${simProd.name}...`);
            });
            similarProductsScroll.appendChild(card);
        });

         // Variations
        variationOptionsContainer.innerHTML = '';
        if (productData.variations && productData.variations.length > 0) {
            variationsSection.style.display = 'block';
            productData.variations.forEach(variation => {
                // Assuming only one variation type for simplicity here (e.g., Size)
                // You might need more complex logic for multiple variation types
                variation.options.forEach(option => {
                    const button = document.createElement('button');
                    button.classList.add('variation-button');
                    button.textContent = option;
                    button.dataset.variationName = variation.name;
                    button.dataset.variationValue = option;
                    button.addEventListener('click', handleVariationSelect);
                    variationOptionsContainer.appendChild(button);
                });
            });
             checkVariationSelection(); // Check if selection needed initially
        } else {
             variationsSection.style.display = 'none'; // Hide if no variations
             checkVariationSelection(); // Ensure buttons enabled if no variations
        }


        // Start auto slide if multiple images
        setupGallerySlider();

        // Hide Skeleton, Show Content
         setTimeout(() => { // Simulate loading finished
             skeletonLoader.style.display = 'none';
             pageContent.style.display = 'block'; // Or 'grid' if using grid layout
             productDetailPage.classList.add('loaded');
         }, 500); // Adjust delay as needed

    }

     function handleVariationSelect(event) {
        const selectedButton = event.target;
        const variationName = selectedButton.dataset.variationName;
        const variationValue = selectedButton.dataset.variationValue;

        // Deselect other buttons for the same variation type
        const buttons = variationOptionsContainer.querySelectorAll(`.variation-button[data-variation-name="${variationName}"]`);
        buttons.forEach(btn => btn.classList.remove('selected'));

        // Select the clicked button
        selectedButton.classList.add('selected');
        selectedButton.classList.remove('disabled'); // Remove warning style if present

        // Store selection
        productData.selectedVariation[variationName] = variationValue;
        console.log('Selected variation:', productData.selectedVariation);

        checkVariationSelection(); // Enable/disable action buttons
    }

    function checkVariationSelection() {
        let allVariationsSelected = true;
         if (productData.variations && productData.variations.length > 0) {
             // Check if all defined variation types have a selection
             for (const variation of productData.variations) {
                 if (!productData.selectedVariation[variation.name]) {
                     allVariationsSelected = false;
                     break;
                 }
             }

              // Add visual indication if a variation is required but not selected
             variationOptionsContainer.querySelectorAll('.variation-button').forEach(btn => {
                 const variationName = btn.dataset.variationName;
                  if (!productData.selectedVariation[variationName]) {
                      // Maybe add a subtle border or indication - example using 'disabled' class styling
                      // btn.classList.add('disabled'); // Or a different class like 'required'
                  } else {
                     // btn.classList.remove('disabled');
                  }
             });

         } // else: no variations defined, proceed as if selected

         // Enable/disable buttons based on selection
        orderNowBtn.disabled = !allVariationsSelected;
        addToCartBtn.disabled = !allVariationsSelected;

         if (!allVariationsSelected) {
             // Optionally show a message or change button style further
             // e.g., orderNowBtn.style.opacity = 0.6;
             // e.g., addToCartBtn.style.opacity = 0.6;
             console.log("Please select required options (e.g., Size).");
         } else {
              // orderNowBtn.style.opacity = 1;
              // addToCartBtn.style.opacity = 1;
         }
    }

    // --- Image Gallery Functions ---
    function updateDots(index) {
        const dots = galleryDots.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function goToSlide(index) {
        if (index < 0) index = productData.images.length - 1;
        if (index >= productData.images.length) index = 0;

        gallery.scrollTo({
            left: gallery.clientWidth * index,
            behavior: 'smooth'
        });
        currentImageIndex = index;
        updateDots(index);
        resetAutoSlide(); // Reset timer when manually changing slide
    }

    function nextSlide() {
        goToSlide(currentImageIndex + 1);
    }

    function startAutoSlide() {
        if (productData.images.length > 1) {
            stopAutoSlide(); // Clear existing interval first
            autoSlideInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
        }
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    function setupGallerySlider() {
        // Pause autoslide on interaction
        gallery.addEventListener('scroll', stopAutoSlide, { passive: true });
        gallery.addEventListener('touchstart', stopAutoSlide, { passive: true });
        gallery.addEventListener('touchend', resetAutoSlide, { passive: true });
        gallery.addEventListener('mouseenter', stopAutoSlide); // Pause on hover (desktop)
        gallery.addEventListener('mouseleave', resetAutoSlide); // Resume on mouse leave (desktop)

        // Update dots on scroll end (more reliable than 'scroll' event)
        let scrollTimeout;
        gallery.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                 const scrollLeft = gallery.scrollLeft;
                 const width = gallery.clientWidth;
                 const index = Math.round(scrollLeft / width);
                 if(index !== currentImageIndex) { // Update only if index changed
                     currentImageIndex = index;
                     updateDots(index);
                     // No resetAutoSlide here, let mouseleave/touchend handle resuming
                 }
            }, 150); // Debounce scroll event
        });


        startAutoSlide(); // Initial start
    }

     function showFullscreen(imageUrl) {
         stopAutoSlide(); // Pause slider when viewing fullscreen
         fullscreenImage.src = imageUrl;
         fullscreenViewer.classList.add('visible');
         // Optional: Disable body scroll
         document.body.style.overflow = 'hidden';
    }

     function closeFullscreen() {
         fullscreenViewer.classList.remove('visible');
          resetAutoSlide(); // Resume slider
         // Optional: Enable body scroll
         document.body.style.overflow = '';
     }

    // --- Event Listeners ---

    backButton.addEventListener('click', () => {
        console.log("Navigate back");
        window.history.back(); // Simple back navigation
    });

    wishlistBtn.addEventListener('click', () => {
        wishlistBtn.classList.toggle('active');
        wishlistBtn.blur(); // Remove focus outline after click
        const isAdding = wishlistBtn.classList.contains('active');
        showToast(isAdding ? 'Added to Wishlist!' : 'Removed from Wishlist');
        // Add actual logic to update user's wishlist (API call)
        console.log('Wishlist toggled:', isAdding);
    });

    toggleDescriptionBtn.addEventListener('click', () => {
        const isExpanded = descriptionContent.classList.toggle('expanded');
        if (isExpanded) {
            toggleDescriptionBtn.innerHTML = 'Show Less <span class="arrow" style="transform: rotate(180deg);">▼</span>';
        } else {
            toggleDescriptionBtn.innerHTML = 'Show More <span class="arrow">▼</span>';
        }
    });

    viewAllReviewsBtn.addEventListener('click', () => {
        // Implement review modal or navigation
        console.log("View All Reviews clicked");
        showToast('Feature coming soon: View all reviews');
        // Example: modal.show(); or window.location.href = '/product/reviews';
    });

    reportLink.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default link behavior
        console.log("Report Incorrect Details clicked");
        showToast('Feature coming soon: Report details');
        // Implement reporting functionality (e.g., show a form/modal)
    });

    callVendorBtn.addEventListener('click', () => {
        if (productData.vendor.phoneNumber) {
            console.log(`Calling vendor: ${productData.vendor.phoneNumber}`);
            window.location.href = `tel:${productData.vendor.phoneNumber}`;
        } else {
            showToast('Vendor phone number not available');
        }
    });

    orderNowBtn.addEventListener('click', () => {
         if (orderNowBtn.disabled) {
            showToast('Please select product options first.');
            // Optional: Briefly highlight the variation section
             variationsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
             variationOptionsContainer.querySelectorAll('.variation-button:not(.selected)').forEach(btn => {
                 btn.classList.add('disabled'); // Add temporary warning style
                 setTimeout(() => btn.classList.remove('disabled'), 1500); // Remove after a delay
             });
            return;
        }

        // Pre-fill WhatsApp message
        let selectedOptionsString = "";
         if (Object.keys(productData.selectedVariation).length > 0) {
             selectedOptionsString = "\nSelected Options:\n";
             for (const [key, value] of Object.entries(productData.selectedVariation)) {
                 selectedOptionsString += `- ${key}: ${value}\n`;
             }
         }

        const messageTemplate = `Hello ${productData.vendor.shopName || 'Vendor'},

I'm interested in ordering the following item from ema-Campus Shopping:

Product: ${productData.name}
Price: ${productData.currency} ${productData.price.toFixed(2)}${selectedOptionsString}
(Link: ${window.location.href})

My additional message/questions:
`;
        whatsappMessageTextarea.value = messageTemplate;
        whatsappUserInput.value = ''; // Clear previous user input
        whatsappOverlay.classList.add('visible');
         // Optional: Disable body scroll when overlay is open
         // document.body.style.overflow = 'hidden';
    });

    closeOverlayBtn.addEventListener('click', () => {
        whatsappOverlay.classList.remove('visible');
         // Optional: Enable body scroll when overlay is closed
         // document.body.style.overflow = '';
    });

     // Optional: Close overlay if clicked outside the content area
    // whatsappOverlay.addEventListener('click', (e) => {
    //     if (e.target === whatsappOverlay) { // Check if click is on the backdrop
    //         whatsappOverlay.classList.remove('visible');
    //          document.body.style.overflow = '';
    //     }
    // });


    confirmWhatsappBtn.addEventListener('click', () => {
        const baseMessage = whatsappMessageTextarea.value.trim();
        const userMessage = whatsappUserInput.value.trim();
        const fullMessage = userMessage ? `${baseMessage}\n${userMessage}\n\nThanks!` : `${baseMessage}\nThanks!`;
        const vendorPhone = productData.vendor.phoneNumber;

        if (!vendorPhone) {
            showToast("Vendor WhatsApp number not configured.", 4000);
            return;
        }

        const whatsappUrl = `https://wa.me/${vendorPhone}?text=${encodeURIComponent(fullMessage)}`;

        console.log("Opening WhatsApp:", whatsappUrl);
        window.open(whatsappUrl, '_blank'); // Open in new tab/WhatsApp app

        whatsappOverlay.classList.remove('visible'); // Close the overlay
        // Optional: Enable body scroll
        // document.body.style.overflow = '';
    });


    addToCartBtn.addEventListener('click', () => {
         if (addToCartBtn.disabled) {
             showToast('Please select product options first.');
             // Optional: Briefly highlight the variation section
             variationsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
             variationOptionsContainer.querySelectorAll('.variation-button:not(.selected)').forEach(btn => {
                 btn.classList.add('disabled'); // Add temporary warning style
                 setTimeout(() => btn.classList.remove('disabled'), 1500); // Remove after a delay
             });
            return;
        }

        // Visual feedback
        addToCartBtn.innerHTML = '✔️'; // Checkmark icon
        addToCartBtn.classList.add('added');
        showToast('Added to Cart!');

        // Reset button after a short delay
        setTimeout(() => {
            addToCartBtn.innerHTML = '🛒'; // Back to Cart Icon
            addToCartBtn.classList.remove('added');
        }, 1500);

        // Actual Add to Cart Logic (e.g., update cart state, API call)
        console.log('Adding to cart:', {
            productId: productData.id,
            name: productData.name,
            price: productData.price,
            quantity: 1, // Default quantity
            image: productData.images[0], // Add first image for cart display
            variations: { ...productData.selectedVariation } // Copy selected variations
        });
        // Example: updateCartCount(newItem);
    });

     // Fullscreen Viewer Listeners
     fullscreenToggle.addEventListener('click', () => {
         if(productData.images.length > 0) {
             showFullscreen(productData.images[currentImageIndex]);
         }
     });
     closeFullscreenBtn.addEventListener('click', closeFullscreen);
     fullscreenViewer.addEventListener('click', (e) => { // Close if background is clicked
         if (e.target === fullscreenViewer) {
             closeFullscreen();
         }
     });


    // --- Initial Load ---
    populateProductDetails();

}); // End DOMContentLoaded