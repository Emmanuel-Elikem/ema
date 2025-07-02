// vendor-dashboard-api.js
console.log("VD-API: vendor-dashboard-api.js script loading..."); // Log that the script starts loading

const VENDOR_API_BASE_URL = 'https://ema-campusshop-backend.onrender.com/api'; // Your Django API base URL

function getAuthHeadersVendor() {
    const token = localStorage.getItem('authToken'); // Assuming 'authToken' stores the ACCESS token for JWT
    if (!token) {
        console.warn("VD-API: getAuthHeadersVendor - No auth token found in localStorage. Redirecting to login.");
        // It's often better to let the calling function decide to redirect,
        // but this can stay if it's the desired immediate behavior.
        window.location.href = 'singup.html'; // Adjust to your main login/signup page
        return null; // Indicate failure
    }
    // console.log("VD-API: getAuthHeadersVendor - Using token:", token); // Uncomment for debugging token value
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json', // Good practice to include Accept header
        // CRITICAL: Changed to 'Bearer' for JWT. If using DRF TokenAuthentication, change back to 'Token'.
        'Authorization': `Token ${token}`
    };
}

// Fetch the current vendor's profile details
async function fetchVendorProfile() {
    console.log("VD-API: fetchVendorProfile - Attempting to fetch...");
    const headers = getAuthHeadersVendor();
    if (!headers) {
        console.error("VD-API: fetchVendorProfile - Aborted due to missing auth headers.");
        return null; // Stop if no auth headers
    }

    try {
        const response = await fetch(`${VENDOR_API_BASE_URL}/profile/`, { method: 'GET', headers: headers });
        console.log(`VD-API: fetchVendorProfile - Response Status: ${response.status}`);

        if (response.status === 401 || response.status === 403) {
            console.warn(`VD-API: fetchVendorProfile - Unauthorized (401) or Forbidden (403). Status: ${response.status}. Removing token and redirecting.`);
            localStorage.removeItem('authToken');
            window.location.href = 'singup.html';
            return null;
        }
        if (!response.ok) {
            const errorText = await response.text(); // Get raw error text for debugging
            console.error(`VD-API: fetchVendorProfile - API Error. Status: ${response.status}. Body: ${errorText}`);
            throw new Error(`API Error ${response.status}: ${response.statusText}. Details: ${errorText.substring(0, 200)}`);
        }
        const data = await response.json();
        console.log("VD-API: fetchVendorProfile - Success. Data received:", data);
        return data;
    } catch (error) {
        console.error("VD-API: fetchVendorProfile - Network or other error:", error.message);
        return null;
    }
}

// Fetch products listed by the current vendor
async function fetchMyProductsApi() {
    console.log("VD-API: fetchMyProductsApi - Attempting to fetch...");
    const headers = getAuthHeadersVendor();
    if (!headers) {
        console.error("VD-API: fetchMyProductsApi - Aborted due to missing auth headers.");
        return []; // Return empty array as per original logic
    }

    try {
        const response = await fetch(`${VENDOR_API_BASE_URL}/my-products/`, { method: 'GET', headers: headers });
        console.log(`VD-API: fetchMyProductsApi - Response Status: ${response.status}`);

        if (response.status === 401 || response.status === 403) {
            console.warn(`VD-API: fetchMyProductsApi - Unauthorized (401) or Forbidden (403). Status: ${response.status}. Removing token and redirecting.`);
            localStorage.removeItem('authToken');
            window.location.href = 'singup.html';
            return []; // Return empty array
        }
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`VD-API: fetchMyProductsApi - API Error. Status: ${response.status}. Body: ${errorText}`);
            throw new Error(`API Error ${response.status}: ${response.statusText}. Details: ${errorText.substring(0, 200)}`);
        }
        const products = await response.json();
        console.log("VD-API: fetchMyProductsApi - Success. Products received:", products);
        return products;
    } catch (error) {
        console.error("VD-API: fetchMyProductsApi - Network or other error:", error.message);
        return []; // Return empty array on error
    }
}

