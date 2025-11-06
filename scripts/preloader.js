// Функциональность прелоадера
(function() {
    'use strict';

    // Блокировка прокрутки при активном прелоадере
    document.body.classList.add('preloader-active');

    // Функция скрытия прелоадера
    function hidePreloader() {
        const preloader = document.getElementById('preloader');
        
        if (preloader) {
            console.log('Hiding preloader...');
            // Добавляем класс для fade-out анимации
            preloader.classList.add('fade-out');
            
            // Удаляем прелоадер из DOM после завершения анимации
            setTimeout(() => {
                preloader.style.display = 'none';
                // Разблокировка прокрутки
                document.body.classList.remove('preloader-active');
                console.log('Preloader hidden!');
            }, 500);
        } else {
            console.error('Preloader element not found!');
        }
    }

    // Минимальное время показа прелоадера (для эффекта, даже если страница загрузилась быстро)
    const minDisplayTime = 800; // 0.8 секунды
    const startTime = Date.now();

    // Скрытие прелоадера после загрузки страницы
    window.addEventListener('load', function() {
        console.log('Page loaded!');
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
        
        setTimeout(hidePreloader, remainingTime);
    });

    // Дополнительная защита: скрыть прелоадер через 3 секунды в любом случае
    setTimeout(function() {
        console.log('Safety timeout triggered');
        const preloader = document.getElementById('preloader');
        if (preloader && !preloader.classList.contains('fade-out')) {
            hidePreloader();
        }
    }, 3000);

})();

