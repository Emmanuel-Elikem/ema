// transitions.js - Animation and transition management for Campus Marketplace Profile

/**
 * Handles page transition animations
 */
class TransitionManager {
    constructor() {
        this.transitionDuration = 300; // ms
        this.transitioning = false;
    }
    
    /**
     * Performs a page transition animation
     * @param {Function} callback - Function to call after transition completes
     */
    pageTransition(callback) {
        if (this.transitioning) return;
        this.transitioning = true;
        
        // Create transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'page-transition';
        
        // Add loading animation to overlay
        const loadingGradient = document.createElement('div');
        loadingGradient.className = 'loading-gradient';
        overlay.appendChild(loadingGradient);
        
        document.body.appendChild(overlay);
        
        // Ensure overlay is rendered before animating
        setTimeout(() => {
            // Execute callback during transition
            if (typeof callback === 'function') {
                callback();
            }
            
            // Start fade out animation
            setTimeout(() => {
                overlay.classList.add('fade-out');
                
                // Remove overlay after animation completes
                setTimeout(() => {
                    document.body.removeChild(overlay);
                    this.transitioning = false;
                }, this.transitionDuration);
            }, this.transitionDuration);
        }, 50);
    }
    
    /**
     * Animates a section transition
     * @param {HTMLElement} fromElement - Element to transition from
     * @param {HTMLElement} toElement - Element to transition to
     */
    sectionTransition(fromElement, toElement) {
        if (!fromElement || !toElement) return;
        
        // Add transition classes
        fromElement.classList.add('section-exit');
        toElement.classList.add('section-enter');
        
        // Force a reflow to ensure transitions work
        void toElement.offsetWidth;
        
        // Start exit animation for current element
        fromElement.classList.add('section-exit-active');
        
        // After a small delay, start enter animation for new element
        setTimeout(() => {
            toElement.style.display = 'block';
            
            // Force a reflow
            void toElement.offsetWidth;
            
            toElement.classList.add('section-enter-active');
        }, 50);
        
        // Clean up classes after animation completes
        setTimeout(() => {
            fromElement.style.display = 'none';
            fromElement.classList.remove('section-exit', 'section-exit-active');
            toElement.classList.remove('section-enter', 'section-enter-active');
        }, this.transitionDuration + 50);
    }
    
    /**
     * Handles expansion/collapse transitions
     * @param {HTMLElement} element - Element to expand or collapse
     * @param {boolean} expand - Whether to expand or collapse
     */
    expandCollapse(element, expand) {
        if (!element) return;
        
        if (expand) {
            // Measure the content height first
            element.style.display = 'block';
            const height = element.scrollHeight;
            element.style.height = '0px';
            
            // Force a reflow
            void element.offsetWidth;
            
            // Animate to full height
            element.style.height = `${height}px`;
            element.style.overflow = 'hidden';
            
            // Clean up after animation
            setTimeout(() => {
                element.style.height = '';
                element.style.overflow = '';
            }, this.transitionDuration);
        } else {
            // Store current height
            const height = element.scrollHeight;
            element.style.height = `${height}px`;
            element.style.overflow = 'hidden';
            
            // Force a reflow
            void element.offsetWidth;
            
            // Animate to zero height
            element.style.height = '0px';
            
            // Hide after animation
            setTimeout(() => {
                element.style.display = 'none';
                element.style.height = '';
                element.style.overflow = '';
            }, this.transitionDuration);
        }
    }
    
    /**
     * Animates a smooth scroll to an element
     * @param {HTMLElement} element - Target element to scroll to
     * @param {number} offset - Optional offset from the top
     */
    scrollTo(element, offset = 0) {
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        const targetPosition = rect.top + window.pageYOffset - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 500;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easing = easeInOutQuad(progress);
            
            window.scrollTo(0, startPosition + distance * easing);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        function easeInOutQuad(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
        
        requestAnimationFrame(animation);
    }
    
    /**
     * Applies a fade-in animation to an element
     * @param {HTMLElement} element - Element to fade in
     */
    fadeIn(element) {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.display = 'block';
        
        // Force a reflow
        void element.offsetWidth;
        
        element.style.transition = `opacity ${this.transitionDuration}ms ease`;
        element.style.opacity = '1';
        
        // Clean up after animation
        setTimeout(() => {
            element.style.transition = '';
        }, this.transitionDuration);
    }
    
    /**
     * Applies a fade-out animation to an element
     * @param {HTMLElement} element - Element to fade out
     */
    fadeOut(element) {
        if (!element) return;
        
        element.style.transition = `opacity ${this.transitionDuration}ms ease`;
        element.style.opacity = '0';
        
        // Hide after animation
        setTimeout(() => {
            element.style.display = 'none';
            element.style.transition = '';
            element.style.opacity = '';
        }, this.transitionDuration);
    }
    
    /**
     * Applies a slide-down animation to an element
     * @param {HTMLElement} element - Element to slide down
     */
    slideDown(element) {
        if (!element) return;
        
        // Store original height
        const height = element.scrollHeight;
        
        // Set up initial state
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        element.style.transition = `height ${this.transitionDuration}ms ease`;
        
        // Force a reflow
        void element.offsetWidth;
        
        // Animate
        element.style.height = `${height}px`;
        
        // Clean up after animation
        setTimeout(() => {
            element.style.height = '';
            element.style.overflow = '';
            element.style.transition = '';
        }, this.transitionDuration);
    }
    
    /**
     * Applies a slide-up animation to an element
     * @param {HTMLElement} element - Element to slide up
     */
    slideUp(element) {
        if (!element) return;
        
        // Store current height
        const height = element.scrollHeight;
        element.style.height = `${height}px`;
        element.style.overflow = 'hidden';
        element.style.transition = `height ${this.transitionDuration}ms ease`;
        
        // Force a reflow
        void element.offsetWidth;
        
        // Animate
        element.style.height = '0px';
        
        // Hide after animation
        setTimeout(() => {
            element.style.display = 'none';
            element.style.height = '';
            element.style.overflow = '';
            element.style.transition = '';
        }, this.transitionDuration);
    }
    
    /**
     * Applies a shake animation for error feedback
     * @param {HTMLElement} element - Element to shake
     */
    shakeElement(element) {
        if (!element) return;
        
        element.classList.add('error-animation');
        
        // Remove class after animation
        setTimeout(() => {
            element.classList.remove('error-animation');
        }, 500);
    }
    
    /**
     * Applies a success checkmark animation
     * @param {HTMLElement} element - Element to animate
     */
    successAnimation(element) {
        if (!element) return;
        
        element.classList.add('success-animation');
        
        // Clean up is not necessary as the animation forwards to the end state
    }
}

// Create and export transition manager instance
const transitionManager = new TransitionManager();

// Add global access for use in other scripts
window.transitionManager = transitionManager;