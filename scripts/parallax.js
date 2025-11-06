// Скрипт эффекта параллакса
(function() {
    'use strict';

    // Пропустить параллакс, если пользователь предпочитает уменьшенное движение
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        console.log('Parallax disabled (prefers-reduced-motion)');
        return;
    }

    let ticking = false;
    let lastScrollY = window.pageYOffset;

    // Кэширование элементов параллакса
    const section = document.querySelector('.parallax-section');
    if (!section) {
        console.warn('Parallax section not found');
        return;
    }

    // Слои (обертки)
    const layers = section.querySelectorAll('.parallax-layer');
    // Отдельные элементы со скоростью
    const elements = section.querySelectorAll('[data-parallax-speed]');

    function onScroll() {
        lastScrollY = window.pageYOffset;
        requestTick();
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(update);
        }
        ticking = true;
    }

    function update() {
        ticking = false;

        // Получить границы секции для создания локального параллакса относительно секции
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.pageYOffset;
        const relativeY = lastScrollY - sectionTop; // смещение прокрутки относительно секции

        // Обновить смещения слоев (медленнее для фона, быстрее для переднего плана)
        layers.forEach(layer => {
            const speedAttr = layer.getAttribute('data-parallax-speed');
            const speed = speedAttr ? parseFloat(speedAttr) : 0.5;
            const translateY = -relativeY * speed * 0.2; // коэффициент смягчения движения
            layer.style.transform = `translate3d(0, ${translateY}px, 0)`;
        });

        // Обновить отдельные элементы (включая обратное движение с отрицательной скоростью)
        elements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.5;
            // Обрабатывать только элементы внутри секции параллакса
            if (!section.contains(el)) return;

            // Вычислить движение элемента
            const moveY = -relativeY * speed * 0.3; // коэффициент движения элемента
            el.style.transform = `translate3d(0, ${moveY}px, 0)`;
        });
    }

    // Обработка видимости, чтобы избежать работы во вкладках в фоне
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            requestTick();
        }
    });

    // Обработка изменения размера (пересчет позиций)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            requestTick();
        }, 150);
    });

    // Начальный запуск
    window.addEventListener('scroll', onScroll, { passive: true });
    requestTick();

    console.log('Параллакс инициализирован');
})();
