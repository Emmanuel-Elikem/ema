// app.js - Core application logic for Campus Marketplace Profile

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    initializeLoader();
    initializeNavigation();
    initializeSidePanels();
    initializeProfile();
    initializeOrders();
    initializeReviews();
    
    // Simulate data loading
    simulateLoading();
});

// Loading Screen Management
function initializeLoader() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingText = document.querySelector('.loading-text');
    
    window.showLoader = (message = 'Loading...') => {
        loadingText.textContent = message;
        loadingScreen.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };
    
    window.hideLoader = () => {
        loadingScreen.classList.add('animate-fadeOut');
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            loadingScreen.classList.remove('animate-fadeOut');
            document.body.style.overflow = '';
        }, 500);
    };
}

function simulateLoading() {
    // Simulate API data fetch
    showLoader('Loading your profile...');
    
    setTimeout(() => {
        // Load user data
        loadUserData();
        
        // Load orders data
        loadOrdersData();
        
        // Load reviews data
        loadReviewsData();
        
        // Hide loader after simulated loading
        setTimeout(() => {
            hideLoader();
        }, 800);
    }, 1500);
}

// Navigation Management
function initializeNavigation() {
    const navCards = document.querySelectorAll('.nav-card');
    const contentSections = document.querySelectorAll('.content-section');
    
    navCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetSection = card.getAttribute('data-section');
            
            // Update active nav
            navCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            // Show target section
            contentSections.forEach(section => {
                section.classList.remove('active');
                if(section.id === targetSection) {
                    section.classList.add('active');
                    section.classList.add('animate-fadeIn');
                    setTimeout(() => {
                        section.classList.remove('animate-fadeIn');
                    }, 300);
                }
            });
        });
    });
}

// Side Panel Management
function initializeSidePanels() {
    // Notification panel
    const notificationButton = document.getElementById('notification-button');
    const notificationPanel = document.getElementById('notification-panel');
    const closeNotificationPanel = document.getElementById('close-notification-panel');
    
    notificationButton.addEventListener('click', () => {
        notificationPanel.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
    
    closeNotificationPanel.addEventListener('click', () => {
        notificationPanel.classList.add('hidden');
        document.body.style.overflow = '';
    });
    
    // Cart panel
    const cartButton = document.getElementById('cart-button');
    const cartPanel = document.getElementById('cart-panel');
    const closeCartPanel = document.getElementById('close-cart-panel');
    
    cartButton.addEventListener('click', () => {
        cartPanel.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    });
    
    closeCartPanel.addEventListener('click', () => {
        cartPanel.classList.add('hidden');
        document.body.style.overflow = '';
    });
    
    // Close panels when clicking outside
    document.addEventListener('click', (e) => {
        if(!notificationPanel.classList.contains('hidden') && 
           !notificationPanel.contains(e.target) && 
           !notificationButton.contains(e.target)) {
            notificationPanel.classList.add('hidden');
            document.body.style.overflow = '';
        }
        
        if(!cartPanel.classList.contains('hidden') && 
           !cartPanel.contains(e.target) && 
           !cartButton.contains(e.target)) {
            cartPanel.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });
}

// Profile Management
function initializeProfile() {
    const editButtons = document.querySelectorAll('.edit-button');
    
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const fieldContainer = button.closest('.editable-field');
            const fieldValue = fieldContainer.querySelector('.field-value');
            const fieldInput = fieldContainer.querySelector('.edit-input');
            const editActions = fieldContainer.querySelector('.edit-actions');
            
            // Enter edit mode
            fieldValue.classList.add('hidden');
            button.classList.add('hidden');
            fieldInput.classList.remove('hidden');
            editActions.classList.remove('hidden');
            
            // Focus input
            fieldInput.focus();
            
            // Set up save and cancel actions
            const saveButton = fieldContainer.querySelector('.save-button');
            const cancelButton = fieldContainer.querySelector('.cancel-button');
            
            saveButton.addEventListener('click', () => {
                // Save the new value
                fieldValue.textContent = fieldInput.value;
                
                // Exit edit mode
                fieldValue.classList.remove('hidden');
                button.classList.remove('hidden');
                fieldInput.classList.add('hidden');
                editActions.classList.add('hidden');
                
                // Show success feedback
                showToast('Profile updated successfully!', 'success');
            });
            
            cancelButton.addEventListener('click', () => {
                // Exit edit mode without saving
                fieldValue.classList.remove('hidden');
                button.classList.remove('hidden');
                fieldInput.classList.add('hidden');
                editActions.classList.add('hidden');
            });
        });
    });
}

