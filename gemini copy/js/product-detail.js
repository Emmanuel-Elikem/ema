// product-detail.js

// --- API Configuration ---
const API_BASE_URL_PRODUCTS_DETAIL = 'https://ema-campusshop-backend.onrender.com/api/products';

// --- Helper Functions ---
function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function addToRecentlyViewed(product) {
    if (!product || !product.id) {
        console.warn("Cannot add to recently viewed: invalid product data", product);
        return;
    }
    console.log("Attempting to add to recently viewed:", product.name);

    let recentlyViewed = [];
    try {
        const storedItems = localStorage.getItem('recentlyViewedItems');
        if (storedItems) {
            recentlyViewed = JSON.parse(storedItems);
        }
    } catch (e) {
        console.error("Error parsing recentlyViewedItems from localStorage", e);
        recentlyViewed = []; // Reset if parsing fails
    }
    
    // Remove product if it already exists to move it to the front
    recentlyViewed = recentlyViewed.filter(item => item.id !== product.id);

    // Add new product to the beginning (most recent)
    recentlyViewed.unshift({
        id: product.id,
        name: product.name,
        image: product.image, // Main product image
        price: product.price
    });

    // Keep only the latest (e.g., 5 or 6) items
    const maxItems = 6;
    recentlyViewed = recentlyViewed.slice(0, maxItems);

    try {
        localStorage.setItem('recentlyViewedItems', JSON.stringify(recentlyViewed));
        console.log(`"${product.name}" added/updated in recently viewed. Total: ${recentlyViewed.length}`);
    } catch (e) {
        console.error("Error saving recentlyViewedItems to localStorage", e);
    }
}

// --- Main Fetch Function ---
async function fetchProductDetailsById(productId) {
    if (!productId) {
        console.error("Product ID is missing for fetchProductDetailsById.");
        return null; // Or throw error
    }
    console.log(`API: Fetching details for product ID: ${productId}`);
    
    try {
        const response = await fetch(`${API_BASE_URL_PRODUCTS_DETAIL}/${productId}/`);

        if (!response.ok) {
            let errorDetail = `HTTP error! Status: ${response.status} - ${response.statusText}`;
            try {
                const errorData = await response.clone().json(); // Clone to read body safely
                errorDetail = errorData.detail || JSON.stringify(errorData);
            } catch (e) { /* Ignore if response body is not JSON */ }
            throw new Error(errorDetail);
        }

        const productData = await response.json();
        console.log("API: Product details received:", productData);

        if (productData) {
            addToRecentlyViewed(productData); // Add to recently viewed items
        }
        return productData;

    } catch (error) {
        console.error("API: Failed to fetch product details:", error);
        throw error; // Re-throw to be caught by the caller
    }
}