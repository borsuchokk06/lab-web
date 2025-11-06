// Функциональность бургер-меню
(function() {
    'use strict';

    // Элементы DOM
    const burgerBtn = document.getElementById('burger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileCloseBtn = document.getElementById('mobile-close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

    // Проверка наличия элементов
    if (!burgerBtn || !mobileMenu || !mobileOverlay) {
        console.warn('Burger menu elements not found');
        return;
    }

    /**
     * Открыть мобильное меню
     */
    function openMenu() {
        console.log('Opening mobile menu...');
        
        // Добавляем активные классы
        burgerBtn.classList.add('active');
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        
        // Блокируем прокрутку страницы
        document.body.classList.add('menu-open');
        
        // Устанавливаем фокус на меню для accessibility
        mobileMenu.focus();
        
        // Сохраняем текущую позицию прокрутки
        const scrollY = window.scrollY;
        document.body.style.top = `-${scrollY}px`;
    }

    /**
     * Закрыть мобильное меню
     */
    function closeMenu() {
        console.log('Closing mobile menu...');
        
        // Удаляем активные классы
        burgerBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        
        // Разблокируем прокрутку страницы
        document.body.classList.remove('menu-open');
        
        // Восстанавливаем позицию прокрутки
        const scrollY = document.body.style.top;
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    /**
     * Переключить состояние меню
     */
    function toggleMenu() {
        if (mobileMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================

    // 1. Клик по кнопке бургера
    burgerBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    // 2. Клик по кнопке закрытия
    if (mobileCloseBtn) {
        mobileCloseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeMenu();
        });
    }

    // 3. Клик по затемненной области (overlay)
    mobileOverlay.addEventListener('click', function(e) {
        if (e.target === mobileOverlay) {
            closeMenu();
        }
    });

    // 4. Клик по ссылкам в меню - закрываем меню
    mobileMenuLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            console.log('Menu link clicked, closing menu...');
            
            // Если это якорная ссылка (плавная прокрутка), закрываем меню с задержкой
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                // Небольшая задержка для плавности
                setTimeout(closeMenu, 300);
            } else {
                // Внешняя ссылка - закрываем сразу
                setTimeout(closeMenu, 100);
            }
        });
    });

    // 5. Закрытие меню при клике вне его области
    document.addEventListener('click', function(e) {
        if (mobileMenu.classList.contains('active')) {
            // Проверяем, что клик был не по меню и не по кнопке бургера
            if (!mobileMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
                closeMenu();
            }
        }
    });

    // 6. Закрытие меню клавишей Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // 7. Закрытие меню при изменении размера окна (если становится desktop)
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Если ширина больше 1024px и меню открыто - закрываем
            if (window.innerWidth > 1024 && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        }, 250);
    });

    // 8. Предотвращаем прокрутку при открытом меню
    mobileMenu.addEventListener('touchmove', function(e) {
        e.stopPropagation();
    }, { passive: false });

    // 9. Обработка свайпов для закрытия меню
    let touchStartX = 0;
    let touchEndX = 0;

    mobileMenu.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    mobileMenu.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 100; // минимальное расстояние свайпа
        
        // Свайп вправо (для закрытия меню, которое выезжает справа)
        if (touchEndX - touchStartX > swipeThreshold) {
            closeMenu();
        }
    }

    // ==================== ДОСТУПНОСТЬ ====================

    // Управление фокусом в меню
    mobileMenu.addEventListener('keydown', function(e) {
        const focusableElements = mobileMenu.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        // Навигация с помощью Tab
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });

    // Сохраняем элемент, который был в фокусе до открытия меню
    let lastFocusedElement;
    
    burgerBtn.addEventListener('click', function() {
        if (!mobileMenu.classList.contains('active')) {
            lastFocusedElement = document.activeElement;
        }
    });

    // Восстанавливаем фокус после закрытия меню
    mobileOverlay.addEventListener('transitionend', function() {
        if (!mobileOverlay.classList.contains('active') && lastFocusedElement) {
            lastFocusedElement.focus();
        }
    });

    // ==================== ИНИЦИАЛИЗАЦИЯ ====================
    
    console.log('Бургер-меню успешно инициализировано!');
    
    // Проверяем, открыто ли меню при загрузке (не должно быть)
    if (mobileMenu.classList.contains('active')) {
        closeMenu();
    }

})();

