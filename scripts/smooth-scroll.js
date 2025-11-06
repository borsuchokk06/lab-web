// Плавная прокрутка к секциям
(function() {
    'use strict';

    // Конфигурация
    const scrollOffset = 80; // Смещение для фиксированного заголовка
    const scrollDuration = 1000; // Длительность анимации в мс

    /**
     * Плавная прокрутка к элементу
     */
    function smoothScrollTo(target, offset = scrollOffset) {
        const targetElement = document.querySelector(target);
        
        if (!targetElement) {
            console.warn('Scroll target not found:', target);
            return;
        }

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        // Функция плавности (easeInOutCubic)
        function easeInOutCubic(t) {
            return t < 0.5 
                ? 4 * t * t * t 
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        // Цикл анимации
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / scrollDuration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + distance * ease);

            if (timeElapsed < scrollDuration) {
                requestAnimationFrame(animation);
            } else {
                // Прокрутка завершена
                console.log('Прокручено к:', target);
                
                // Показать уведомление
                if (typeof toastInfo === 'function') {
                    const sectionName = target.replace('#', '').replace('-', ' ');
                    toastInfo('Секция', `Переход к ${sectionName}`, { duration: 2000 });
                }
            }
        }

        requestAnimationFrame(animation);
    }

    /**
     * Обработать клики по ссылкам навигации
     */
    function handleNavClick(e) {
        const href = this.getAttribute('href');
        
        // Обрабатывать только якорные ссылки (начинающиеся с #)
        if (href && href.startsWith('#')) {
            e.preventDefault();
            
            smoothScrollTo(href);
            
            // Закрыть мобильное меню, если открыто
            if (typeof closeMenu === 'function' || window.closeMenu) {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    setTimeout(() => {
                        if (typeof closeMenu !== 'undefined') {
                            closeMenu();
                        }
                    }, 300);
                }
            }

            // Обновить активное состояние
            updateActiveNavLink(href);
        }
    }

    /**
     * Обновить активную ссылку навигации
     */
    function updateActiveNavLink(target) {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === target) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Определить активную секцию при прокрутке
     */
    function detectActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        const scrollPosition = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Обновить активную ссылку
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ==================== КНОПКА "НАВЕРХ" ====================

    const backToTopBtn = document.getElementById('back-to-top');

    /**
     * Показать/скрыть кнопку "Наверх" в зависимости от позиции прокрутки
     */
    function toggleBackToTopButton() {
        if (!backToTopBtn) return;

        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    /**
     * Прокрутить наверх
     */
    function scrollToTop() {
        smoothScrollTo('#home', 0);
    }

    // ==================== ИНДИКАТОР ПРОГРЕССА ПРОКРУТКИ ====================

    const scrollProgressBar = document.getElementById('scroll-progress');

    /**
     * Обновить индикатор прогресса прокрутки
     */
    function updateScrollProgress() {
        if (!scrollProgressBar) return;

        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        
        scrollProgressBar.style.width = `${scrolled}%`;
    }

    // ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================

    document.addEventListener('DOMContentLoaded', function() {
        
        // Привязать плавную прокрутку ко всем ссылкам навигации
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });

        // Кнопка "Наверх"
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', scrollToTop);
        }

        // Обработчики событий прокрутки
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            // Ограничить частоту событий прокрутки
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                detectActiveSection();
                toggleBackToTopButton();
                updateScrollProgress();
            }, 100);
        });

        // Начальные проверки
        detectActiveSection();
        toggleBackToTopButton();
        updateScrollProgress();

        // Установить первую ссылку как активную изначально
        const firstNavLink = document.querySelector('.nav-link[href="#home"]');
        if (firstNavLink) {
            firstNavLink.classList.add('active');
        }

        console.log('Плавная прокрутка инициализирована!');
    });

    // ==================== ЭКСПОРТ В ГЛОБАЛЬНУЮ ОБЛАСТЬ ВИДИМОСТИ ====================

    window.smoothScrollTo = smoothScrollTo;
    window.scrollToTop = scrollToTop;

    console.log('Функциональность навигации прокрутки готова!');

})();