// Order Management
function initializeOrders() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const orderCards = document.querySelectorAll('.order-card');
    const viewDetailsButtons = document.querySelectorAll('.view-details-button');
    
    // Filter orders
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active filter
            filterButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            
            // Filter orders
            orderCards.forEach(card => {
                if(filter === 'all' || card.classList.contains(filter)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // View order details
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const orderCard = button.closest('.order-card');
            const orderDetails = orderCard.querySelector('.order-details');
            
            if(orderDetails.classList.contains('hidden')) {
                // Show details
                orderDetails.classList.remove('hidden');
                orderDetails.classList.add('animate-slideIn');
                button.textContent = 'Hide Details';
                
                setTimeout(() => {
                    orderDetails.classList.remove('animate-slideIn');
                }, 300);
            } else {
                // Hide details
                orderDetails.classList.add('hidden');
                button.textContent = 'View Details';
            }
        });
    });
    
    // Cancel order buttons
    const cancelOrderButtons = document.querySelectorAll('.cancel-order-button');
    cancelOrderButtons.forEach(button => {
        button.addEventListener('click', () => {
            if(confirm('Are you sure you want to cancel this order?')) {
                const orderCard = button.closest('.order-card');
                const statusDot = orderCard.querySelector('.status-dot');
                const statusText = orderCard.querySelector('.status-text');
                
                // Update order status
                orderCard.classList.remove('pending');
                orderCard.classList.add('cancelled');
                statusText.textContent = 'Cancelled';
                
                // Hide cancel button
                button.classList.add('hidden');
                
                // Show toast
                showToast('Order cancelled successfully', 'success');
            }
        });
    });
}

// Reviews Management
function initializeReviews() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Update active tab
            tabButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            
            // Show target tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if(content.id === targetTab) {
                    content.classList.add('active');
                    content.classList.add('animate-fadeIn');
                    setTimeout(() => {
                        content.classList.remove('animate-fadeIn');
                    }, 300);
                }
            });
        });
    });
    
    // Star rating system
    const stars = document.querySelectorAll('.stars i');
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            const ratingValue = index + 1;
            const starsContainer = star.closest('.stars');
            const allStars = starsContainer.querySelectorAll('i');
            
            // Update stars UI
            allStars.forEach((s, i) => {
                if(i <= index) {
                    s.classList.remove('far');
                    s.classList.add('fas');
                } else {
                    s.classList.remove('fas');
                    s.classList.add('far');
                }
            });
            
            // Store rating value
            const ratingInput = starsContainer.closest('form').querySelector('input[name="rating"]');
            if(ratingInput) {
                ratingInput.value = ratingValue;
            }
        });
        
        // Hover effects
        star.addEventListener('mouseenter', () => {
            const starsContainer = star.closest('.stars');
            const allStars = starsContainer.querySelectorAll('i');
            
            allStars.forEach((s, i) => {
                if(i <= index) {
                    s.classList.add('hover');
                } else {
                    s.classList.remove('hover');
                }
            });
        });
        
        star.addEventListener('mouseleave', () => {
            const starsContainer = star.closest('.stars');
            const allStars = starsContainer.querySelectorAll('i');
            
            allStars.forEach(s => {
                s.classList.remove('hover');
            });
        });
    });
    
    // Review submission
    const reviewForms = document.querySelectorAll('.review-form');
    reviewForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const rating = form.querySelector('input[name="rating"]').value;
            const comment = form.querySelector('textarea[name="comment"]').value;
            
            if(rating && comment) {
                // Simulate submission success
                form.reset();
                showToast('Review submitted successfully!', 'success');
                
                // Update UI to show review is completed
                const reviewCard = form.closest('.review-card');
                reviewCard.classList.add('animate-fadeOut');
                
                setTimeout(() => {
                    reviewCard.remove();
                    
                    // If no more pending reviews, show message
                    const pendingReviews = document.querySelectorAll('#pending-reviews .review-card');
                    if(pendingReviews.length === 0) {
                        const noReviewsMessage = document.createElement('p');
                        noReviewsMessage.classList.add('text-center', 'text-light', 'mt-lg');
                        noReviewsMessage.textContent = 'No pending reviews. Great job!';
                        document.getElementById('pending-reviews').appendChild(noReviewsMessage);
                    }
                }, 300);
            } else {
                showToast('Please provide both rating and comment', 'error');
            }
        });
    });
}

