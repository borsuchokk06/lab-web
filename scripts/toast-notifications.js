// Toast Notifications System
(function() {
    'use strict';

    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
        console.warn('Toast container not found');
        return;
    }

    // Toast icons for different types
    const toastIcons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
        cart: '🛒'
    };

    /**
     * Create and show a toast notification
     * @param {Object} options - Toast configuration
     * @param {string} options.type - Type of toast (success, error, warning, info, cart)
     * @param {string} options.title - Toast title
     * @param {string} options.message - Toast message
     * @param {number} options.duration - Duration in milliseconds (default: 4000)
     * @param {boolean} options.showProgress - Show progress bar (default: true)
     * @param {string} options.image - Optional product image URL
     */
    function showToast(options) {
        const {
            type = 'info',
            title = 'Notification',
            message = '',
            duration = 4000,
            showProgress = true,
            image = null
        } = options;

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}${image ? ' toast-with-image' : ''}`;

        // Set progress bar animation
        if (showProgress) {
            toast.style.setProperty('--duration', `${duration}ms`);
            toast.style.animation = `slideIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards`;
            const progressBar = document.createElement('div');
            progressBar.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                height: 4px;
                width: 100%;
                background: currentColor;
                transform-origin: left;
                animation: progress ${duration}ms linear;
            `;
        }

        // Build toast HTML
        let toastHTML = '';

        // Add product image if provided
        if (image) {
            toastHTML += `<img src="${image}" alt="Product" class="toast-product-image">`;
        }

        // Add icon
        toastHTML += `
            <div class="toast-icon">
                ${toastIcons[type] || toastIcons.info}
            </div>
        `;

        // Add content
        toastHTML += `
            <div class="toast-content">
                <h4 class="toast-title">${title}</h4>
                ${message ? `<p class="toast-message">${message}</p>` : ''}
            </div>
        `;

        // Add close button
        toastHTML += `
            <button class="toast-close" aria-label="Close notification">✕</button>
        `;

        toast.innerHTML = toastHTML;

        // Add to container
        toastContainer.appendChild(toast);

        // Close button handler
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => removeToast(toast));

        // Auto remove after duration
        const timeoutId = setTimeout(() => {
            removeToast(toast);
        }, duration);

        // Pause on hover
        toast.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
            toast.style.animationPlayState = 'paused';
        });

        toast.addEventListener('mouseleave', () => {
            setTimeout(() => removeToast(toast), 1000);
            toast.style.animationPlayState = 'running';
        });

        // Log to console
        console.log(`Toast shown: [${type.toUpperCase()}] ${title}`);
    }

    /**
     * Remove toast with animation
     */
    function removeToast(toast) {
        if (!toast || !toast.parentElement) return;
        
        toast.classList.add('removing');
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 300);
    }

    /**
     * Clear all toasts
     */
    function clearAllToasts() {
        const toasts = toastContainer.querySelectorAll('.toast');
        toasts.forEach(toast => removeToast(toast));
    }

    // ==================== PREDEFINED TOAST FUNCTIONS ====================

    /**
     * Show success toast
     */
    function showSuccess(title, message, options = {}) {
        showToast({
            type: 'success',
            title: title,
            message: message,
            ...options
        });
    }

    /**
     * Show error toast
     */
    function showError(title, message, options = {}) {
        showToast({
            type: 'error',
            title: title,
            message: message,
            duration: 5000, // Errors stay longer
            ...options
        });
    }

    /**
     * Show warning toast
     */
    function showWarning(title, message, options = {}) {
        showToast({
            type: 'warning',
            title: title,
            message: message,
            ...options
        });
    }

    /**
     * Show info toast
     */
    function showInfo(title, message, options = {}) {
        showToast({
            type: 'info',
            title: title,
            message: message,
            ...options
        });
    }

    /**
     * Show cart toast
     */
    function showCartNotification(title, message, productImage, options = {}) {
        showToast({
            type: 'cart',
            title: title,
            message: message,
            image: productImage,
            ...options
        });
    }

    // ==================== COMMON NOTIFICATIONS ====================

    /**
     * Product added to cart
     */
    function notifyProductAdded(productName, quantity = 1, productImage = null) {
        showCartNotification(
            'Added to Cart!',
            `${quantity}x ${productName}`,
            productImage,
            { duration: 3000 }
        );
    }

    /**
     * Product removed from cart
     */
    function notifyProductRemoved(productName) {
        showWarning(
            'Removed from Cart',
            `${productName} has been removed`,
            { duration: 3000 }
        );
    }

    /**
     * Purchase completed
     */
    function notifyPurchaseCompleted(orderNumber) {
        showSuccess(
            'Purchase Successful!',
            `Order #${orderNumber} has been placed`,
            { duration: 5000 }
        );
    }

    /**
     * Out of stock
     */
    function notifyOutOfStock(productName) {
        showError(
            'Out of Stock',
            `${productName} is currently unavailable`,
            { duration: 4000 }
        );
    }

    /**
     * Low stock warning
     */
    function notifyLowStock(productName, quantity) {
        showWarning(
            'Low Stock Warning',
            `Only ${quantity} items left for ${productName}`,
            { duration: 4000 }
        );
    }

    /**
     * Wishlist added
     */
    function notifyAddedToWishlist(productName) {
        showSuccess(
            'Added to Wishlist',
            `${productName} saved for later`,
            { duration: 3000 }
        );
    }

    /**
     * Saved preferences
     */
    function notifySaved(message = 'Changes saved successfully') {
        showSuccess(
            'Saved!',
            message,
            { duration: 2000 }
        );
    }

    /**
     * Error occurred
     */
    function notifyError(message = 'Something went wrong. Please try again.') {
        showError(
            'Error',
            message,
            { duration: 5000 }
        );
    }

    /**
     * Copied to clipboard
     */
    function notifyCopied(what = 'Link') {
        showInfo(
            'Copied!',
            `${what} copied to clipboard`,
            { duration: 2000 }
        );
    }

    /**
     * Login success
     */
    function notifyLoginSuccess(username) {
        showSuccess(
            'Welcome Back!',
            `Logged in as ${username}`,
            { duration: 3000 }
        );
    }

    /**
     * Logout
     */
    function notifyLogout() {
        showInfo(
            'Logged Out',
            'You have been successfully logged out',
            { duration: 3000 }
        );
    }

    // ==================== EXPORT TO GLOBAL SCOPE ====================

    // Main toast function
    window.showToast = showToast;
    window.clearAllToasts = clearAllToasts;
    
    // Type-specific functions
    window.toastSuccess = showSuccess;
    window.toastError = showError;
    window.toastWarning = showWarning;
    window.toastInfo = showInfo;
    
    // Common notifications
    window.notifyProductAdded = notifyProductAdded;
    window.notifyProductRemoved = notifyProductRemoved;
    window.notifyPurchaseCompleted = notifyPurchaseCompleted;
    window.notifyOutOfStock = notifyOutOfStock;
    window.notifyLowStock = notifyLowStock;
    window.notifyAddedToWishlist = notifyAddedToWishlist;
    window.notifySaved = notifySaved;
    window.notifyError = notifyError;
    window.notifyCopied = notifyCopied;
    window.notifyLoginSuccess = notifyLoginSuccess;
    window.notifyLogout = notifyLogout;

    console.log('Toast notification system initialized!');

})();

