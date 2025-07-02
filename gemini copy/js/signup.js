// signup.js

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const usernameInput = document.getElementById('signup-username');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const password2Input = document.getElementById('signup-password2');
    const errorElement = document.getElementById('signup-error');
    const registrationApiUrl = 'https://ema-campusshop-backend.onrender.com/api/auth/registration/'; // Your backend registration URL

    if (signupForm) {
        signupForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            errorElement.textContent = ''; // Clear previous errors

            const username = usernameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const password2 = password2Input.value;

            // --- Client-side validation ---
            if (!username || !email || !password || !password2) {
                errorElement.textContent = 'Please fill in all fields.';
                return;
            }
            if (password !== password2) {
                errorElement.textContent = 'Passwords do not match.';
                return;
            }
            // Add more checks? e.g., basic email format, password length?

            console.log(`Attempting registration for user: ${username}`);

            try {
                const response = await fetch(registrationApiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // dj-rest-auth registration expects these fields by default
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        password: password,
                        password2: password2
                    })
                });

                const data = await response.json();

                if (response.ok) { // Registration successful (e.g., status 201 Created or 200 OK)
                    console.log('Registration successful:', data);
                    // Inform user and redirect to login page
                    alert('Registration successful! Please check your email if verification is required, then log in.'); // Simple feedback
                    window.location.href = '/login.html'; // Redirect to login page

                } else { // Registration failed (e.g., status 400 Bad Request)
                    console.error('Registration failed:', data);
                    // Format and display errors from the backend
                    let errorMessage = 'Registration failed. Please correct the errors below.';
                    if (typeof data === 'object' && data !== null) {
                        errorMessage = Object.entries(data)
                            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
                            .join('\n'); // Join errors with newline for potentially better display
                    }
                    errorElement.textContent = errorMessage; // Display errors
                    // Alternatively, display errors next to specific fields if possible
                }
            } catch (error) {
                console.error('Network or other error during registration:', error);
                errorElement.textContent = 'Could not connect to server. Please try again later.';
            }
        });
    } else {
        console.error('Signup form not found!');
    }
});