// Helper Functions
function showToast(message, type = 'info') {
    // Create toast element if it doesn't exist
    let toast = document.getElementById('toast');
    if(!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '4px';
        toast.style.zIndex = '1000';
        toast.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        document.body.appendChild(toast);
    }
    
    // Set toast type
    switch(type) {
        case 'success':
            toast.style.backgroundColor = 'rgba(76, 175, 80, 0.9)';
            toast.style.color = 'white';
            break;
        case 'error':
            toast.style.backgroundColor = 'rgba(244, 67, 54, 0.9)';
            toast.style.color = 'white';
            break;
        case 'warning':
            toast.style.backgroundColor = 'rgba(255, 152, 0, 0.9)';
            toast.style.color = 'white';
            break;
        default:
            toast.style.backgroundColor = 'rgba(33, 150, 243, 0.9)';
            toast.style.color = 'white';
    }
    
    // Update message and show toast
    toast.textContent = message;
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
    
    // Hide toast after delay
    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
    }, 3000);
}

// Data Loading Functions
function loadUserData() {
    // Simulate user data fetching
    const userData = {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john.doe@example.com',
        whatsapp: '+1234567890',
        campus: 'Main Campus',
        location: 'Block A, Room 123',
        lastLogin: 'Yesterday at 12:45 PM'
    };
    
    // Populate user info in header
    document.querySelector('.user-greeting h2').textContent = `Hello, ${userData.name}`;
    document.querySelector('.last-login').textContent = `Last login: ${userData.lastLogin}`;
    
    // Set avatar placeholder
    const avatarPlaceholders = document.querySelectorAll('.avatar-placeholder');
    avatarPlaceholders.forEach(placeholder => {
        placeholder.textContent = userData.name.charAt(0);
    });
    
    // Populate profile form fields
    document.getElementById('username-value').textContent = userData.username;
    document.getElementById('username-input').value = userData.username;
    
    document.getElementById('email-value').textContent = userData.email;
    document.getElementById('email-input').value = userData.email;
    
    document.getElementById('whatsapp-value').textContent = userData.whatsapp;
    document.getElementById('whatsapp-input').value = userData.whatsapp;
    
    document.getElementById('campus-value').textContent = userData.campus;
    document.getElementById('campus-input').value = userData.campus;
    
    document.getElementById('location-value').textContent = userData.location;
    document.getElementById('location-input').value = userData.location;
}

