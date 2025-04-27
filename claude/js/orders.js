// orders.js - Order history and management for Campus Marketplace Profile

class OrderManager {
    constructor() {
        this.orders = [];
        this.filterState = 'all';
    }
    
    /**
     * Initializes the order manager
     */
    init() {
        // Get references to DOM elements
        this.ordersContainer = document.querySelector('.orders-container');
        this.filterButtons = document.querySelectorAll('.filter-button');
        
        // Set up event listeners
        this.setupFilterListeners();
        this.setupOrderCardListeners();
        
        // Load order data
        this.loadOrders();
    }
    
    /**
     * Sets up event listeners for order filtering
     */
    setupFilterListeners() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active state on buttons
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Apply filter
                this.filterState = button.dataset.filter;
                this.applyFilter();
            });
        });
    }
    
    /**
     * Sets up event listeners for order cards
     */
    setupOrderCardListeners() {
        // View details button
        document.querySelectorAll('.view-details-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const orderCard = e.target.closest('.order-card');
                const detailsSection = orderCard.querySelector('.order-details');
                
                // Toggle details visibility with animation
                if (detailsSection.classList.contains('hidden')) {
                    detailsSection.classList.remove('hidden');
                    detailsSection.style.maxHeight = '0';
                    setTimeout(() => {
                        detailsSection.style.maxHeight = detailsSection.scrollHeight + 'px';
                    }, 10);
                } else {
                    detailsSection.style.maxHeight = '0';
                    setTimeout(() => {
                        detailsSection.classList.add('hidden');
                    }, 300); // Match the CSS transition duration
                }
            });
        });
        
        // Cancel order button
        document.querySelectorAll('.cancel-order-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const orderCard = e.target.closest('.order-card');
                const orderId = orderCard.querySelector('.order-id .value').textContent;
                
                if (confirm(`Are you sure you want to cancel order ${orderId}?`)) {
                    this.cancelOrder(orderCard);
                }
            });
        });
        
        // Write review button
        document.querySelectorAll('.write-review-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const orderCard = e.target.closest('.order-card');
                const orderId = orderCard.querySelector('.order-id .value').textContent;
                const vendorName = orderCard.querySelector('.vendor-info .value').textContent;
                
                // Navigate to reviews tab and open the pending review
                document.querySelector('.nav-card[data-target="reviews"]').click();
                document.querySelector('.tab-button[data-tab="pending-reviews"]').click();
                
                // Flash the review card for this order (if it exists)
                const reviewCard = Array.from(document.querySelectorAll('.review-card')).find(card => 
                    card.textContent.includes(orderId.replace('#', ''))
                );
                
                if (reviewCard) {
                    reviewCard.classList.add('highlight');
                    setTimeout(() => {
                        reviewCard.classList.remove('highlight');
                    }, 2000);
                    
                    // Scroll to the review card
                    reviewCard.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Reorder button
        document.querySelectorAll('.reorder-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const orderCard = e.target.closest('.order-card');
                const items = Array.from(orderCard.querySelectorAll('.items-list .item'))
                    .filter(item => !item.textContent.includes('Delivery Fee'));
                
                // Add items to cart
                this.addItemsToCart(items);
            });
        });
    }
    
    /**
     * Loads order data (would fetch from API in a real application)
     */
    loadOrders() {
        // In a real application, this would fetch from an API
        // For now, we're using the data that's already in the HTML
        this.orders = Array.from(document.querySelectorAll('.order-card'));
    }
    
    /**
     * Applies the current filter to order cards
     */
    applyFilter() {
        this.orders.forEach(order => {
            const status = order.dataset.status;
            
            if (this.filterState === 'all' || status === this.filterState) {
                order.style.display = 'block';
                
                // Animate the card in
                order.style.opacity = '0';
                order.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    order.style.opacity = '1';
                    order.style.transform = 'translateY(0)';
                }, 10);
            } else {
                order.style.display = 'none';
            }
        });
    }
    
    /**
     * Cancels an order
     * @param {HTMLElement} orderCard - The order card element
     */
    cancelOrder(orderCard) {
        // Update status visually
        const statusElem = orderCard.querySelector('.order-status');
        statusElem.className = 'order-status cancelled';
        statusElem.innerHTML = '<span class="status-dot"></span><span class="status-text">Cancelled</span>';
        
        // Update data attribute for filtering
        orderCard.dataset.status = 'cancelled';
        
        // Replace cancel button with reorder button
        const cancelButton = orderCard.querySelector('.cancel-order-button');
        const reorderButton = document.createElement('button');
        reorderButton.className = 'reorder-button';
        reorderButton.textContent = 'Order Again';
        cancelButton.parentNode.replaceChild(reorderButton, cancelButton);
        
        // Add event listener to new reorder button
        reorderButton.addEventListener('click', (e) => {
            const items = Array.from(orderCard.querySelectorAll('.items-list .item'))
                .filter(item => !item.textContent.includes('Delivery Fee'));
            this.addItemsToCart(items);
        });
        
        // Add cancellation info to details section
        const detailsSection = orderCard.querySelector('.order-details');
        const deliveryInfo = orderCard.querySelector('.delivery-info');
        
        if (deliveryInfo) {
            const cancellationInfo = document.createElement('div');
            cancellationInfo.className = 'cancellation-info';
            cancellationInfo.innerHTML = `
                <h4>Cancellation Information</h4>
                <p><strong>Cancelled On:</strong> ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}</p>
                <p><strong>Reason:</strong> Customer cancelled</p>
            `;
            
            deliveryInfo.parentNode.replaceChild(cancellationInfo, deliveryInfo);
        }
        
        // Show success message
        this.showNotification('Order cancelled successfully');
    }
    
    /**
     * Adds items to cart
     * @param {Array} items - Array of item elements
     */
    addItemsToCart(items) {
        // In a real application, this would add to cart via API
        // For demo, we'll just show a notification
        const itemNames = items.map(item => item.querySelector('.item-name').textContent);
        const cartPanel = document.getElementById('cart-panel');
        
        // Show success message
        this.showNotification(`${itemNames.join(', ')} added to cart`);
        
        // Flash the cart icon
        const cartIcon = document.getElementById('cart-toggle');
        cartIcon.classList.add('flash');
        setTimeout(() => {
            cartIcon.classList.remove('flash');
        }, 1000);
        
        // Open cart panel
        setTimeout(() => {
            if (cartPanel.classList.contains('hidden')) {
                document.getElementById('cart-toggle').click();
            }
        }, 1200);
    }
    
    /**
     * Shows a notification message
     * @param {string} message - Message to display
     */
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'toast-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const orderManager = new OrderManager();
    orderManager.init();
});