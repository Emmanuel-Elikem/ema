// profile.js - Profile data management for Campus Marketplace Profile

class ProfileManager {
    constructor() {
        this.userData = null;
        this.isEditing = false;
        this.editingField = null;
        this.originalValues = {};
    }
    
    /**
     * Initializes profile manager
     */
    init() {
        // Attach event listeners
        this.attachEditListeners();
        this.attachAvatarListeners();
        this.attachPasswordListeners();
        
        // Load initial user data
        this.loadUserData();
    }
    
    /**
     * Loads user data from API (simulated)
     */
    loadUserData() {
        // Simulate API fetch with mock data
        return new Promise((resolve) => {
            setTimeout(() => {
                this.userData = {
                    id: 'USR12345',
                    name: 'John Doe',
                    username: 'johndoe',
                    email: 'john.doe@example.com',
                    whatsapp: '+1234567890',
                    campus: 'Main Campus',
                    location: 'Block A, Room 123',
                    profileImageUrl: null,
                    lastLogin: new Date(Date.now() - 86400000), // Yesterday
                    dateJoined: new Date(2024, 7, 15)
                };
                
                this.updateProfileUI();
                resolve(this.userData);
            }, 500);
        });
    }
    
    /**
     * Updates the profile UI with current user data
     */
    updateProfileUI() {
        if (!this.userData) return;
        
        // Update user greeting
        const userGreeting = document.querySelector('.user-greeting h2');
        if (userGreeting) {
            userGreeting.textContent = `Hello, ${this.userData.name}`;
        }
        
        // Format last login time
        const lastLogin = document.querySelector('.last-login');
        if (lastLogin) {
            lastLogin.textContent = `Last login: ${this.formatTimestamp(this.userData.lastLogin)}`;
        }
        
        // Update avatar placeholders
        const avatarPlaceholders = document.querySelectorAll('.avatar-placeholder');
        avatarPlaceholders.forEach(placeholder => {
            if (this.userData.profileImageUrl) {
                // If user has a profile image
                placeholder.innerHTML = `<img src="${this.userData.profileImageUrl}" alt="${this.userData.name}" />`;
            } else {
                // Use first letter of name as placeholder
                placeholder.textContent = this.userData.name.charAt(0).toUpperCase();
            }
        });
        
        // Update editable fields
        this.updateField('username', this.userData.username);
        this.updateField('email', this.userData.email);
        this.updateField('whatsapp', this.userData.whatsapp);
        this.updateField('campus', this.userData.campus);
        this.updateField('location', this.userData.location);
    }
    
    /**
     * Updates a specific field in the UI
     * @param {string} fieldName - Field name to update
     * @param {string} value - New value
     */
    updateField(fieldName, value) {
        const valueElement = document.getElementById(`${fieldName}-value`);
        const inputElement = document.getElementById(`${fieldName}-input`);
        
        if (valueElement) {
            valueElement.textContent = value;
        }
        
        if (inputElement) {
            inputElement.value = value;
        }
    }
    