function loadOrdersData() {
    // Simulate orders data - would come from API in production
    const ordersData = [
        {
            id: 'ORD-001',
            date: '20 Apr 2025',
            status: 'pending',
            total: '$25.99',
            items: [
                { name: 'Textbook - Economics 101', quantity: 1, price: '$20.99' },
                { name: 'Highlighter Set', quantity: 1, price: '$5.00' }
            ]
        },
        {
            id: 'ORD-002',
            date: '15 Apr 2025',
            status: 'completed',
            total: '$15.50',
            items: [
                { name: 'USB Flash Drive 32GB', quantity: 1, price: '$15.50' }
            ]
        },
        {
            id: 'ORD-003',
            date: '10 Apr 2025',
            status: 'cancelled',
            total: '$8.99',
            items: [
                { name: 'Notebook - College Ruled', quantity: 2, price: '$8.99' }
            ]
        }
    ];
    
    // Create order cards - in production this would use a template system
    const ordersContainer = document.querySelector('.orders-container');
    if(!ordersContainer) return;
    
    ordersContainer.innerHTML = ''; // Clear placeholder
    
    ordersData.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = `order-card ${order.status}`;
        
        // Create order header
        const orderHeader = document.createElement('div');
        orderHeader.className = 'order-header';
        orderHeader.innerHTML = `
            <div class="order-id">
                <span class="label">Order ID</span>
                <span class="value">${order.id}</span>
            </div>
            <div class="order-date">
                <span class="label">Date</span>
                <span class="value">${order.date}</span>
            </div>
            <div class="order-status ${order.status}">
                <span class="status-dot"></span>
                <span class="status-text">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
            </div>
        `;
        
        // Create order summary
        const orderSummary = document.createElement('div');
        orderSummary.className = 'order-summary';
        orderSummary.innerHTML = `
            <div class="total-items">
                <span class="label">Items</span>
                <span class="value">${order.items.length}</span>
            </div>
            <div class="total-price">
                <span class="label">Total</span>
                <span class="value font-bold">${order.total}</span>
            </div>
        `;
        
        // Create order actions
        const orderActions = document.createElement('div');
        orderActions.className = 'order-actions';
        
        const viewDetailsButton = document.createElement('button');
        viewDetailsButton.className = 'view-details-button';
        viewDetailsButton.textContent = 'View Details';
        orderActions.appendChild(viewDetailsButton);
        
        if(order.status === 'pending') {
            const cancelOrderButton = document.createElement('button');
            cancelOrderButton.className = 'cancel-order-button';
            cancelOrderButton.textContent = 'Cancel Order';
            orderActions.appendChild(cancelOrderButton);
        }
        
        if(order.status === 'completed') {
            const writeReviewButton = document.createElement('button');
            writeReviewButton.className = 'write-review-button';
            writeReviewButton.textContent = 'Write Review';
            orderActions.appendChild(writeReviewButton);
            
            const reorderButton = document.createElement('button');
            reorderButton.className = 'reorder-button';
            reorderButton.textContent = 'Reorder';
            orderActions.appendChild(reorderButton);
        }
        
        // Create order details (hidden by default)
        const orderDetails = document.createElement('div');
        orderDetails.className = 'order-details hidden';
        
        let itemsList = '<div class="items-list">';
        order.items.forEach(item => {
            itemsList += `
                <div class="item">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">Qty: ${item.quantity}</div>
                    <div class="item-price">${item.price}</div>
                </div>
            `;
        });
        itemsList += '</div>';
        
        orderDetails.innerHTML = `
            <h4>Order Items</h4>
            ${itemsList}
            <div class="delivery-info">
                <h4>Delivery Information</h4>
                <p>Location: Block A, Room 123</p>
                <p>Delivery Method: Campus Pickup</p>
                <p>Expected Delivery: ${order.status === 'completed' ? 'Delivered' : '1-2 working days'}</p>
            </div>
        `;
        
        // Assemble order card
        orderCard.appendChild(orderHeader);
        orderCard.appendChild(orderSummary);
        orderCard.appendChild(orderActions);
        orderCard.appendChild(orderDetails);
        
        ordersContainer.appendChild(orderCard);
    });
}

