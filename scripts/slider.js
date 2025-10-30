// Slider initialization
// Используем Swiper.js - библиотека с открытым исходным кодом (без jQuery)
// GitHub: https://github.com/nolimits4web/swiper
// Лицензия: MIT

document.addEventListener('DOMContentLoaded', function() {
    
    // ==================== HERO SLIDER (Home Page) ====================
    const heroSwiperElement = document.querySelector('.hero-swiper');
    
    if (heroSwiperElement) {
        const heroSwiper = new Swiper('.hero-swiper', {
            // Основные параметры
            loop: true, // Бесконечная прокрутка
            autoplay: {
                delay: 4000, // Автоматическое переключение каждые 4 секунды
                disableOnInteraction: false, // Продолжить автопрокрутку после взаимодействия
                pauseOnMouseEnter: true, // Пауза при наведении мыши
            },
            speed: 800, // Скорость перехода между слайдами (мс)
            
            // Эффект перехода
            effect: 'slide', // Можно использовать: 'slide', 'fade', 'cube', 'coverflow', 'flip'
            
            // Навигация
            navigation: {
                nextEl: '.hero-swiper .swiper-button-next',
                prevEl: '.hero-swiper .swiper-button-prev',
            },
            
            // Пагинация
            pagination: {
                el: '.hero-swiper .swiper-pagination',
                clickable: true, // Кликабельные точки пагинации
                dynamicBullets: true, // Динамические буллеты
            },
            
            // Клавиатурное управление
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            
            // Управление мышью (drag)
            mousewheel: false, // Отключить прокрутку колесом мыши
            
            // Accessibility
            a11y: {
                enabled: true,
                prevSlideMessage: 'Previous slide',
                nextSlideMessage: 'Next slide',
            },
            
            // Анимации при смене слайда
            on: {
                slideChange: function () {
                    console.log('Hero slider: slide changed to index', this.activeIndex);
                },
                init: function() {
                    console.log('Hero slider initialized!');
                }
            }
        });
    }
    
    // ==================== PRODUCT SLIDER (Catalog Page) ====================
    const productSwiperElement = document.querySelector('.product-swiper');
    
    if (productSwiperElement) {
        const productSwiper = new Swiper('.product-swiper', {
            // Основные параметры
            loop: true, // Бесконечная прокрутка
            autoplay: {
                delay: 3500, // Автоматическое переключение каждые 3.5 секунды
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            speed: 600,
            
            // Количество слайдов
            slidesPerView: 1, // По умолчанию 1 слайд (мобильные)
            spaceBetween: 30, // Расстояние между слайдами
            
            // Навигация
            navigation: {
                nextEl: '.product-swiper .swiper-button-next',
                prevEl: '.product-swiper .swiper-button-prev',
            },
            
            // Пагинация
            pagination: {
                el: '.product-swiper .swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            
            // Клавиатурное управление
            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },
            
            // Центрирование активного слайда
            centeredSlides: false,
            
            // Grab cursor
            grabCursor: true,
            
            // Адаптивные breakpoints
            breakpoints: {
                // Когда ширина >= 640px
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                // Когда ширина >= 768px
                768: {
                    slidesPerView: 2,
                    spaceBetween: 25,
                },
                // Когда ширина >= 1024px
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                },
                // Когда ширина >= 1280px
                1280: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                },
            },
            
            // Анимации
            on: {
                slideChange: function () {
                    console.log('Product slider: slide changed to index', this.activeIndex);
                },
                init: function() {
                    console.log('Product slider initialized!');
                }
            }
        });
    }
    
    // ==================== ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ ====================
    
    // Пауза автопрокрутки при переходе на другую вкладку
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Вкладка неактивна - остановить автопрокрутку
            if (heroSwiperElement && heroSwiper) {
                heroSwiper.autoplay.stop();
            }
            if (productSwiperElement && productSwiper) {
                productSwiper.autoplay.stop();
            }
        } else {
            // Вкладка активна - возобновить автопрокрутку
            if (heroSwiperElement && heroSwiper) {
                heroSwiper.autoplay.start();
            }
            if (productSwiperElement && productSwiper) {
                productSwiper.autoplay.start();
            }
        }
    });
    
    // Обработка кликов на кнопки "Add to Cart" в слайдере
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('product-slide-btn')) {
            e.preventDefault();
            alert('Product added to cart!');
        }
    });
    
});

// Экспорт для использования в других модулях (если нужно)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Swiper };
}