    /**
     * Attaches event listeners to editable fields
     */
    attachEditListeners() {
        const editButtons = document.querySelectorAll('.edit-button');
        
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get field container
                const fieldContainer = button.closest('.editable-field');
                const fieldName = fieldContainer.getAttribute('data-field');
                
                // Store original value
                const valueElement = fieldContainer.querySelector('.field-value');
                this.originalValues[fieldName] = valueElement.textContent;
                
                // Enter edit mode
                this.enterEditMode(fieldContainer, fieldName);
            });
        });
    }
    
    /**
     * Enters edit mode for a specific field
     * @param {HTMLElement} fieldContainer - Field container element
     * @param {string} fieldName - Field name
     */
    enterEditMode(fieldContainer, fieldName) {
        // Already editing something else?
        if (this.isEditing && this.editingField !== fieldName) {
            this.cancelEdit(this.editingField);
        }
        
        // Show edit interface
        const valueElement = fieldContainer.querySelector('.field-value');
        const inputElement = fieldContainer.querySelector('.edit-input');
        const editButton = fieldContainer.querySelector('.edit-button');
        const editActions = fieldContainer.querySelector('.edit-actions');
        
        valueElement.classList.add('hidden');
        editButton.classList.add('hidden');
        inputElement.classList.remove('hidden');
        editActions.classList.remove('hidden');
        
        // Focus input
        inputElement.focus();
        
        // Set editing state
        this.isEditing = true;
        this.editingField = fieldName;
        
        // Attach save/cancel events
        const saveButton = fieldContainer.querySelector('.save-button');
        const cancelButton = fieldContainer.querySelector('.cancel-button');
        
        // Remove existing listeners if any
        saveButton.replaceWith(saveButton.cloneNode(true));
        cancelButton.replaceWith(cancelButton.cloneNode(true));
        
        // Get fresh references
        const newSaveButton = fieldContainer.querySelector('.save-button');
        const newCancelButton = fieldContainer.querySelector('.cancel-button');
        
        newSaveButton.addEventListener('click', () => this.saveEdit(fieldName));
        newCancelButton.addEventListener('click', () => this.cancelEdit(fieldName));
        
        // Handle Enter key press
        inputElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.saveEdit(fieldName);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.cancelEdit(fieldName);
            }
        });
    }
    
    /**
     * Saves edited field value
     * @param {string} fieldName - Field name to save
     */
    saveEdit(fieldName) {
        const fieldContainer = document.querySelector(`.editable-field[data-field="${fieldName}"]`);
        if (!fieldContainer) return;
        
        const valueElement = fieldContainer.querySelector('.field-value');
        const inputElement = fieldContainer.querySelector('.edit-input');
        const editButton = fieldContainer.querySelector('.edit-button');
        const editActions = fieldContainer.querySelector('.edit-actions');
        
        // Validate input
        const newValue = inputElement.value.trim();
        if (!this.validateField(fieldName, newValue)) {
            // Show error
            inputElement.classList.add('error');
            
            // Shake the input for feedback
            if (window.transitionManager) {
                window.transitionManager.shakeElement(inputElement);
            }
            
            return;
        }
        
        // Update user data object
        this.userData[fieldName] = newValue;
        
        // Update UI
        valueElement.textContent = newValue;
        
        // Exit edit mode
        valueElement.classList.remove('hidden');
        editButton.classList.remove('hidden');
        inputElement.classList.remove('error');
        inputElement.classList.add('hidden');
        editActions.classList.add('hidden');
        
        // Reset editing state
        this.isEditing = false;
        this.editingField = null;
        
        // Show success feedback
        this.showFeedback('Profile updated successfully!', 'success');
        
        // In a real app, save to API
        this.saveToAPI(fieldName, newValue);
    }
    
    /**
     * Cancels edit and reverts to original value
     * @param {string} fieldName - Field name to cancel
     */
    cancelEdit(fieldName) {
        const fieldContainer = document.querySelector(`.editable-field[data-field="${fieldName}"]`);
        if (!fieldContainer) return;
        
        const valueElement = fieldContainer.querySelector('.field-value');
        const inputElement = fieldContainer.querySelector('.edit-input');
        const editButton = fieldContainer.querySelector('.edit-button');
        const editActions = fieldContainer.querySelector('.edit-actions');
        
        // Restore original value
        inputElement.value = this.originalValues[fieldName] || '';
        
        // Exit edit mode
        valueElement.classList.remove('hidden');
        editButton.classList.remove('hidden');
        inputElement.classList.remove('error');
        inputElement.classList.add('hidden');
        editActions.classList.add('hidden');
        
        // Reset editing state
        this.isEditing = false;
        this.editingField = null;
    }
    
    /**
     * Validates a field value
     * @param {string} fieldName - Field name
     * @param {string} value - Value to validate
     * @returns {boolean} - Validation result
     */
    validateField(fieldName, value) {
        if (!value) return false;
        
        switch (fieldName) {
            case 'email':
                // Simple email validation
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                
            case 'whatsapp':
                // Basic phone validation
                return /^[+]?[\d\s-]{8,15}$/.test(value);
                
            default:
                // Generic validation - not empty and reasonable length
                return value.length > 0 && value.length <= 100;
        }
    }
    
    /**
     * Attaches event listeners for avatar updates
     */
    attachAvatarListeners() {
        const updateAvatarButton = document.querySelector('.profile-avatar .circle-button');
        if (!updateAvatarButton) return;
        
        updateAvatarButton.addEventListener('click', () => {
            // In a real app, open file picker
            // For demo, we'll simulate with a prompt
            const imageUrl = prompt('Enter a URL for your profile image (leave empty to use initials):');
            
            if (imageUrl === null) {
                // User cancelled
                return;
            }
            
            // Update avatar
            this.updateAvatar(imageUrl);
        });
    }
    
    /**
     * Updates user avatar
     * @param {string} imageUrl - URL of new avatar image
     */
    updateAvatar(imageUrl) {
        // Update user data
        this.userData.profileImageUrl = imageUrl || null;
        
        // Update UI
        const avatarPlaceholders = document.querySelectorAll('.avatar-placeholder');
        avatarPlaceholders.forEach(placeholder => {
            if (imageUrl) {
                // Use image URL
                placeholder.innerHTML = `<img src="${imageUrl}" alt="${this.userData.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
            } else {
                // Use initials
                placeholder.innerHTML = this.userData.name.charAt(0).toUpperCase();
            }
        });
        
        // Show success feedback
        this.showFeedback('Profile image updated', 'success');
        
        // In a real app, save to API
        this.saveToAPI('profileImageUrl', imageUrl);
    }
    
    /**
     * Attaches event listeners for password changes
     */
    attachPasswordListeners() {
        const changePasswordButton = document.querySelector('.change-password-button');
        if (!changePasswordButton) return;
        
        changePasswordButton.addEventListener('click', () => {
            // In a real app, show password change form
            // For demo, simulate with alerts
            const currentPassword = prompt('Enter your current password:');
            if (!currentPassword) return;
            
            const newPassword = prompt('Enter your new password:');
            if (!newPassword) return;
            
            const confirmPassword = prompt('Confirm your new password:');
            if (newPassword !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }
            
            // Show success feedback
            this.showFeedback('Password updated successfully!', 'success');
            
            // In a real app, send to API
            console.log('Password would be updated here');
        });
    }
    
    /**
     * Shows feedback message
     * @param {string} message - Message to show
     * @param {string} type - Message type (success, error, etc.)
     */
    showFeedback(message, type = 'info') {
        // Use app's toast function if available
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
            return;
        }
        
        // Fallback to alert if no toast function
        alert(message);
    }
    
    /**
     * Saves data to API (simulated)
     * @param {string} field - Field name
     * @param {any} value - Field value
     */
    saveToAPI(field, value) {
        // Simulate API request
        console.log(`Saving ${field} = ${value} to API...`);
        
        // In a real app, this would be an actual API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Saved ${field} successfully!`);
                resolve({ success: true, field, value });
            }, 500);
        });
    }
    
    /**
     * Formats a timestamp for display
     * @param {Date} date - Date to format
     * @returns {string} - Formatted date string
     */
    formatTimestamp(date) {
        if (!date) return 'Never';
        
        const now = new Date();
        const diff = now - date; // Difference in milliseconds
        
        // Less than a day
        if (diff < 86400000) {
            // Less than an hour
            if (diff < 3600000) {
                const minutes = Math.floor(diff / 60000);
                return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
            }
            
            const hours = Math.floor(diff / 3600000);
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        }
        
        // Less than 2 days
        if (diff < 172800000) {
            return 'Yesterday';
        }
        
        // Format date
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Create and export profile manager instance
const profileManager = new ProfileManager();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    profileManager.init();
});

// Add global access for use in other scripts
window.profileManager = profileManager;