// Система уведомлений
(function() {
    'use strict';

    const toastContainer = document.getElementById('toast-container');
    
    if (!toastContainer) {
        console.warn('Toast container not found');
        return;
    }

    // Иконки уведомлений для разных типов
    const toastIcons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
        cart: '🛒'
    };

    /**
     * Создать и показать уведомление
     * @param {Object} options - Конфигурация уведомления
     * @param {string} options.type - Тип уведомления (success, error, warning, info, cart)
     * @param {string} options.title - Заголовок уведомления
     * @param {string} options.message - Сообщение уведомления
     * @param {number} options.duration - Длительность в миллисекундах (по умолчанию: 4000)
     * @param {boolean} options.showProgress - Показать индикатор прогресса (по умолчанию: true)
     * @param {string} options.image - Необязательный URL изображения товара
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

        // Создать элемент уведомления
        const toast = document.createElement('div');
        toast.className = `toast ${type}${image ? ' toast-with-image' : ''}`;

        // Установить анимацию индикатора прогресса
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

        // Построить HTML уведомления
        let toastHTML = '';

        // Добавить изображение товара, если предоставлено
        if (image) {
            toastHTML += `<img src="${image}" alt="Товар" class="toast-product-image">`;
        }

        // Добавить иконку
        toastHTML += `
            <div class="toast-icon">
                ${toastIcons[type] || toastIcons.info}
            </div>
        `;

        // Добавить содержимое
        toastHTML += `
            <div class="toast-content">
                <h4 class="toast-title">${title}</h4>
                ${message ? `<p class="toast-message">${message}</p>` : ''}
            </div>
        `;

        // Добавить кнопку закрытия
        toastHTML += `
            <button class="toast-close" aria-label="Закрыть уведомление">✕</button>
        `;

        toast.innerHTML = toastHTML;

        // Добавить в контейнер
        toastContainer.appendChild(toast);

        // Обработчик кнопки закрытия
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => removeToast(toast));

        // Автоматическое удаление после длительности
        const timeoutId = setTimeout(() => {
            removeToast(toast);
        }, duration);

        // Пауза при наведении
        toast.addEventListener('mouseenter', () => {
            clearTimeout(timeoutId);
            toast.style.animationPlayState = 'paused';
        });

        toast.addEventListener('mouseleave', () => {
            setTimeout(() => removeToast(toast), 1000);
            toast.style.animationPlayState = 'running';
        });

        // Записать в консоль
        console.log(`Уведомление показано: [${type.toUpperCase()}] ${title}`);
    }

    /**
     * Удалить уведомление с анимацией
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
     * Очистить все уведомления
     */
    function clearAllToasts() {
        const toasts = toastContainer.querySelectorAll('.toast');
        toasts.forEach(toast => removeToast(toast));
    }

    // ==================== ПРЕДОПРЕДЕЛЕННЫЕ ФУНКЦИИ УВЕДОМЛЕНИЙ ====================

    /**
     * Показать уведомление об успехе
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
     * Показать уведомление об ошибке
     */
    function showError(title, message, options = {}) {
        showToast({
            type: 'error',
            title: title,
            message: message,
            duration: 5000, // Ошибки остаются дольше
            ...options
        });
    }

    /**
     * Показать предупреждающее уведомление
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
     * Показать информационное уведомление
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
     * Показать уведомление корзины
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

    // ==================== ОБЩИЕ УВЕДОМЛЕНИЯ ====================

    /**
     * Товар добавлен в корзину
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
     * Товар удален из корзины
     */
    function notifyProductRemoved(productName) {
        showWarning(
            'Removed from Cart',
            `${productName} has been removed`,
            { duration: 3000 }
        );
    }

    /**
     * Покупка завершена
     */
    function notifyPurchaseCompleted(orderNumber) {
        showSuccess(
            'Purchase Successful!',
            `Order #${orderNumber} has been placed`,
            { duration: 5000 }
        );
    }

    /**
     * Нет в наличии
     */
    function notifyOutOfStock(productName) {
        showError(
            'Out of Stock',
            `${productName} is currently unavailable`,
            { duration: 4000 }
        );
    }

    /**
     * Предупреждение о низком запасе
     */
    function notifyLowStock(productName, quantity) {
        showWarning(
            'Low Stock Warning',
            `Only ${quantity} items left for ${productName}`,
            { duration: 4000 }
        );
    }

    /**
     * Добавлено в список желаний
     */
    function notifyAddedToWishlist(productName) {
        showSuccess(
            'Added to Wishlist',
            `${productName} saved for later`,
            { duration: 3000 }
        );
    }

    /**
     * Сохранены настройки
     */
    function notifySaved(message = 'Changes saved successfully') {
        showSuccess(
            'Saved!',
            message,
            { duration: 2000 }
        );
    }

    /**
     * Произошла ошибка
     */
    function notifyError(message = 'Something went wrong. Please try again.') {
        showError(
            'Error',
            message,
            { duration: 5000 }
        );
    }

    /**
     * Скопировано в буфер обмена
     */
    function notifyCopied(what = 'Link') {
        showInfo(
            'Copied!',
            `${what} copied to clipboard`,
            { duration: 2000 }
        );
    }

    /**
     * Успешный вход
     */
    function notifyLoginSuccess(username) {
        showSuccess(
            'Welcome Back!',
            `Logged in as ${username}`,
            { duration: 3000 }
        );
    }

    /**
     * Выход
     */
    function notifyLogout() {
        showInfo(
            'Logged Out',
            'You have been successfully logged out',
            { duration: 3000 }
        );
    }

    // ==================== ЭКСПОРТ В ГЛОБАЛЬНУЮ ОБЛАСТЬ ВИДИМОСТИ ====================

    // Основная функция уведомлений
    window.showToast = showToast;
    window.clearAllToasts = clearAllToasts;
    
    // Функции для конкретных типов
    window.toastSuccess = showSuccess;
    window.toastError = showError;
    window.toastWarning = showWarning;
    window.toastInfo = showInfo;
    
    // Общие уведомления
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

    console.log('Система уведомлений инициализирована!');

})();

