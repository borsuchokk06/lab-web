// Интеграция с Яндекс.Картами
(function() {
    'use strict';

    // Данные о местоположениях магазинов
    const stores = [
        {
            id: 'main',
            name: 'Main Store - Moscow',
            coords: [55.751574, 37.573856],
            address: 'Red Square, 1, Moscow, Russia',
            hours: 'Mon-Sun: 9:00 - 21:00',
            phone: '+7 (495) 123-45-67',
            description: 'Our flagship store with the largest selection'
        },
        {
            id: 'spb',
            name: 'Store #2 - St. Petersburg',
            coords: [59.934280, 30.335099],
            address: 'Nevsky Prospect, 28, St. Petersburg',
            hours: 'Mon-Sun: 10:00 - 22:00',
            phone: '+7 (812) 987-65-43',
            description: 'Premium audio equipment in the heart of the city'
        },
        {
            id: 'kazan',
            name: 'Store #3 - Kazan',
            coords: [55.796127, 49.106414],
            address: 'Bauman Street, 58, Kazan',
            hours: 'Mon-Sun: 10:00 - 20:00',
            phone: '+7 (843) 555-12-34',
            description: 'Expert consultation and best prices'
        }
    ];

    let mainMap = null;
    let modalMap = null;
    let currentRoute = null;

    /**
     * Инициализация основной карты
     */
    function initMainMap() {
        if (!window.ymaps) {
            console.error('Yandex Maps API not loaded');
            return;
        }

        ymaps.ready(function() {
            // Создание карты с центром в Москве
            mainMap = new ymaps.Map('yandex-map', {
                center: [55.751574, 37.573856],
                zoom: 5,
                controls: ['zoomControl', 'typeSelector']
            });

            // Добавление маркеров для всех магазинов
            stores.forEach(store => {
                addMarker(mainMap, store);
            });

            console.log('Main map initialized successfully!');
        });
    }

    /**
     * Инициализация модальной карты
     */
    function initModalMap() {
        if (!window.ymaps || modalMap) return;

        ymaps.ready(function() {
            modalMap = new ymaps.Map('yandex-map-modal', {
                center: [55.751574, 37.573856],
                zoom: 5,
                controls: ['zoomControl', 'typeSelector', 'fullscreenControl', 'geolocationControl']
            });

            // Добавление маркеров для всех магазинов
            stores.forEach(store => {
                addMarker(modalMap, store);
            });

            console.log('Modal map initialized successfully!');
        });
    }

    /**
     * Добавление маркера на карту
     */
    function addMarker(map, store) {
        const placemark = new ymaps.Placemark(
            store.coords,
            {
                balloonContentHeader: `<strong>${store.name}</strong>`,
                balloonContentBody: `
                    <div class="custom-balloon">
                        <p>📍 ${store.address}</p>
                        <p>🕐 ${store.hours}</p>
                        <p>📞 ${store.phone}</p>
                        <p><em>${store.description}</em></p>
                        <button onclick="buildRouteToStore('${store.id}')">Build Route</button>
                    </div>
                `,
                balloonContentFooter: 'Click "Build Route" to get directions',
                hintContent: store.name
            },
            {
                preset: 'islands#greenShoppingIcon',
                iconColor: '#10B981'
            }
        );

        map.geoObjects.add(placemark);
    }

    /**
     * Построение маршрута к магазину
     */
    function buildRoute(storeId, useModalMap = false) {
        const store = stores.find(s => s.id === storeId);
        if (!store) {
            console.error('Store not found:', storeId);
            return;
        }

        const targetMap = useModalMap ? modalMap : mainMap;
        if (!targetMap) {
            console.error('Map not initialized');
            return;
        }

        // Получение местоположения пользователя
        ymaps.geolocation.get({
            provider: 'browser',
            mapStateAutoApply: true
        }).then(function(result) {
            const userCoords = result.geoObjects.position;
            
            // Очистка предыдущего маршрута
            if (currentRoute) {
                targetMap.geoObjects.remove(currentRoute);
            }

            // Создание мультимаршрута
            const multiRoute = new ymaps.multiRouter.MultiRoute({
                referencePoints: [
                    userCoords,
                    store.coords
                ],
                params: {
                    routingMode: 'auto'
                }
            }, {
                boundsAutoApply: true,
                wayPointStartIconColor: '#3B82F6',
                wayPointFinishIconColor: '#10B981',
                routeActiveStrokeColor: '#10B981',
                routeActiveStrokeWidth: 6
            });

            targetMap.geoObjects.add(multiRoute);
            currentRoute = multiRoute;

            // Показать уведомление
            if (typeof toastSuccess === 'function') {
                toastSuccess(
                    'Маршрут построен!',
                    `Направления к ${store.name}`,
                    { duration: 3000 }
                );
            }

            // Открыть модальное окно, если маршрут строится с основной карты
            if (!useModalMap) {
                openMapModal();
                setTimeout(() => {
                    if (modalMap) {
                        buildRoute(storeId, true);
                    }
                }, 500);
            }

        }).catch(function(error) {
            console.error('Ошибка геолокации:', error);
            
            // Показать уведомление об ошибке
            if (typeof toastError === 'function') {
                toastError(
                    'Ошибка местоположения',
                    'Пожалуйста, включите службы геолокации для построения маршрута',
                    { duration: 5000 }
                );
            } else {
                alert('Пожалуйста, включите службы геолокации для построения маршрута');
            }
        });
    }

    /**
     * Открытие модального окна карты
     */
    function openMapModal() {
        const modal = document.getElementById('map-modal');
        if (!modal) return;

        modal.classList.add('active');
        document.body.classList.add('map-modal-open');

        // Инициализация модальной карты, если еще не сделано
        if (!modalMap) {
            initModalMap();
        }
    }

    /**
     * Закрытие модального окна карты
     */
    function closeMapModal() {
        const modal = document.getElementById('map-modal');
        if (!modal) return;

        modal.classList.remove('active');
        document.body.classList.remove('map-modal-open');
    }

    // ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================

    // Инициализация основной карты при готовности документа
    document.addEventListener('DOMContentLoaded', function() {
        initMainMap();

        // Кнопка открытия модального окна
        const openModalBtn = document.getElementById('open-map-modal');
        if (openModalBtn) {
            openModalBtn.addEventListener('click', openMapModal);
        }

        // Кнопка закрытия модального окна
        const closeModalBtn = document.getElementById('map-modal-close');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeMapModal);
        }

        // Закрытие модального окна по клику на оверлей
        const modalOverlay = document.getElementById('map-modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeMapModal);
        }

        // Закрытие модального окна клавишей Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const modal = document.getElementById('map-modal');
                if (modal && modal.classList.contains('active')) {
                    closeMapModal();
                }
            }
        });

        // Клик по карточке магазина - показать на карте
        const storeCards = document.querySelectorAll('.store-card');
        storeCards.forEach(card => {
            card.addEventListener('click', function(e) {
                if (e.target.classList.contains('route-btn')) {
                    return; // Позволить кнопке маршрута обработать свой клик
                }

                const coords = JSON.parse(this.dataset.coords);
                if (mainMap) {
                    mainMap.setCenter(coords, 12, { duration: 500 });
                    
                    // Показать уведомление
                    const storeName = this.querySelector('h3').textContent;
                    if (typeof toastInfo === 'function') {
                        toastInfo('Местоположение выбрано', storeName.replace('🏪 ', ''));
                    }
                }
            });
        });

        // Кнопки построения маршрута
        const routeBtns = document.querySelectorAll('.route-btn');
        routeBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const storeId = this.dataset.store;
                buildRoute(storeId);
            });
        });

        // Кнопки управления картой (модальное окно)
        const zoomInBtn = document.getElementById('zoom-in');
        const zoomOutBtn = document.getElementById('zoom-out');
        const resetMapBtn = document.getElementById('reset-map');

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                if (modalMap) {
                    const currentZoom = modalMap.getZoom();
                    modalMap.setZoom(currentZoom + 1, { duration: 300 });
                }
            });
        }

        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                if (modalMap) {
                    const currentZoom = modalMap.getZoom();
                    modalMap.setZoom(currentZoom - 1, { duration: 300 });
                }
            });
        }

        if (resetMapBtn) {
            resetMapBtn.addEventListener('click', () => {
                if (modalMap) {
                    modalMap.setCenter([55.751574, 37.573856], 5, { duration: 500 });
                    
                    // Очистить маршрут
                    if (currentRoute) {
                        modalMap.geoObjects.remove(currentRoute);
                        currentRoute = null;
                    }
                }
            });
        }
    });

    // ==================== ЭКСПОРТ В ГЛОБАЛЬНУЮ ОБЛАСТЬ ВИДИМОСТИ ====================

    window.buildRouteToStore = buildRoute;
    window.openMapModal = openMapModal;
    window.closeMapModal = closeMapModal;

    console.log('Функциональность карты инициализирована!');

})();

