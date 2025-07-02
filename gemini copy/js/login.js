// login.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('login-username'); // Use 'login-email' if using email
    const passwordInput = document.getElementById('login-password');
    const errorElement = document.getElementById('login-error');
    const loginApiUrl = 'https://ema-campusshop-backend.onrender.com/api/auth/login/'; // Your backend login URL

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Stop default page reload on form submission
            errorElement.textContent = ''; // Clear previous errors

            const username = usernameInput.value.trim();
            const password = passwordInput.value;

            // Basic validation
            if (!username || !password) {
                errorElement.textContent = 'Please enter both username/email and password.';
                return;
            }

            console.log(`Attempting login for user: ${username}`);

            try {
                const response = await fetch(loginApiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        // No 'Authorization' header needed for login itself
                    },
                    // Send username (or email) and password as JSON
                    // Adjust key if using email: 'email': username
                    body: JSON.stringify({ username: username, password: password })
                });

                const data = await response.json();

                if (response.ok) { // Login successful (e.g., status 200 OK)
                    console.log('Login successful:', data);
                    if (data.key) {
                        // --- Store the token ---
                        // localStorage persists even after browser closes
                        localStorage.setItem('authToken', data.key);
                        // sessionStorage clears when tab/browser closes
                        // sessionStorage.setItem('authToken', data.key);

                        // --- Redirect to dashboard or browse page ---
                        // Adjust the redirect URL as needed
                        window.location.href = '/browse.html'; // Or '/dashboard.html' etc.
                    } else {
                        console.error('Login response missing token key:', data);
                        errorElement.textContent = 'Login failed. Token not received.';
                    }
                } else { // Login failed (e.g., status 400 Bad Request for invalid credentials)
                    console.error('Login failed:', data);
                    // Display error messages from the backend
                    let errorMessage = 'Login failed. Please check credentials.';
                    if (data.non_field_errors) { // Common error from dj-rest-auth
                        errorMessage = data.non_field_errors.join(' ');
                    } else if (typeof data === 'object' && data !== null) {
                        // Try to format other errors if non_field_errors isn't present
                         errorMessage = Object.entries(data)
                            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                            .join('; ');
                    }
                    errorElement.textContent = errorMessage;
                }
            } catch (error) {
                // Handle network errors (e.g., backend server down)
                console.error('Network or other error during login:', error);
                errorElement.textContent = 'Could not connect to server. Please try again later.';
            }
        });
    } else {
        console.error('Login form not found!');
    }
});