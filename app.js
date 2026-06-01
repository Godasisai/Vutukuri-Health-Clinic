/**
 * VUTUKURI HEALTH CLINIC - WEB INTERACTIVITY ENGINE
 * Author: Antigravity Code Assistant
 * Last Modified: June 2026
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Mobile Navigation Hamburger Menu Toggle
       ========================================================================== */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Toggle hamburger icon state
            const hamburger = menuToggle.querySelector('.hamburger');
            if (navMenu.classList.contains('active')) {
                hamburger.style.background = 'transparent';
                hamburger.style.setProperty('--before-transform', 'rotate(45deg)');
                hamburger.style.setProperty('--after-transform', 'rotate(-45deg)');
                // Custom CSS handles active transformations, but we ensure basic toggle
            } else {
                hamburger.style.background = 'var(--color-navy)';
            }
        });

        // Close menu when clicking on any navigation link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                const hamburger = menuToggle.querySelector('.hamburger');
                if (hamburger) hamburger.style.background = 'var(--color-navy)';
                
                // Set active link class
                navLinks.forEach(item => item.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    /* ==========================================================================
       2. Services & Charges Tab Dashboard Filters
       ========================================================================== */
    const tabButtons = document.querySelectorAll('#servicesTabs .tab-btn');
    const tabPanels = document.querySelectorAll('#tabContent .tab-panel');

    if (tabButtons.length > 0 && tabPanels.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const target = button.getAttribute('data-target');

                // Toggle active tab buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.add('active'); // Safely add
                button.classList.add('active');

                // Toggle active panels
                tabPanels.forEach(panel => {
                    if (panel.id === target) {
                        panel.classList.add('active');
                    } else {
                        panel.classList.remove('active');
                    }
                });
            });
        });
    }

    /* ==========================================================================
       3. Address Source Tab Panel Toggler
       ========================================================================== */
    const locGoogleBtn = document.getElementById('locGoogleBtn');
    const locPractoBtn = document.getElementById('locPractoBtn');
    const locGooglePanel = document.getElementById('locGooglePanel');
    const locPractoPanel = document.getElementById('locPractoPanel');

    if (locGoogleBtn && locPractoBtn && locGooglePanel && locPractoPanel) {
        locGoogleBtn.addEventListener('click', () => {
            locGoogleBtn.classList.add('active');
            locPractoBtn.classList.remove('active');
            locGooglePanel.classList.add('active');
            locPractoPanel.classList.remove('active');
        });

        locPractoBtn.addEventListener('click', () => {
            locPractoBtn.classList.add('active');
            locGoogleBtn.classList.remove('active');
            locPractoPanel.classList.add('active');
            locGooglePanel.classList.remove('active');
        });
    }

    /* ==========================================================================
       4. Auto-Scroll and Select Service Event Handler
       ========================================================================== */
    const serviceTriggers = document.querySelectorAll('.service-book-trigger');
    const serviceDropdown = document.getElementById('formService');

    if (serviceTriggers.length > 0 && serviceDropdown) {
        serviceTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const serviceValue = trigger.getAttribute('data-service');
                
                // Select value in select options
                let found = false;
                for (let option of serviceDropdown.options) {
                    if (option.value.toLowerCase().includes(serviceValue.toLowerCase()) || 
                        serviceValue.toLowerCase().includes(option.value.toLowerCase())) {
                        serviceDropdown.value = option.value;
                        found = true;
                        break;
                    }
                }
                
                // Fallback to custom selected if exact option not mapped
                if (!found && serviceDropdown.querySelector(`option[value="${serviceValue}"]`)) {
                    serviceDropdown.value = serviceValue;
                }

                // Smooth scroll to booking container card
                const bookingSection = document.getElementById('book');
                if (bookingSection) {
                    bookingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // Add subtle glow outline to the form container to prompt user
                    const bookingCard = document.getElementById('bookingCard');
                    if (bookingCard) {
                        bookingCard.style.outline = '3px solid var(--color-primary)';
                        bookingCard.style.transition = 'outline 0.3s ease';
                        setTimeout(() => {
                            bookingCard.style.outline = 'none';
                        }, 2000);
                    }
                }
            });
        });
    }

    /* ==========================================================================
       5. Dynamic WhatsApp Booking Compiler
       ========================================================================== */
    const whatsappForm = document.getElementById('whatsappForm');

    if (whatsappForm) {
        // Set default appointment date to tomorrow
        const dateInput = document.getElementById('formDate');
        if (dateInput) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const yyyy = tomorrow.getFullYear();
            let mm = tomorrow.getMonth() + 1;
            let dd = tomorrow.getDate();
            if (mm < 10) mm = '0' + mm;
            if (dd < 10) dd = '0' + dd;
            dateInput.value = `${yyyy}-${mm}-${dd}`;
            dateInput.min = `${yyyy}-${mm}-${dd}`; // Restrict past bookings
        }

        whatsappForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Retrieve values
            const name = document.getElementById('formName').value.trim();
            const phone = document.getElementById('formPhone').value.trim();
            const service = document.getElementById('formService').value;
            const date = document.getElementById('formDate').value;
            const notes = document.getElementById('formNotes').value.trim();

            if (!name || !phone) {
                alert('Please complete the mandatory Patient Name and Phone fields.');
                return;
            }

            // Create highly structured clinical WhatsApp message string
            let message = `*Vutukuri Health Clinic Booking Request*\n`;
            message += `--------------------------------------\n`;
            message += `*Patient Name:* ${name}\n`;
            message += `*Contact Number:* ${phone}\n`;
            message += `*Requested Service:* ${service}\n`;
            message += `*Preferred Date:* ${date}\n`;
            if (notes) {
                message += `*Symptoms/Notes:* ${notes}\n`;
            }
            message += `--------------------------------------\n`;
            message += `_Note: I understand timings vary across online listings. I will call to verify availability before entering._`;

            // Standard Indian dialing code prefix 91 + primary phone 9701692204
            const whatsappNumber = '919701692204';
            const encodedMessage = encodeURIComponent(message);
            const waURL = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

            // Redirect user in a new secure window
            window.open(waURL, '_blank');
        });
    }

    /* ==========================================================================
       6. Authentic Clinic Photo Tour Lightbox Gallery Viewer
       ========================================================================== */
    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentImgIndex = 0;
    const galleryImagesArray = [];

    // Extract paths and captions from HTML elements
    galleryItems.forEach((item, index) => {
        const imgEl = item.querySelector('.gallery-img');
        const captionText = imgEl ? imgEl.getAttribute('alt') : 'Vutukuri Health Clinic Setup';
        const imagePath = item.getAttribute('data-image');

        galleryImagesArray.push({
            path: imagePath,
            caption: captionText
        });

        // Trigger open on click
        item.addEventListener('click', () => {
            currentImgIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        if (!lightboxModal || !lightboxImg || !lightboxCaption) return;
        
        updateLightboxContent();
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Stop background scroll
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto'; // Restore scroll
    }

    function updateLightboxContent() {
        const imgData = galleryImagesArray[currentImgIndex];
        if (imgData && lightboxImg && lightboxCaption) {
            lightboxImg.src = imgData.path;
            lightboxImg.alt = imgData.caption;
            lightboxCaption.textContent = imgData.caption;
        }
    }

    function navigatePrev() {
        currentImgIndex = (currentImgIndex - 1 + galleryImagesArray.length) % galleryImagesArray.length;
        updateLightboxContent();
    }

    function navigateNext() {
        currentImgIndex = (currentImgIndex + 1) % galleryImagesArray.length;
        updateLightboxContent();
    }

    // Lightbox Control Bindings
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', navigatePrev);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', navigateNext);
    }

    // Modal Background click to close
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Keyboard bindings for high-grade web accessibility
    document.addEventListener('keydown', (e) => {
        if (lightboxModal && lightboxModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigatePrev();
            } else if (e.key === 'ArrowRight') {
                navigateNext();
            }
        }
    });

    /* ==========================================================================
       7. Local Customer Review Submission & Grid Addition
       ========================================================================== */
    const toggleReviewFormBtn = document.getElementById('toggleReviewFormBtn');
    const reviewFormContainer = document.getElementById('reviewFormContainer');
    const customerReviewForm = document.getElementById('customerReviewForm');
    const reviewsGrid = document.querySelector('.reviews-grid');

    if (toggleReviewFormBtn && reviewFormContainer) {
        toggleReviewFormBtn.addEventListener('click', () => {
            if (reviewFormContainer.style.display === 'none' || !reviewFormContainer.style.display) {
                reviewFormContainer.style.display = 'block';
                toggleReviewFormBtn.textContent = 'Close Review Form';
                reviewFormContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                reviewFormContainer.style.display = 'none';
                toggleReviewFormBtn.textContent = 'Write a Local Review';
            }
        });
    }

    if (customerReviewForm && reviewsGrid) {
        customerReviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('revName').value.trim();
            const rating = parseInt(document.getElementById('revRating').value);
            const body = document.getElementById('revBody').value.trim();

            if (!name || !body) return;

            // Generate initial letters for avatar
            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

            // Stars string builder
            const starsStr = '★'.repeat(rating) + '☆'.repeat(5 - rating);

            // Create new review card
            const newCard = document.createElement('div');
            newCard.className = 'review-card depth-2';
            newCard.style.animation = 'fade-in-panel 0.5s ease forwards';
            newCard.innerHTML = `
                <div class="review-header">
                    <div class="review-avatar" style="background-color: var(--color-primary);">${initials}</div>
                    <div class="review-meta">
                        <h4>${name}</h4>
                        <span class="review-source">Local Customer Review</span>
                    </div>
                    <div class="review-stars">${starsStr}</div>
                </div>
                <p class="review-body">
                    "${body}"
                </p>
            `;

            // Prepend new review card to reviews grid
            reviewsGrid.insertBefore(newCard, reviewsGrid.firstChild);

            // Reset form and collapse container
            customerReviewForm.reset();
            reviewFormContainer.style.display = 'none';
            if (toggleReviewFormBtn) toggleReviewFormBtn.textContent = 'Write a Local Review';

            // Scroll reviews grid back into view smoothly
            reviewsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

});
