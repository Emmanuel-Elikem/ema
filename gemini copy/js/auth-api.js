// auth-api.js - Handles API calls for Login, Signup, Password Reset

const API_AUTH_BASE_URL = 'https://ema-campusshop-backend.onrender.com/api/auth'; // Base URL for auth endpoints

// Function to handle Login API call
// The new "Smart Redirect" Login Handler
async function handleApiLogin(email, password) {
    console.log('API: Attempting login...');
    const loginApiUrl = `${API_AUTH_BASE_URL}/login/`;

    try {
        const loginResponse = await fetch(loginApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, password: password })
        });

        const loginData = await loginResponse.json();

        // Check if the login itself was successful and we got a token ('key')
        if (loginResponse.ok && loginData.key) {
            console.log('API: Login successful, token received.');
            const token = loginData.key;
            
            // 1. SAVE THE TOKEN IMMEDIATELY
            localStorage.setItem('authToken', token);

            // 2. NOW, USE THE NEW TOKEN TO FETCH THE USER'S PROFILE
            console.log('API: Token saved. Now fetching user profile to check vendor status...');
            const profileResponse = await fetch('https://ema-campusshop-backend.onrender.com/api/profile/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}` // Use the new token right away
                }
            });

            const profileData = await profileResponse.json();

            if (profileResponse.ok) {
                console.log('API: Profile fetched successfully.', profileData);
                // 3. CHECK IF THE USER IS A VENDOR AND REDIRECT ACCORDINGLY
                if (profileData.is_vendor) {
                    console.log('API: User is a VENDOR. Redirecting to vendor dashboard.');
                    if (typeof showPopup === 'function') {
                        showPopup('Login Successful', 'Welcome back, Vendor! Redirecting to your dashboard...');
                    }
                    setTimeout(() => {
                        window.location.href = 'vendor-dashboard.html'; // <-- REDIRECT TO VENDOR DASHBOARD
                    }, 1500);
                } else {
                    console.log('API: User is a REGULAR USER. Redirecting to index.');
                    if (typeof showPopup === 'function') {
                        showPopup('Login Successful', 'Welcome back! Redirecting...');
                    }
                    setTimeout(() => {
                        window.location.href = '/index.html'; // <-- REDIRECT TO BROWSE PAGE
                    }, 1500);
                }
            } else {
                // This case is rare, means login worked but profile fetch failed.
                // Default to standard redirect.
                console.error('API: Could not fetch profile after login. Defaulting to index redirect.');
                window.location.href = '/index.html';
            }
            
            return { success: true };

        } else {
            // This 'else' block handles the initial login failure
            console.error('API: Login failed:', loginData);
            let errorMessage = loginData.non_field_errors ? loginData.non_field_errors.join(' ') : 'Login failed. Please check your credentials.';
            if (typeof showPopup === 'function') {
                showPopup('Login Error', errorMessage);
            } else {
                alert(`Login Error: ${errorMessage}`);
            }
            return { success: false, message: errorMessage };
        }
    } catch (error) {
        console.error('API: Network or fetch error during login:', error);
        if (typeof showPopup === 'function') {
            showPopup('Login Error', 'Could not connect to server. Please try again later.');
        } else {
            alert('Login Error: Could not connect to server.');
        }
        return { success: false, message: 'Network error.' };
    }
}

// Function to handle Signup API call
async function handleApiSignup(username, email, password1, password2) {
    console.log('API: Attempting registration...');
    const registrationApiUrl = `${API_AUTH_BASE_URL}/registration/`;

    try {
        const response = await fetch(registrationApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                email: email,
                password1: password1,
                password2: password2
                // Note: University is not sent as the backend doesn't handle it yet
            })
        });

        const data = await response.json();

        if (response.ok || response.status === 201) { // Handle 201 Created or 200 OK
            console.log('API: Registration successful:', data);
             if (typeof showPopup === 'function') {
                 // Give slightly more informative message depending on email verification setting
                 let successMsg = "Registration successful! Please log in.";
                 if (data.detail?.includes("verification email")) { // Check if response mentions verification
                     successMsg = "Registration successful! Please check your email for verification, then log in.";
                 }
                 showPopup('Sign Up Successful', successMsg);
                 // Optionally trigger switch to login after popup closes or delay
                 // setTimeout(switchToLogin, 2000); // Assumes switchToLogin is globally accessible
             } else {
                 alert('Registration successful! Please log in.'); // Fallback
             }
            return { success: true };
        } else {
            console.error('API: Registration failed:', data);
            let errorMessage = 'Registration failed.';
            if (typeof data === 'object' && data !== null) {
                 errorMessage = Object.entries(data)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join('\n'); // Use newline for potentially better popup display
            }
             if (typeof showPopup === 'function') {
                 showPopup('Sign Up Error', errorMessage);
            } else {
                 alert(`Sign Up Error:\n${errorMessage}`); // Fallback
             }
            return { success: false, message: errorMessage };
        }
    } catch (error) {
        console.error('API: Network or fetch error during registration:', error);
         if (typeof showPopup === 'function') {
             showPopup('Sign Up Error', 'Could not connect to server. Please try again later.');
         } else {
             alert('Sign Up Error: Could not connect to server.'); // Fallback
         }
        return { success: false, message: 'Network error.' };
    }
}

// Function to handle Password Reset Request API call
async function handleApiPasswordReset(email) {
    console.log('API: Requesting password reset...');
    const resetApiUrl = `${API_AUTH_BASE_URL}/password/reset/`;

    try {
        const response = await fetch(resetApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        // dj-rest-auth usually returns 200 OK even if email doesn't exist (for security)
        if (response.ok) {
            console.log('API: Password reset request sent (or email not found):', data);
             let message = data.detail || 'If an account exists for this email, a password reset link has been sent.';
             if (typeof showPopup === 'function') {
                 showPopup('Password Reset Request', message);
                 // Optionally switch back to login after a delay
                // setTimeout(switchToLogin, 3000);
             } else {
                 alert(message); // Fallback
             }
            return { success: true };
        } else {
            // This might happen for validation errors (e.g., invalid email format)
            console.error('API: Password reset failed:', data);
             let errorMessage = 'Password reset request failed.';
            if (typeof data === 'object' && data !== null) {
                 errorMessage = Object.entries(data)
                    .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                    .join('\n');
            }
             if (typeof showPopup === 'function') {
                 showPopup('Reset Error', errorMessage);
            } else {
                 alert(`Reset Error:\n${errorMessage}`); // Fallback
             }
            return { success: false, message: errorMessage };
        }
    } catch (error) {
        console.error('API: Network or fetch error during password reset:', error);
         if (typeof showPopup === 'function') {
             showPopup('Reset Error', 'Could not connect to server. Please try again later.');
         } else {
             alert('Reset Error: Could not connect to server.'); // Fallback
         }
        return { success: false, message: 'Network error.' };
    }
}