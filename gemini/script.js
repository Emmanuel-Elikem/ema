document.addEventListener('DOMContentLoaded', () => {
    // --- State Variables ---
    let selectedPaymentType = null;
    let selectedCountry = null;

    // --- DOM Elements ---
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.nav-links-mobile');
    const navOverlay = document.querySelector('.nav-overlay');
    const closeNavBtn = document.querySelector('.close-nav');
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    const paymentTypeButtons = document.querySelectorAll('.btn-payment-type');
    const countryCards = document.querySelectorAll('.country-card');
    const backButtons = document.querySelectorAll('.btn-back');

    const welcomeSection = document.getElementById('welcome-section');
    const countrySection = document.getElementById('country-section');
    const paymentOptionsSection = document.getElementById('payment-options-section');
    const allSections = [welcomeSection, countrySection, paymentOptionsSection];

    const selectedPaymentTypeText = document.getElementById('selected-payment-type-text');
    const finalPaymentTypeText = document.getElementById('final-payment-type');
    const finalCountryText = document.getElementById('final-country');
    const paymentDetailsContainer = document.getElementById('payment-details');
    const currentYearSpan = document.getElementById('current-year');

    // --- Initial Setup ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    showSection('welcome-section'); // Start with the welcome section

    // --- Functions ---

    // Function to toggle mobile navigation
    function toggleNav() {
        const isActive = mobileNav.classList.contains('active');
        hamburger.setAttribute('aria-expanded', !isActive);
        mobileNav.classList.toggle('active');
        navOverlay.classList.toggle('active');
        // Optional: Prevent body scroll when nav is open
        document.body.style.overflow = isActive ? '' : 'hidden';
    }

    // Function to close mobile navigation
    function closeNav() {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('active');
        navOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }

    // Function to show a specific section and hide others
    function showSection(sectionId) {
        allSections.forEach(section => {
            if (section.id === sectionId) {
                section.classList.remove('hidden');
                section.classList.add('active-section');
                // Trigger reflow for animation restart if needed (optional)
                void section.offsetWidth;
                section.classList.add('animated', 'fade-in'); // Re-add animation class
            } else {
                section.classList.add('hidden');
                section.classList.remove('active-section', 'animated', 'fade-in');
            }
        });
         window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top when changing sections
    }

    // Function to display payment options based on country
    function displayPaymentOptions() {
        if (!selectedPaymentType || !selectedCountry) return; // Safety check

        // Update summary text
        finalPaymentTypeText.textContent = selectedPaymentType;
        finalCountryText.textContent = selectedCountry;

        paymentDetailsContainer.innerHTML = ''; // Clear previous options

        let paymentHtml = '';
        const mobileMoneyCountries = ['Ghana', 'Kenya', 'Nigeria', 'Togo']; // Configurable list

        if (mobileMoneyCountries.includes(selectedCountry)) {
            // Placeholder Mobile Money Number - REPLACE WITH ACTUAL
            const momoPlaceholder = selectedCountry === 'Ghana' ? '+233 XX XXX XXXX' :
                                     selectedCountry === 'Kenya' ? '+254 XXX XXX XXX' :
                                     selectedCountry === 'Nigeria' ? '+234 XXX XXX XXXX' :
                                     selectedCountry === 'Togo' ? '+228 XX XXX XXX' :
                                     'Mobile Money Number Placeholder';

            paymentHtml = `
                <p>You can give manually using the number below:</p>
                <p class="momo-number">${momoPlaceholder}</p>
                <p>Or click the button below to pay securely online:</p>
                <button class="btn btn-paystack btn-proceed-payment" data-method="momo_or_card">Pay with Mobile Money or Card</button>
            `;
        } else { // USA, UK, Other
            paymentHtml = `
                <p>Click the button below to pay securely with your card:</p>
                <button class="btn btn-paystack btn-proceed-payment" data-method="card">Pay with Card</button>
            `;
        }

        paymentDetailsContainer.innerHTML = paymentHtml;

        // Add event listener to the newly created payment button
        const proceedButton = paymentDetailsContainer.querySelector('.btn-proceed-payment');
        if (proceedButton) {
            proceedButton.addEventListener('click', handlePaymentProceed);
        }
    }

    // Function to handle the final payment button click
    function handlePaymentProceed(event) {
        const paymentMethod = event.target.dataset.method;
        console.log('--- Payment Initiation ---');
        console.log(`Payment Type: ${selectedPaymentType}`);
        console.log(`Country: ${selectedCountry}`);
        console.log(`Selected Method: ${paymentMethod}`);
        console.log('--- Placeholder: Paystack Integration would start here ---');

        // ** Future Paystack Integration Point **
        // Replace alert with actual Paystack API call
        alert(`Initiating payment for ${selectedPaymentType} from ${selectedCountry} via ${paymentMethod}.\n(This is a placeholder - Paystack integration needed)`);
    }

    // --- Event Listeners ---

    // Mobile Nav Toggle
    hamburger.addEventListener('click', toggleNav);
    closeNavBtn.addEventListener('click', closeNav);
    navOverlay.addEventListener('click', closeNav);

    // Mobile Nav Link Clicks (for payment type selection)
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const paymentType = link.dataset.paymentType;
            if (paymentType) {
                e.preventDefault(); // Prevent default anchor behavior
                selectedPaymentType = paymentType;
                selectedPaymentTypeText.textContent = selectedPaymentType; // Update text on country page
                showSection('country-section');
                closeNav(); // Close nav after selection
            }
        });
    });

     // Payment Type Button Clicks (from welcome section)
    paymentTypeButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedPaymentType = button.dataset.paymentType;
            selectedPaymentTypeText.textContent = selectedPaymentType; // Update text on country page
            showSection('country-section');
        });
    });

    // Country Card Clicks
    countryCards.forEach(card => {
        card.addEventListener('click', () => {
            selectedCountry = card.dataset.country;
            displayPaymentOptions(); // Generate payment options based on country
            showSection('payment-options-section');
        });
    });

    // Back Button Clicks
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSectionId = button.dataset.target;
            showSection(targetSectionId);
             // Reset subsequent state if going back
            if (targetSectionId === 'country-section') {
                selectedCountry = null; // Clear country if going back to country selection
            } else if (targetSectionId === 'welcome-section') {
                 selectedPaymentType = null; // Clear payment type if going back to start
                 selectedCountry = null;
            }
        });
    });

}); // End DOMContentLoaded