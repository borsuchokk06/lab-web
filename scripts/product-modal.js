// Product Modal Functionality
(function() {
    'use strict';

    // DOM Elements
    const modal = document.getElementById('product-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalImage = document.getElementById('modal-image');
    const modalBadge = document.getElementById('modal-badge');
    const modalCategory = document.getElementById('modal-category');
    const modalTitle = document.getElementById('modal-title');
    const modalReviews = document.getElementById('modal-reviews');
    const modalDescription = document.getElementById('modal-description');
    const modalPrice = document.getElementById('modal-price');
    const modalStock = document.getElementById('modal-stock');
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const qtyInput = document.getElementById('qty-input');
    const addToCartBtn = document.getElementById('modal-add-to-cart');
    const galleryThumbs = document.querySelectorAll('.modal-gallery-thumb');

    // Check if modal exists
    if (!modal) {
        console.warn('Product modal not found');
        return;
    }

    // Current product data
    let currentProduct = null;

    /**
     * Open modal with product data
     */
    function openModal(productData) {
        console.log('Opening modal with product:', productData);
        
        if (!productData) {
            console.error('No product data provided');
            return;
        }

        currentProduct = productData;

        // Fill modal with product data
        modalImage.src = productData.image || '';
        modalImage.alt = productData.name || '';
        modalTitle.textContent = productData.name || '';
        modalCategory.textContent = productData.category || '';
        modalDescription.textContent = productData.description || '';
        modalPrice.textContent = `$${productData.price || 0}`;
        modalReviews.textContent = `${productData.reviews || 0} Reviews`;

        // Set badge
        if (productData.badge) {
            modalBadge.textContent = productData.badge;
            modalBadge.className = 'modal-badge ' + productData.badge.toLowerCase();
        } else {
            modalBadge.className = 'modal-badge';
        }

        // Set stock status
        if (productData.stock) {
            modalStock.textContent = productData.stock;
            if (productData.stock === "In Stock") {
                modalStock.className = 'modal-stock in-stock';
            } else if (productData.stock === "Low Stock") {
                modalStock.className = 'modal-stock low-stock';
            } else {
                modalStock.className = 'modal-stock out-of-stock';
            }
        }

        // Set gallery images (same image for demo, can be different images)
        galleryThumbs.forEach((thumb, index) => {
            thumb.src = productData.image || '';
            thumb.alt = `${productData.name} view ${index + 1}`;
        });

        // Reset quantity
        qtyInput.value = 1;

        // Show modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');

        // Save current scroll position
        const scrollY = window.scrollY;
        document.body.style.top = `-${scrollY}px`;
    }

    /**
     * Close modal
     */
    function closeModal() {
        console.log('Closing modal');
        
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');

        // Restore scroll position
        const scrollY = document.body.style.top;
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);

        currentProduct = null;
    }

    // ==================== EVENT LISTENERS ====================

    // Close modal by clicking close button
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close modal by clicking overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close modal by pressing Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Gallery thumbnail click
    galleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            galleryThumbs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked thumbnail
            this.classList.add('active');
            // Update main image
            modalImage.src = this.src;
        });
    });

    // Quantity controls
    if (qtyMinus) {
        qtyMinus.addEventListener('click', function() {
            const currentValue = parseInt(qtyInput.value) || 1;
            if (currentValue > 1) {
                qtyInput.value = currentValue - 1;
            }
        });
    }

    if (qtyPlus) {
        qtyPlus.addEventListener('click', function() {
            const currentValue = parseInt(qtyInput.value) || 1;
            const max = parseInt(qtyInput.getAttribute('max')) || 10;
            if (currentValue < max) {
                qtyInput.value = currentValue + 1;
            }
        });
    }

    // Validate quantity input
    if (qtyInput) {
        qtyInput.addEventListener('change', function() {
            const value = parseInt(this.value) || 1;
            const min = parseInt(this.getAttribute('min')) || 1;
            const max = parseInt(this.getAttribute('max')) || 10;
            
            if (value < min) {
                this.value = min;
            } else if (value > max) {
                this.value = max;
            }
        });
    }

    // Add to cart button
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(qtyInput.value) || 1;
            
            if (currentProduct) {
                console.log('Adding to cart:', {
                    product: currentProduct,
                    quantity: quantity
                });
                
                // Show toast notification instead of alert
                if (typeof notifyProductAdded === 'function') {
                    notifyProductAdded(currentProduct.name, quantity, currentProduct.image);
                } else {
                    alert(`Added ${quantity} x ${currentProduct.name} to cart!`);
                }
                
                closeModal();
            }
        });
    }

    // ==================== ATTACH TO PRODUCT CARDS ====================

    /**
     * Attach modal to product cards
     */
    function attachModalToCards() {
        // For catalog page - dynamically generated cards
        document.addEventListener('click', function(e) {
            const card = e.target.closest('.product-catalog-card');
            if (card && !e.target.closest('.product-catalog-card-button')) {
                // Extract product data from card
                const productData = {
                    name: card.querySelector('.product-catalog-card-title')?.textContent || '',
                    category: card.querySelector('.product-catalog-card-category')?.textContent || '',
                    description: card.querySelector('.product-catalog-card-description')?.textContent || '',
                    price: card.querySelector('.product-catalog-card-price')?.textContent.replace('$', '') || '0',
                    image: card.querySelector('.product-catalog-card-image img')?.src || '',
                    reviews: card.querySelector('.product-catalog-card-reviews span')?.textContent.replace(' Reviews', '') || '0',
                    stock: card.querySelector('.product-catalog-card-stock')?.textContent || 'In Stock',
                    badge: card.querySelector('.product-badge')?.textContent || ''
                };
                
                openModal(productData);
            }
        });

        // For home page - slider cards
        document.addEventListener('click', function(e) {
            const slideCard = e.target.closest('.product-slide-card');
            if (slideCard && !e.target.closest('.product-slide-btn')) {
                const productData = {
                    name: slideCard.querySelector('.product-slide-info h4')?.textContent || '',
                    category: 'Audio Equipment',
                    description: 'Premium quality audio product with excellent sound and design',
                    price: slideCard.querySelector('.product-slide-price')?.textContent.replace('$', '') || '0',
                    image: slideCard.querySelector('.product-slide-image img')?.src || '',
                    reviews: slideCard.querySelector('.product-slide-rating span')?.textContent.replace(' Reviews', '') || '0',
                    stock: 'In Stock',
                    badge: slideCard.querySelector('.slide-badge')?.textContent || ''
                };
                
                openModal(productData);
            }
        });

        // For home page - section cards
        const section3Cards = document.querySelectorAll('.section3-slider-card');
        const section4Cards = document.querySelectorAll('.section4-slider-card');
        
        [...section3Cards, ...section4Cards].forEach(card => {
            const cardBlock = card.querySelector('.section3-slider-card-block, .section4-slider-card-block');
            if (cardBlock) {
                cardBlock.style.cursor = 'pointer';
                cardBlock.addEventListener('click', function(e) {
                    if (!e.target.closest('button')) {
                        const productData = {
                            name: card.querySelector('.section3-slider-card-block-text p, .section4-slider-card-block-text p')?.textContent || '',
                            category: 'Audio Equipment',
                            description: 'Premium quality audio product with excellent sound and comfort',
                            price: card.querySelector('.section3-slider-card-block-text b, .section4-slider-card-block-text b')?.textContent.replace('$', '') || '0',
                            image: cardBlock.querySelector('img')?.src || '',
                            reviews: card.querySelector('.section3-slider-card-block-text-rev p, .section4-slider-card-block-text-rev p')?.textContent.replace(' Reviews', '') || '0',
                            stock: 'In Stock',
                            badge: ''
                        };
                        
                        openModal(productData);
                    }
                });
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachModalToCards);
    } else {
        attachModalToCards();
    }

    // Re-attach after dynamic content loads (for catalog page)
    setTimeout(attachModalToCards, 1000);

    // Export function for external use
    window.openProductModal = openModal;
    window.closeProductModal = closeModal;

    console.log('Product modal initialized successfully!');

})();

