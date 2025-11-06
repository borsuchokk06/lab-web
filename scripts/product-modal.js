// Функциональность модального окна товара
(function() {
    'use strict';

    // Элементы DOM
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

    // Проверить, существует ли модальное окно
    if (!modal) {
        console.warn('Product modal not found');
        return;
    }

    // Данные текущего товара
    let currentProduct = null;

    /**
     * Открыть модальное окно с данными товара
     */
    function openModal(productData) {
        console.log('Opening modal with product:', productData);
        
        if (!productData) {
            console.error('No product data provided');
            return;
        }

        currentProduct = productData;

        // Заполнить модальное окно данными товара
        modalImage.src = productData.image || '';
        modalImage.alt = productData.name || '';
        modalTitle.textContent = productData.name || '';
        modalCategory.textContent = productData.category || '';
        modalDescription.textContent = productData.description || '';
        modalPrice.textContent = `$${productData.price || 0}`;
        modalReviews.textContent = `${productData.reviews || 0} Reviews`;

        // Установить бейдж
        if (productData.badge) {
            modalBadge.textContent = productData.badge;
            modalBadge.className = 'modal-badge ' + productData.badge.toLowerCase();
        } else {
            modalBadge.className = 'modal-badge';
        }

        // Установить статус наличия
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

        // Установить изображения галереи (то же изображение для демо, могут быть разные изображения)
        galleryThumbs.forEach((thumb, index) => {
            thumb.src = productData.image || '';
            thumb.alt = `${productData.name} view ${index + 1}`;
        });

        // Сбросить количество
        qtyInput.value = 1;

        // Показать модальное окно
        modal.classList.add('active');
        document.body.classList.add('modal-open');

        // Сохранить текущую позицию прокрутки
        const scrollY = window.scrollY;
        document.body.style.top = `-${scrollY}px`;
    }

    /**
     * Закрыть модальное окно
     */
    function closeModal() {
        console.log('Закрытие модального окна');
        
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');

        // Восстановить позицию прокрутки
        const scrollY = document.body.style.top;
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);

        currentProduct = null;
    }

    // ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================

    // Закрыть модальное окно по клику на кнопку закрытия
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Закрыть модальное окно по клику на оверлей
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Закрыть модальное окно нажатием Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Клик по миниатюре галереи
    galleryThumbs.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Удалить активный класс со всех миниатюр
            galleryThumbs.forEach(t => t.classList.remove('active'));
            // Добавить активный класс к нажатой миниатюре
            this.classList.add('active');
            // Обновить основное изображение
            modalImage.src = this.src;
        });
    });

    // Элементы управления количеством
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

    // Валидация ввода количества
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

    // Кнопка добавления в корзину
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function() {
            const quantity = parseInt(qtyInput.value) || 1;
            
            if (currentProduct) {
                console.log('Добавление в корзину:', {
                    product: currentProduct,
                    quantity: quantity
                });
                
                // Показать уведомление вместо alert
                if (typeof notifyProductAdded === 'function') {
                    notifyProductAdded(currentProduct.name, quantity, currentProduct.image);
                } else {
                    alert(`Добавлено ${quantity} x ${currentProduct.name} в корзину!`);
                }
                
                closeModal();
            }
        });
    }

    // ==================== ПРИВЯЗКА К КАРТОЧКАМ ТОВАРОВ ====================

    /**
     * Привязать модальное окно к карточкам товаров
     */
    function attachModalToCards() {
        // Для страницы каталога - динамически сгенерированные карточки
        document.addEventListener('click', function(e) {
            const card = e.target.closest('.product-catalog-card');
            if (card && !e.target.closest('.product-catalog-card-button')) {
                // Извлечь данные товара из карточки
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

        // Для главной страницы - карточки слайдера
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

        // Для главной страницы - карточки секций
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

    // Инициализировать при готовности DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachModalToCards);
    } else {
        attachModalToCards();
    }

    // Повторно привязать после загрузки динамического контента (для страницы каталога)
    setTimeout(attachModalToCards, 1000);

    // Экспорт функции для внешнего использования
    window.openProductModal = openModal;
    window.closeProductModal = closeModal;

    console.log('Модальное окно товара успешно инициализировано!');

})();

