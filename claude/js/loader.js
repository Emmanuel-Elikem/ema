// profile.js - Profile data management

class ProfileManager {
    constructor() {
        this.profileData = {
            username: 'JohnDoe123',
            whatsapp: '+233 50 123 4567',
            campus: 'University of Cape Coast',
            email: 'john.doe@student.ucc.edu.gh',
            location: 'Science Hostel, Block A',
            // Password is never stored in frontend in real app
            password: '••••••••'
        };
    }
    
    /**
     * Initializes the profile manager
     */
    init() {
        // Set up editable fields
        this.setupEditableFields();
        
        // Set up avatar change
        this.setupAvatarChange();
    }
    
    /**
     * Sets up editable fields in the profile
     */
    setupEditableFields() {
        const editableFields = document.querySelectorAll('.editable-field');
        
        editableFields.forEach(field => {
            const editButton = field.querySelector('.edit-button');
            const fieldValue = field.querySelector('.field-value');
            const editInput = field.querySelector('.edit-input');
            const saveButton = field.querySelector('.save-button');
            const cancelButton = field.querySelector('.cancel-button');
            const inputField = editInput.querySelector('input, select');
            
            // When edit button is clicked
            editButton.addEventListener('click', () => {
                // Hide value display, show edit input
                fieldValue.style.display = 'none';
                editInput.classList.remove('hidden');
                
                // Focus the input
                if (inputField) {
                    inputField.focus();
                    
                    // For password fields, we need special handling
                    if (inputField.id === 'current-password') {
                        // Clear the password fields
                        document.getElementById('current-password').value = '';
                        document.getElementById('new-password').value = '';
                        document.getElementById('confirm-password').value = '';
                    }
                }
            });
            
            // When save button is clicked
            saveButton.addEventListener('click', () => {
                // Special handling for password field
                if (inputField && inputField.id === 'current-password') {
                    this.handlePasswordUpdate(field);
                    return;
                }
                
                // Get the field name and new value
                const fieldName = inputField.id;
                const newValue = inputField.value.trim();
                
                // Validate the input
                if (!this.validateField(fieldName, newValue)) {
                    return;
                }
                
                // Update the displayed value
                fieldValue.textContent = newValue;
                
                // Update stored data
                this.profileData[fieldName] = newValue;
                
                // Simulate saving to server
                this.saveProfileData(fieldName, newValue);
                
                // Hide edit input, show value display
                editInput.classList.add('hidden');
                fieldValue.style.display = '';
            });
            
            // When cancel button is clicked
            cancelButton.addEventListener('click', () => {
                // Reset input to original value
                if (inputField && inputField.id !== 'current-password') {
                    inputField.value = this.profileData[inputField.id];
                }
                
                // Hide edit input, show value display
                editInput.classList.add('hidden');
                fieldValue.style.display = '';
            });
            
            // Handle Enter key in input fields
            if (inputField && inputField.id !== 'current-password') {
                inputField.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        saveButton.click();
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        cancelButton.click();
                    }
                });
            }
        });
    }
    
    /**
     * Sets up avatar change functionality
     */
    setupAvatarChange() {
        const changeAvatarButton = document.getElementById('change-avatar');
        const profileInitials = document.getElementById('profile-initials');
        const headerInitials = document.getElementById('user-initials');
        
        changeAvatarButton.addEventListener('click', () => {
            // In a real app, this would open a file picker
            // For this demo, we'll just change the initials color
            
            // Generate a random color (but not too light)
            const hue = Math.floor(Math.random() * 360);
            const color = `hsl(${hue}, 70%, 45%)`;
            
            // Apply the new color
            document.querySelector('.avatar-placeholder.large').style.backgroundColor = color;
            document.querySelector('.avatar-placeholder').style.backgroundColor = color;
            
            // Show success message
            this.showNotification('Avatar updated successfully');
        });
    }
    
    /**
     * Validates a field value
     * @param {string} fieldName - Name of the field
     * @param {string} value - Value to validate
     * @returns {boolean} - Whether the value is valid
     */
    validateField(fieldName, value) {
        if (value === '') {
            this.showNotification('Field cannot be empty', 'error');
            return false;
        }
        
        switch (fieldName) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    this.showNotification('Please enter a valid email address', 'error');
                    return false;
                }
                break;
                
            case 'whatsapp':
                const phoneRegex = /^\+?\d{1,4}?\s?\d{1,4}\s?\d{1,4}\s?\d{1,4}$/;
                if (!phoneRegex.test(value)) {
                    this.showNotification('Please enter a valid phone number', 'error');
                    return false;
                }
                break;
        }
        
        return true;
    }
    
    /**
     * Handles password update
     * @param {HTMLElement} field - Field element
     */
    handlePasswordUpdate(field) {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const fieldValue = field.querySelector('.field-value');
        const editInput = field.querySelector('.edit-input');
        
        // Check if current password is filled
        if (!currentPassword) {
            this.showNotification('Please enter your current password', 'error');
            return;
        }
        
        // Check if new password is filled
        if (!newPassword) {
            this.showNotification('Please enter a new password', 'error');
            return;
        }
        
        // Check if passwords match
        if (newPassword !== confirmPassword) {
            this.showNotification('New passwords do not match', 'error');
            return;
        }
        
        // Check password strength
        if (newPassword.length < 8) {
            this.showNotification('Password should be at least 8 characters', 'error');
            return;
        }
        
        // In a real app, we would validate against the current password
        // and update the password on the server
        
        // For demo purposes, we'll just show success
        this.showNotification('Password updated successfully');
        
        // Reset fields and close edit mode
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        editInput.classList.add('hidden');
        fieldValue.style.display = '';
    }
    
    /**
     * Simulates saving profile data to server
     * @param {string} field - Field name
     * @param {string} value - New value
     */
    saveProfileData(field, value) {
        // In a real app, this would make an API call
        
        // For demo purposes, we'll update the greeting if username changes
        if (field === 'username') {
            const firstName = value.replace(/[0-9]/g, '').replace(/([A-Z])/g, ' $1').trim();
            document.getElementById('greeting-name').textContent = firstName;
        }
        
        // Show success notification
        this.showNotification(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    }
    
    /**
     * Shows a notification message
     * @param {string} message - Message to display
     * @param {string} type - Type of notification (success/error)
     */
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `toast-notification ${type}`;
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
    const profileManager = new ProfileManager();
    profileManager.init();
});