function loadReviewsData() {
    // Simulate reviews data
    const pendingReviews = [
        {
            vendor: 'Campus Bookstore',
            orderDate: '15 Apr 2025',
            product: 'USB Flash Drive 32GB'
        },
        {
            vendor: 'Stationery Hub',
            orderDate: '10 Apr 2025',
            product: 'Premium Notebook Set'
        }
    ];
    
    const completedReviews = [
        {
            vendor: 'Tech Corner',
            orderDate: '01 Apr 2025',
            product: 'Wireless Mouse',
            rating: 5,
            comment: 'Great product, works perfectly! Fast delivery too.',
            reviewDate: '03 Apr 2025'
        },
        {
            vendor: 'Campus Cafe',
            orderDate: '28 Mar 2025',
            product: 'Lunch Special',
            rating: 4,
            comment: 'Food was delicious, but delivery was a bit late.',
            reviewDate: '29 Mar 2025'
        }
    ];
    
    // Populate pending reviews
    const pendingReviewsContainer = document.getElementById('pending-reviews');
    if(pendingReviewsContainer) {
        pendingReviewsContainer.innerHTML = ''; // Clear placeholder
        
        if(pendingReviews.length === 0) {
            pendingReviewsContainer.innerHTML = '<p class="text-center text-light mt-lg">No pending reviews. Great job!</p>';
        } else {
            pendingReviews.forEach(review => {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'review-card';
                reviewCard.innerHTML = `
                    <div class="review-header">
                        <div class="vendor-info">
                            <h3>${review.product}</h3>
                            <p>from ${review.vendor} • Ordered on ${review.orderDate}</p>
                        </div>
                        <div class="review-status">
                            <span class="status-badge">Pending Review</span>
                        </div>
                    </div>
                    <form class="review-form">
                        <div class="rating-input">
                            <label>Your Rating:</label>
                            <div class="stars">
                                <i class="far fa-star" data-value="1"></i>
                                <i class="far fa-star" data-value="2"></i>
                                <i class="far fa-star" data-value="3"></i>
                                <i class="far fa-star" data-value="4"></i>
                                <i class="far fa-star" data-value="5"></i>
                            </div>
                            <input type="hidden" name="rating" value="">
                        </div>
                        <div class="form-group">
                            <label for="comment">Your Review:</label>
                            <textarea name="comment" placeholder="Write your review here..."></textarea>
                        </div>
                        <button type="submit" class="submit-review-button">Submit Review</button>
                    </form>
                `;
                
                pendingReviewsContainer.appendChild(reviewCard);
            });
        }
    }
    
    // Populate completed reviews
    const completedReviewsContainer = document.getElementById('completed-reviews');
    if(completedReviewsContainer) {
        completedReviewsContainer.innerHTML = ''; // Clear placeholder
        
        if(completedReviews.length === 0) {
            completedReviewsContainer.innerHTML = '<p class="text-center text-light mt-lg">You haven\'t submitted any reviews yet.</p>';
        } else {
            completedReviews.forEach(review => {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'review-card';
                
                // Create stars HTML
                let starsHtml = '<div class="stars">';
                for(let i = 1; i <= 5; i++) {
                    if(i <= review.rating) {
                        starsHtml += '<i class="fas fa-star"></i>';
                    } else {
                        starsHtml += '<i class="far fa-star"></i>';
                    }
                }
                starsHtml += '</div>';
                
                reviewCard.innerHTML = `
                    <div class="review-header">
                        <div class="vendor-info">
                            <h3>${review.product}</h3>
                            <p>from ${review.vendor} • Ordered on ${review.orderDate}</p>
                        </div>
                        <div class="review-status">
                            <span class="status-badge">Reviewed on ${review.reviewDate}</span>
                        </div>
                    </div>
                    <div class="rating-display">
                        <label>Your Rating:</label>
                        ${starsHtml}
                    </div>
                    <div class="review-comment">
                        <p>${review.comment}</p>
                    </div>
                `;
                
                completedReviewsContainer.appendChild(reviewCard);
            });
        }
    }
}