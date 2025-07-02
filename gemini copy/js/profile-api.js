// profile-api.js - Handles API calls for User Profile

const API_BASE_URL_PROFILE = 'https://ema-campusshop-backend.onrender.com/api'; // Your backend API base URL

// --- Helper Function for Auth Headers ---
function getAuthHeadersProfile() {
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error("PROFILE API: No auth token found. Redirecting to login.");
        window.location.href = '/login.html'; // Redirect if no token (Adjust path if needed)
        return null; // Return null to stop further execution
    }
    return {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
    };
}

// --- Function to Fetch User Profile ---
async function fetchUserProfile() {
    console.log("API: Fetching user profile...");
    const headers = getAuthHeadersProfile();
    if (!headers) return null; // Stop if no token/redirected

    const profileApiUrl = `${API_BASE_URL_PROFILE}/profile/`;

    try {
        const response = await fetch(profileApiUrl, { headers: headers });

        if (response.status === 401) {
            localStorage.removeItem('authToken');
            console.error("API: Authentication token invalid/expired during profile fetch.");
            window.location.href = '/login.html'; // Redirect to login
            return null;
        }
        if (!response.ok) {
             let errorDetail = `HTTP error! Status: ${response.status} - ${response.statusText}`;
             try { const errorData = await response.json(); errorDetail = errorData.detail || JSON.stringify(errorData); } catch (e) {}
            throw new Error(errorDetail);
        }

        const profileData = await response.json();
        console.log("API: Profile data received:", profileData);
        return profileData; // Return the fetched data

    } catch (error) {
        console.error("API: Failed to load profile:", error);
        throw error; // Re-throw the error to be caught by the caller
    }
}

// profile-api.js
// ... (keep API_BASE_URL_PROFILE and getAuthHeadersProfile function as they are) ...
// ... (keep fetchUserProfile function as it is) ...

// --- Function to Update User Profile (Placeholder - Simulates API call) ---
// profile-api.js

// ... (API_BASE_URL_PROFILE and getAuthHeadersProfile should be above this) ...

async function updateUserProfileApi(dataToUpdate) { // dataToUpdate should be an object like { whatsapp: '...', campus: '...' }
    console.log("API: Attempting to update user profile with:", dataToUpdate); // For debugging
    const headers = getAuthHeadersProfile();
    if (!headers) {
        // getAuthHeadersProfile handles redirect if no token
        return { success: false, message: "Not authenticated. Please log in again.", data: null };
    }

    const profileApiUrl = `${API_BASE_URL_PROFILE}/profile/`; // This targets UserProfileView

    try {
        const response = await fetch(profileApiUrl, {
            method: 'PATCH', // Use PATCH to send only the fields to be updated
            headers: headers,
            body: JSON.stringify(dataToUpdate) // Send only whatsapp and/or campus
        });

        // Try to parse JSON regardless of status for more detailed error messages
        let responseData;
        try {
            responseData = await response.json();
        } catch (e) {
            // If response is not JSON (e.g., empty response on 204 or HTML error page)
            responseData = { detail: response.statusText }; // Use statusText as a fallback detail
        }

        if (response.status === 401) {
            localStorage.removeItem('authToken');
            console.error("API: Auth token invalid during profile update. Redirecting to login.");
            window.location.href = '/login.html'; // Adjust path if needed
            return { success: false, message: "Authentication failed. Please log in again.", data: responseData };
        }

        if (!response.ok) { // Handles 400 (validation errors from serializer) and other server errors
            let errorDetail = `API Error! Status: ${response.status}`;
            if (responseData && typeof responseData === 'object') {
                errorDetail = Object.entries(responseData)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join('; ');
            } else if (responseData && responseData.detail) {
                errorDetail = responseData.detail;
            }
            throw new Error(errorDetail);
        }

        console.log("API: Profile update successful:", responseData);
        return { success: true, data: responseData }; // Backend returns updated UserProfile data

    } catch (error) {
        console.error("API: Failed to update profile:", error);
        // Ensure error.message is a string
        return { success: false, message: String(error.message || "Update failed due to network or unknown error."), data: null };
    }
}

async function changePasswordApi(currentPassword, newPassword1, newPassword2) {
    console.log("API: Attempting password change...");
    const headers = getAuthHeadersProfile();
    if (!headers) return { success: false, message: "Not authenticated", data: null };

    const passwordChangeUrl = `${API_BASE_URL_PROFILE}/auth/password/change/`;

    const payload = { // Define payload explicitly
        old_password: currentPassword,
        new_password1: newPassword1,
        new_password2: newPassword2
    };

    // ---- ADD THIS LOG ----
    console.log("API: Sending this payload to password change:", JSON.stringify(payload));
    // ---- END ADD ----

    try {
        const response = await fetch(passwordChangeUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(payload) // Use the defined payload object
        });

        const responseData = await response.json(); // Read response data

        if (response.status === 401) {
            localStorage.removeItem('authToken');
            console.error("API: Auth token invalid during password change.");
            window.location.href = '/login.html';
            return { success: false, message: "Authentication failed", data: responseData };
        }
         if (!response.ok) { // Handle 400 Bad Request (validation errors) or other errors
             let errorDetail = `HTTP error! Status: ${response.status} - ${response.statusText}`;
             // Try to parse specific errors from dj-rest-auth/allauth
             try {
                 errorDetail = responseData.detail || JSON.stringify(responseData.old_password || responseData.new_password1 || responseData.new_password2 || responseData);
             } catch(e) {}
            throw new Error(errorDetail);
        }

        console.log("API: Password change successful:", responseData);
        return { success: true, data: responseData };

    } catch (error) {
        console.error("API: Failed to change password:", error);
         return { success: false, message: error.message || "Password change failed.", data: null };
    }
}

async function becomeVendorApi(businessName) {
    console.log("API: Attempting to become a vendor...");
    const headers = getAuthHeadersProfile();
    if (!headers) {
        return { success: false, message: "Not authenticated. Please log in." };
    }

    const becomeVendorUrl = `${API_BASE_URL_PROFILE}/profile/become-vendor/`; // Matches backend URL

    try {
        const response = await fetch(becomeVendorUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ business_name: businessName }) // Send business_name
            // No body needed for this request, just the action of POSTing
        });

        const responseData = await response.json(); // Try to parse JSON for messages

        if (response.status === 401) {
            localStorage.removeItem('authToken');
            console.error("API: Auth token invalid during 'become vendor' request.");
            window.location.href = '/login.html'; // Adjust path
            return { success: false, message: "Authentication failed. Please log in again." };
        }

        if (!response.ok) {
             let errorDetail = `API Error! Status: ${response.status}`;
             if (responseData && responseData.message) {
                 errorDetail = responseData.message;
             } else if (responseData && responseData.detail) {
                 errorDetail = responseData.detail;
             } else if (responseData && typeof responseData === 'object') {
                 errorDetail = Object.values(responseData).flat().join(' ');
             }
            throw new Error(errorDetail);
        }

        console.log("API: 'Become Vendor' request successful:", responseData);
        return { success: true, data: responseData }; // responseData might include updated profile

    } catch (error) {
        console.error("API: Failed to become vendor:", error);
        return { success: false, message: String(error.message || "Request failed due to network or unknown error.") };
    }
}

console.log("profile-api.js loaded");