// Update product status (is_active)
async function updateProductStatusApi(productId, isActive) {
    console.log(`VD-API: updateProductStatusApi - Updating product ${productId} status to ${isActive}`);
    const headers = getAuthHeadersVendor();
    if (!headers) {
        console.error("VD-API: updateProductStatusApi - Aborted due to missing auth headers.");
        return { success: false, message: "Not authenticated." };
    }

    try {
        const response = await fetch(`${VENDOR_API_BASE_URL}/products/${productId}/`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify({ is_active: isActive })
        });
        console.log(`VD-API: updateProductStatusApi - Response Status: ${response.status}`);

        // For PATCH, a 200 OK with the updated object is common.
        if (response.ok) {
            const updatedProduct = await response.json();
            console.log("VD-API: updateProductStatusApi - Success. Product status updated:", updatedProduct);
            return { success: true, product: updatedProduct };
        } else {
            const errorData = await response.json().catch(() => ({ detail: `Request failed with status ${response.status}. No JSON body.` }));
            console.error("VD-API: updateProductStatusApi - Error updating status. Response:", errorData);
            throw new Error(errorData.detail || `Failed to update status: ${response.statusText}`);
        }
    } catch (error) {
        console.error("VD-API: updateProductStatusApi - Network or other error:", error.message);
        return { success: false, message: error.message };
    }
}

// Update vendor profile settings
async function updateUserProfileApiVendor(profileDataToUpdate) {
    console.log("VD-API: updateUserProfileApiVendor - Updating with data:", profileDataToUpdate);
    const headers = getAuthHeadersVendor();
    if (!headers) {
        console.error("VD-API: updateUserProfileApiVendor - Aborted due to missing auth headers.");
        return { success: false, message: "Not authenticated." };
    }

    try {
        const response = await fetch(`${VENDOR_API_BASE_URL}/profile/`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(profileDataToUpdate)
        });
        console.log(`VD-API: updateUserProfileApiVendor - Response Status: ${response.status}`);
        const responseData = await response.json(); // Try to parse JSON regardless of status for error details

        if (response.ok) {
            console.log("VD-API: updateUserProfileApiVendor - Success. Profile updated:", responseData);
            return { success: true, data: responseData };
        } else {
            let errorDetail = `API Error (${response.status})`;
            if (responseData && typeof responseData === 'object') {
                errorDetail = Object.entries(responseData)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join('; ');
            } else if (typeof responseData === 'string') { // Handle plain text error response
                errorDetail = responseData;
            }
            console.error("VD-API: updateUserProfileApiVendor - Error updating profile. Details:", errorDetail);
            throw new Error(errorDetail);
        }
    } catch (error) {
        console.error("VD-API: updateUserProfileApiVendor - Network or other error:", error.message);
        // Ensure the message passed back is a string.
        return { success: false, message: String(error.message || "Profile update failed due to an unexpected error.") };
    }
}

// Delete a product
async function deleteProductApi(productId) {
    console.log(`VD-API: deleteProductApi - Deleting product ${productId}`);
    const headers = getAuthHeadersVendor();
    if (!headers) {
        console.error("VD-API: deleteProductApi - Aborted due to missing auth headers.");
        return { success: false, message: "Not authenticated." };
    }

    try {
        const response = await fetch(`${VENDOR_API_BASE_URL}/products/${productId}/`, {
            method: 'DELETE',
            headers: headers
        });
        console.log(`VD-API: deleteProductApi - Response Status: ${response.status}`);

        if (response.status === 204) { // No Content for successful DELETE
            console.log("VD-API: deleteProductApi - Success. Product deleted.");
            return { success: true };
        } else if (response.ok) { // Should ideally be 204, but handle other 2xx just in case
             console.log("VD-API: deleteProductApi - Success (unexpected 2xx). Product deleted.");
            return { success: true };
        }
        else {
            // Try to get error details if not a 204
            const errorData = await response.json().catch(() => ({ detail: `Request failed with status ${response.status}. No JSON body.` }));
            console.error("VD-API: deleteProductApi - Error deleting product. Response:", errorData);
            throw new Error(errorData.detail || `Failed to delete product: ${response.statusText}`);
        }
    } catch (error) {
        console.error("VD-API: deleteProductApi - Network or other error:", error.message);
        return { success: false, message: error.message };
    }
}


// Fetch all orders for the current vendor
async function fetchMyOrdersApi() {
    console.log("VD-API: fetchMyOrdersApi - Attempting to fetch...");
    const headers = getAuthHeadersVendor();
    if (!headers) {
        console.error("VD-API: fetchMyOrdersApi - Aborted due to missing auth headers.");
        return [];
    }

    try {
        const response = await fetch(`${VENDOR_API_BASE_URL}/my-orders/`, { headers });
        console.log(`VD-API: fetchMyOrdersApi - Response Status: ${response.status}`);
        if (!response.ok) {
            throw new Error(`API Error ${response.status}`);
        }
        const orders = await response.json();
        console.log("VD-API: fetchMyOrdersApi - Success. Orders received:", orders);
        return orders;
    } catch (error) {
        console.error("VD-API: fetchMyOrdersApi - Network or other error:", error);
        return []; // Return empty array on error
    }
}

console.log("VD-API: vendor-dashboard-api.js script fully loaded and functions defined."); // Log that the script and functions are ready