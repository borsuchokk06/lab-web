// Анимации прокрутки с Intersection Observer
(function() {
    'use strict';

    // Конфигурация
    const animationConfig = {
        threshold: 0.15,        // 15% видимости элемента запускает анимацию
        rootMargin: '0px 0px -50px 0px'
    };

    let countersAnimated = false;

    // ==================== INTERSECTION OBSERVER ДЛЯ АНИМАЦИЙ ПРОКРУТКИ ====================

    /**
     * Инициализировать Intersection Observer для анимаций прокрутки
     */
    function initScrollAnimations() {
        // Проверить, поддерживается ли Intersection Observer
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver не поддерживается, анимации отключены');
            // Резервный вариант: показать все элементы сразу
            document.querySelectorAll('.scroll-animate').forEach(el => {
                el.classList.add('animated');
            });
            return;
        }

        // Создать наблюдатель
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Элемент виден
                    entry.target.classList.add('animated');
                    
                    // Опционально: прекратить наблюдение после анимации (одноразовая анимация)
                    // observer.unobserve(entry.target);
                }
            });
        }, animationConfig);

        // Наблюдать за всеми элементами с классом scroll-animate
        const animatedElements = document.querySelectorAll('.scroll-animate');
        animatedElements.forEach(element => {
            observer.observe(element);
        });

        console.log(`Observing ${animatedElements.length} elements for scroll animations`);
    }

    // ==================== АНИМИРОВАННЫЕ СЧЕТЧИКИ ====================

    /**
     * Анимировать счетчик от 0 до целевого значения
     */
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(current));
            }
        }, 16);
    }

    /**
     * Форматировать число с запятыми
     */
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /**
     * Инициализировать счетчики
     */
    function initCounters() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    
                    // Анимировать все числа статистики
                    const statNumbers = document.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.dataset.count) || 0;
                        animateCounter(stat, target, 2000);
                    });

                    // Показать уведомление
                    if (typeof toastSuccess === 'function') {
                        setTimeout(() => {
                            toastSuccess('Потрясающая статистика!', 'Мы гордимся нашими достижениями', { duration: 3000 });
                        }, 1000);
                    }
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            counterObserver.observe(statsSection);
        }
    }

    // ==================== ФОН ЗАГОЛОВКА ПРИ ПРОКРУТКЕ ====================

    /**
     * Изменить фон заголовка при прокрутке
     */
    function handleHeaderScroll() {
        const header = document.querySelector('header');
        if (!header) return;

        if (window.pageYOffset > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ==================== ЭФФЕКТ ПАРАЛЛАКСА ====================

    /**
     * Применить эффект параллакса к элементам
     */
    function handleParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const rect = element.getBoundingClientRect();
            
            // Применять параллакс только если элемент в области просмотра
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = -(window.pageYOffset * speed);
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    // ==================== АНИМАЦИИ ПОЯВЛЕНИЯ КАРТОЧЕК ====================

    /**
     * Анимировать карточки товаров при прокрутке
     */
    function initCardAnimations() {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.2 });

        // Наблюдать за карточками секций 3 и 4
        const section3Cards = document.querySelectorAll('.section3-slider-card');
        const section4Cards = document.querySelectorAll('.section4-slider-card');
        
        [...section3Cards, ...section4Cards].forEach(card => {
            cardObserver.observe(card);
        });

        // Наблюдать за карточками магазинов
        const storeCards = document.querySelectorAll('.store-card');
        storeCards.forEach(card => {
            cardObserver.observe(card);
        });

        // Наблюдать за миниатюрами галереи
        const galleryThumbs = document.querySelectorAll('.gallery-thumb');
        galleryThumbs.forEach(thumb => {
            cardObserver.observe(thumb);
        });
    }

    // ==================== ИЗМЕНЕНИЕ ЦВЕТА ФОНА ПРИ ПРОКРУТКЕ ====================

    /**
     * Изменить цвета фона секций при прокрутке
     */
    function handleBackgroundChange() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + window.innerHeight / 2;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const sectionId = section.getAttribute('id');
                document.body.setAttribute('data-active-section', sectionId);
            }
        });
    }

    // ==================== ПОЯВЛЕНИЕ ПРИ ПРОКРУТКЕ ДЛЯ СТРАНИЦЫ КАТАЛОГА ====================

    /**
     * Показать карточки каталога при прокрутке
     */
    function initCatalogAnimations() {
        const catalogCards = document.querySelectorAll('.product-catalog-card');
        
        if (catalogCards.length === 0) return;

        const catalogObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        catalogCards.forEach((card, index) => {
            // Начальное состояние
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.6s ease ${index * 0.05}s`;
            
            catalogObserver.observe(card);
        });
    }

    // ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================

    document.addEventListener('DOMContentLoaded', function() {
        
        // Инициализировать все анимации
        initScrollAnimations();
        initCounters();
        initCardAnimations();
        initCatalogAnimations();

        // Эффект прокрутки заголовка
        window.addEventListener('scroll', handleHeaderScroll);
        handleHeaderScroll(); // Начальная проверка

        // Изменение фона при прокрутке
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                handleBackgroundChange();
                handleParallax();
            }, 50);
        });

        // Начальная проверка фона
        handleBackgroundChange();

        console.log('Анимации прокрутки инициализированы!');
    });

    // ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

    /**
     * Добавить анимацию к элементу программно
     */
    function addScrollAnimation(element, animationType) {
        element.classList.add('scroll-animate');
        element.setAttribute('data-animation', animationType);
    }

    /**
     * Запустить анимацию вручную
     */
    function triggerAnimation(element) {
        element.classList.add('animated');
    }

    /**
     * Сбросить анимацию (для повторного воспроизведения)
     */
    function resetAnimation(element) {
        element.classList.remove('animated');
        // Принудительный пересчет
        void element.offsetWidth;
        element.classList.add('animated');
    }

    // ==================== ЭКСПОРТ В ГЛОБАЛЬНУЮ ОБЛАСТЬ ВИДИМОСТИ ====================

    window.addScrollAnimation = addScrollAnimation;
    window.triggerAnimation = triggerAnimation;
    window.resetAnimation = resetAnimation;

    console.log('Система анимаций прокрутки готова!');

})();

