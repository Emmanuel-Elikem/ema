document.addEventListener('DOMContentLoaded', () => {
    // --- Element Selectors ---
    const form = document.getElementById('product-form');
    const categorySelect = document.getElementById('category');
    const dynamicFieldsContainer = document.getElementById('dynamic-fields-container');
    const conditionGroup = document.getElementById('condition-group');
    const conditionSelect = document.getElementById('condition');
    const descriptionTextarea = document.getElementById('description');
    const charCounter = document.querySelector('.char-counter');
    const priceInput = document.getElementById('price');
    const negotiableCheckbox = document.getElementById('negotiable');
    const imageUploadArea = document.getElementById('image-upload-area');
    const imageInput = document.getElementById('product-images');
    const imagePreviewContainer = document.getElementById('image-preview-container');
    const whatsappInput = document.getElementById('whatsapp-number');
    const editWhatsappBtn = document.querySelector('.edit-btn');
    const showNumberToggle = document.getElementById('show-number');
    const deliveryToggle = document.getElementById('delivery-available');
    const deliveryFeeGroup = document.getElementById('delivery-fee-group');
    const tagsInput = document.getElementById('tags-input');
    const tagsSelectedArea = document.getElementById('tags-selected-area');
    const tagsAutocompleteList = document.getElementById('tags-autocomplete-list');
    const termsCheckbox = document.getElementById('terms');
    const submitButton = document.getElementById('submit-button');
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.querySelector('.close-modal-btn');
    const viewProductBtn = document.getElementById('view-product-btn');
    const postAnotherBtn = document.getElementById('post-another-btn');
    const pageLoader = document.querySelector('.page-loader');
    const pageContent = document.querySelector('.page-content');

    // --- Initial State & Config ---
    const MAX_IMAGES = 4;
    const MAX_TAGS = 10;
    let uploadedFiles = [];
    let selectedTags = [];
    // Example predefined tags for autocomplete
    const allPossibleTags = [
        "Tech", "Gadget", "Phone", "Laptop", "Electronics", "Audio", "Speaker", "Headphones",
        "Fashion", "Clothing", "Shoes", "Sneakers", "Heels", "Dress", "Shirt", "Jeans", "Accessories", "Bag", "Watch", "Jewelry",
        "Food", "Snacks", "Drinks", "Meal", "Breakfast", "Lunch", "Dinner", "Pastries", "Homemade",
        "Beauty", "Grooming", "Makeup", "Skincare", "Hair", "Haircare", "Perfume", "Cosmetics",
        "Services", "Hair Braiding", "Tutoring", "Delivery", "Graphic Design", "Photography", "Room Decor", "Cleaning", "Repair",
        "Books", "Stationery", "Textbook", "Novel", "Pen", "Notebook",
        "Home Goods", "Decor", "Kitchen", "Bedding", "Furniture",
        "Tickets", "Voucher", "Event", "Concert", "Party",
        "Gaming", "Console", "Video Game", "Sports", "Fitness", "Art", "Crafts", "Handmade"
    ];

    // --- Loading Simulation & Skeleton ---
    function hideLoader() {
        if (pageLoader) {
            pageLoader.style.opacity = '0';
            setTimeout(() => {
                pageLoader.style.display = 'none';
                pageContent.classList.remove('is-loading');
            }, 300); // Match CSS transition speed
        }
    }
    // Simulate loading time (e.g., fetching user data, etc.)
    setTimeout(hideLoader, 1500); // Adjust time as needed


    // --- Dynamic Fields Logic ---
    const dynamicFieldTemplates = {
        electronics: `
            <div class="form-group slide-in">
                <label for="brand">Brand</label>
                <input type="text" id="brand" name="brand" placeholder="E.g. Apple, Samsung, JBL">
            </div>
             <div class="form-group slide-in">
                <label for="battery-life">Battery Life (Optional)</label>
                <input type="text" id="battery-life" name="batteryLife" placeholder="E.g. 8 hours, 2 days">
            </div>
             <div class="form-group slide-in toggle-group small-toggle">
                 <label for="warranty">Warranty Included?</label>
                 <div class="toggle-switch">
                      <input type="checkbox" id="warranty" name="warranty">
                      <label for="warranty" class="slider"></label>
                 </div>
            </div>
             <div class="form-group slide-in">
                <label for="specs-link">Link to Specs (Optional)</label>
                <input type="url" id="specs-link" name="specsLink" placeholder="https://...">
            </div>
        `,
        fashion: `
            <div class="form-group slide-in">
                <label for="size">Size</label>
                <select id="size" name="size">
                    <option value="">Select Size</option>
                    <option value="xs">XS</option> <option value="s">S</option> <option value="m">M</option>
                    <option value="l">L</option> <option value="xl">XL</option> <option value="xxl">XXL</option>
                    <option value="various">Various (Specify in Desc.)</option>
                    <option value="onesize">One Size</option>
                    <option value="eu38">EU 38</option> <option value="uk6">UK 6</option>
                     <option value="us8">US 8</option>
                </select>
            </div>
            <div class="form-group slide-in">
                <label>Gender</label>
                <div class="radio-group">
                    <input type="radio" id="gender-male" name="gender" value="male"><label for="gender-male">Male</label>
                    <input type="radio" id="gender-female" name="gender" value="female"><label for="gender-female">Female</label>
                    <input type="radio" id="gender-unisex" name="gender" value="unisex" checked><label for="gender-unisex">Unisex</label>
                </div>
            </div>
             <div class="form-group slide-in">
                <label for="color">Color(s)</label>
                <input type="text" id="color" name="color" placeholder="E.g. Black, Blue, Multi-color">
            </div>
            <div class="form-group slide-in">
                <label for="material">Material (Optional)</label>
                <input type="text" id="material" name="material" placeholder="E.g. Cotton, Leather, Synthetic">
            </div>
        `,
        food: `
            <div class="form-group slide-in">
                <label for="portion-size">Portion Size</label>
                <input type="text" id="portion-size" name="portionSize" placeholder="E.g. Single Plate, Pack of 5, 500ml">
            </div>
            <div class="form-group slide-in toggle-group small-toggle">
                 <label for="food-delivery">Delivery Available?</label>
                 <div class="toggle-switch">
                      <input type="checkbox" id="food-delivery" name="foodDelivery">
                      <label for="food-delivery" class="slider"></label>
                 </div>
            </div>
             <div class="form-group slide-in">
                <label for="food-type">Type</label>
                <input type="text" id="food-type" name="foodType" placeholder="E.g. Jollof Rice, Cake, Smoothie, Meat Pie">
            </div>
            <div class="form-group slide-in">
                <label for="allergens">Allergens (Optional)</label>
                <input type="text" id="allergens" name="allergens" placeholder="E.g. Contains nuts, Gluten-free">
            </div>
        `,
        services: `
             <div class="form-group slide-in">
                <label for="service-duration">Estimated Duration</label>
                <input type="text" id="service-duration" name="serviceDuration" placeholder="E.g. 2 hours, 1 day, Varies">
            </div>
            <div class="form-group slide-in">
                <label for="available-days">Available Days/Times</label>
                <input type="text" id="available-days" name="availableDays" placeholder="E.g. Weekends, Mon-Fri evenings">
            </div>
             <div class="form-group slide-in">
                <label for="pricing-desc">Pricing Details</label>
                <textarea id="pricing-desc" name="pricingDesc" placeholder="Describe your pricing structure (e.g., per hour, fixed project fee, etc.)"></textarea>
            </div>
             <div class="form-group slide-in">
                <label for="portfolio-link">Portfolio/Example Link (Optional)</label>
                <input type="url" id="portfolio-link" name="portfolioLink" placeholder="https://...">
            </div>
        `
        // Add templates for other categories (books, home, tickets, etc.) if needed
    };

    function updateDynamicFields() {
        const selectedCategory = categorySelect.value;
        dynamicFieldsContainer.innerHTML = ''; // Clear previous fields

        // Show/Hide Product Condition based on category
        if (selectedCategory === 'services') {
            conditionGroup.classList.add('hidden'); // Use class for smooth transition
            conditionSelect.value = 'na'; // Set condition to N/A
            conditionSelect.removeAttribute('required'); // Not required for services
        } else {
            conditionGroup.classList.remove('hidden');
            conditionSelect.setAttribute('required', ''); // Make it required again for products
             if(conditionSelect.value === 'na') conditionSelect.value = 'new'; // Default to new if N/A was selected
        }


        if (dynamicFieldTemplates[selectedCategory]) {
            dynamicFieldsContainer.innerHTML = dynamicFieldTemplates[selectedCategory];
            // We might need to re-attach event listeners if dynamic fields have complex interactions
        }

         checkFormValidity(); // Re-check validity as required fields might change
    }

    categorySelect.addEventListener('change', updateDynamicFields);

    // --- Description Character Counter ---
    descriptionTextarea.addEventListener('input', () => {
        const count = descriptionTextarea.value.length;
        charCounter.textContent = `${count}/500`;
    });

    // --- WhatsApp Number Edit ---
     whatsappInput.value = "+233244123456"; // Simulate pre-filling from profile
    editWhatsappBtn.addEventListener('click', () => {
        whatsappInput.readOnly = !whatsappInput.readOnly;
        whatsappInput.focus();
        // Optional: Change icon or button text while editing
    });

     // --- Delivery Fee Toggle ---
     deliveryToggle.addEventListener('change', () => {
         deliveryFeeGroup.style.display = deliveryToggle.checked ? 'block' : 'none';
     });

    // --- Image Upload Handling ---
    imageUploadArea.addEventListener('click', () => imageInput.click());

    imageInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Drag and Drop
    imageUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageUploadArea.classList.add('dragover');
    });
    imageUploadArea.addEventListener('dragleave', () => {
        imageUploadArea.classList.remove('dragover');
    });
    imageUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        imageUploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    function handleFiles(files) {
        const currentImageCount = uploadedFiles.length;
        const filesToAdd = Array.from(files).slice(0, MAX_IMAGES - currentImageCount);

        if (currentImageCount + filesToAdd.length > MAX_IMAGES) {
             showError(imageInput, `You can only upload a maximum of ${MAX_IMAGES} images.`);
             return;
        }
        clearError(imageInput); // Clear previous errors

        filesToAdd.forEach(file => {
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                console.warn(`File type not accepted: ${file.name}`);
                return; // Skip non-accepted file types
            }
            if (uploadedFiles.length < MAX_IMAGES) {
                uploadedFiles.push(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    createImagePreview(e.target.result, file);
                }
                reader.readAsDataURL(file);
            }
        });
        checkFormValidity(); // Re-check validity after adding images
        imageInput.value = ''; // Reset file input
    }

    function createImagePreview(src, file) {
        const previewWrapper = document.createElement('div');
        previewWrapper.classList.add('img-preview-wrapper');

        const img = document.createElement('img');
        img.src = src;
        img.alt = 'Image preview';

        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '&times;';
        removeBtn.classList.add('remove-img-btn');
        removeBtn.type = 'button'; // Prevent form submission
        removeBtn.onclick = () => {
            uploadedFiles = uploadedFiles.filter(f => f !== file); // Remove file from array
            previewWrapper.remove(); // Remove preview element
            checkFormValidity(); // Re-check validity
        };

        previewWrapper.appendChild(img);
        previewWrapper.appendChild(removeBtn);
        imagePreviewContainer.appendChild(previewWrapper);
    }

     // --- Tags Input Handling ---
     tagsInput.addEventListener('input', handleTagInput);
     tagsInput.addEventListener('keydown', handleTagKeyDown);
     tagsInput.addEventListener('focus', () => handleTagInput()); // Show suggestions on focus
     document.addEventListener('click', (e) => { // Hide autocomplete on outside click
        if (!tagsInput.contains(e.target) && !tagsAutocompleteList.contains(e.target)) {
             tagsAutocompleteList.style.display = 'none';
         }
     });
     // Allow clicking wrapper to focus input
     tagsInput.parentElement.addEventListener('click', (e) => {
         if (e.target === tagsInput.parentElement || e.target === tagsSelectedArea) {
             tagsInput.focus();
         }
     });

     function handleTagInput() {
         const inputText = tagsInput.value.trim().toLowerCase();
         if (inputText.length === 0) {
             tagsAutocompleteList.style.display = 'none';
             return;
         }

         const suggestions = allPossibleTags.filter(tag =>
             tag.toLowerCase().includes(inputText) && !selectedTags.includes(tag)
         );

         renderAutocomplete(suggestions);
     }

     function handleTagKeyDown(e) {
         const inputText = tagsInput.value.trim();
         if ((e.key === 'Enter' || e.key === ',') && inputText) {
             e.preventDefault();
             addTag(inputText);
             tagsInput.value = '';
             tagsAutocompleteList.style.display = 'none';
         } else if (e.key === 'Backspace' && tagsInput.value === '' && selectedTags.length > 0) {
             // Remove last tag on backspace if input is empty
             const lastTag = selectedTags.pop();
             renderSelectedTags();
             checkFormValidity();
         }
     }

     function renderAutocomplete(suggestions) {
         tagsAutocompleteList.innerHTML = '';
         if (suggestions.length > 0) {
             suggestions.slice(0, 5).forEach(suggestion => { // Limit suggestions shown
                 const item = document.createElement('div');
                 item.classList.add('autocomplete-item');
                 item.textContent = suggestion;
                 item.addEventListener('click', () => {
                     addTag(suggestion);
                     tagsInput.value = '';
                     tagsAutocompleteList.style.display = 'none';
                 });
                 tagsAutocompleteList.appendChild(item);
             });
             tagsAutocompleteList.style.display = 'block';
         } else {
             tagsAutocompleteList.style.display = 'none';
         }
     }

     function addTag(tagText) {
         const tag = tagText.trim().replace(/,/g, ''); // Clean tag
         if (tag && !selectedTags.includes(tag) && selectedTags.length < MAX_TAGS) {
             selectedTags.push(tag);
             renderSelectedTags();
             checkFormValidity(); // Tags aren't required, but check anyway
         }
     }

     function renderSelectedTags() {
         tagsSelectedArea.innerHTML = '';
         selectedTags.forEach(tag => {
             const tagElement = document.createElement('span');
             tagElement.classList.add('tag-item');
             tagElement.textContent = tag;

             const removeBtn = document.createElement('button');
             removeBtn.innerHTML = '&times;';
             removeBtn.classList.add('remove-tag-btn');
             removeBtn.type = 'button';
             removeBtn.onclick = () => {
                 selectedTags = selectedTags.filter(t => t !== tag);
                 renderSelectedTags();
                 checkFormValidity();
             };

             tagElement.appendChild(removeBtn);
             tagsSelectedArea.appendChild(tagElement);
         });
     }


    // --- Form Validation ---
    function showError(inputElement, message) {
        const formGroup = inputElement.closest('.form-group');
        if (!formGroup) return; // Exit if no parent group found
        const errorDiv = formGroup.querySelector('.error-message');
        formGroup.classList.add('error');
         if(errorDiv) errorDiv.textContent = message;
         // Special handling for image upload area
         if(inputElement.id === 'product-images') {
              const imgErrorDiv = imageUploadArea.nextElementSibling.nextElementSibling; // Assumes error div is after preview container
              if(imgErrorDiv) {
                  imgErrorDiv.textContent = message;
                  imgErrorDiv.style.display = 'block';
                  imageUploadArea.style.borderColor = 'var(--error-color)'; // Visually indicate error on dropzone too
              }
         }
    }

    function clearError(inputElement) {
         const formGroup = inputElement.closest('.form-group');
         if (!formGroup) return;
         const errorDiv = formGroup.querySelector('.error-message');
         formGroup.classList.remove('error');
         if(errorDiv) errorDiv.textContent = '';
          // Special handling for image upload area
         if(inputElement.id === 'product-images') {
              const imgErrorDiv = imageUploadArea.nextElementSibling.nextElementSibling;
              if(imgErrorDiv) {
                  imgErrorDiv.textContent = '';
                  imgErrorDiv.style.display = 'none';
                   imageUploadArea.style.borderColor = ''; // Reset border color
              }
         }
    }

    function checkFormValidity() {
        let isValid = true;
        const requiredInputs = form.querySelectorAll('[required]:not(.hidden [required])'); // Select only visible required fields

        requiredInputs.forEach(input => {
             // Specific check for image uploads (at least one required)
             if (input.id === 'product-images') {
                 if (uploadedFiles.length === 0) {
                     isValid = false;
                     showError(input, 'Please upload at least one image.');
                 } else {
                     clearError(input);
                 }
             }
              // Specific check for checkboxes
             else if (input.type === 'checkbox') {
                 if (!input.checked) {
                     isValid = false;
                     showError(input, 'This field is required.');
                 } else {
                     clearError(input);
                 }
             }
            // General check for other inputs/selects/textareas
            else if (!input.value.trim()) {
                isValid = false;
                showError(input, 'This field is required.');
            } else {
                clearError(input);
            }
        });

        // Check dynamically added required fields (if any)
        const dynamicRequired = dynamicFieldsContainer.querySelectorAll('[required]');
        dynamicRequired.forEach(input => {
             if (!input.value.trim()) {
                 isValid = false;
                 showError(input, 'This field is required.');
             } else {
                 clearError(input);
             }
        });

        // Final check: Terms must be checked
        if (!termsCheckbox.checked) {
            isValid = false;
            showError(termsCheckbox, 'You must agree to the terms.');
        } else {
            clearError(termsCheckbox);
        }


        submitButton.disabled = !isValid;
        return isValid;
    }

    // Add input/change listeners to all relevant fields for real-time validation
    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', checkFormValidity); // 'input' for instant feedback
        input.addEventListener('change', checkFormValidity); // 'change' for select/checkbox/radio
    });
     // Initial check in case the form is pre-filled or has defaults
     updateDynamicFields(); // Call once initially to set up condition field visibility etc.
     checkFormValidity();


    // --- Form Submission ---
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent actual browser submission

        if (!checkFormValidity()) {
            console.log("Form is invalid. Submission prevented.");
             // Optionally scroll to the first error
             const firstError = form.querySelector('.form-group.error');
             if(firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // --- Prepare Data (Example using FormData) ---
        const formData = new FormData(form);

        // Append uploaded files
        uploadedFiles.forEach((file, index) => {
            formData.append(`productImage_${index}`, file, file.name);
        });

        // Append selected tags (as comma-separated string or array)
        formData.append('tags', selectedTags.join(','));

        // Remove fields that might not be needed depending on toggles/category
        if (!deliveryToggle.checked) {
            formData.delete('deliveryFee');
        }
        if (categorySelect.value === 'services') {
             formData.delete('condition');
        }
         // Remove dynamic fields not relevant to the selected category
         // (More robust approach: iterate formData entries and remove based on category)


        console.log("Form Submitted! Data (FormData object):");
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        console.log("Uploaded Files:", uploadedFiles);
        console.log("Selected Tags:", selectedTags);

        // ---- !!! ----
        // ---- Replace console logs with actual fetch/AJAX call to your backend server ----
        // fetch('/api/products', {
        //     method: 'POST',
        //     body: formData
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log('Success:', data);
        //     showSuccessModal();
        // })
        // .catch((error) => {
        //     console.error('Error:', error);
        //     // Show an error message to the user
        // });
        // ---- !!! ----

        // Simulate success for demo
        setTimeout(showSuccessModal, 500);
    });

    // --- Success Modal Logic ---
    function showSuccessModal() {
        successModal.style.display = 'flex'; // Use flex for centering
    }

    function hideSuccessModal() {
        successModal.style.display = 'none';
    }

    closeModalBtn.addEventListener('click', hideSuccessModal);
    postAnotherBtn.addEventListener('click', () => {
        hideSuccessModal();
        form.reset(); // Reset the form fields
        // Clear specific custom elements:
        uploadedFiles = [];
        imagePreviewContainer.innerHTML = '';
        selectedTags = [];
        tagsSelectedArea.innerHTML = '';
        dynamicFieldsContainer.innerHTML = ''; // Clear dynamic fields
         conditionGroup.classList.remove('hidden'); // Ensure condition is visible again
         deliveryFeeGroup.style.display = 'none'; // Hide delivery fee
         charCounter.textContent = '0/500';
         updateDynamicFields(); // Reset dynamic field visibility
         checkFormValidity(); // Reset submit button state
         window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
    });
    viewProductBtn.addEventListener('click', () => {
        // Redirect to the newly created product page
        // Replace with actual URL based on backend response
        alert("Redirecting to view product... (Implementation needed)");
        // window.location.href = '/product/new-product-id';
        hideSuccessModal();
    });

    // Close modal if clicking outside the content
    window.addEventListener('click', (event) => {
        if (event.target === successModal) {
            hideSuccessModal();
        }
    });
});