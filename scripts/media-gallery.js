// Интерактивная медиа-галерея с аудио
(function() {
    'use strict';

    // Данные галереи - 12 товаров с уникальными звуками
    const galleryItems = [
        { index: 0, image: '../images/rockerz.png', name: 'Boat Rockerz 333', desc: 'Premium wireless headphones with deep bass', frequency: 440 }, // A4
        { index: 1, image: '../images/kerz.png', name: 'Boat Kerz 234', desc: 'Compact earbuds with noise cancellation', frequency: 494 }, // B4
        { index: 2, image: '../images/roc.png', name: 'Boat Rockerz 323', desc: 'Comfortable over-ear headphones', frequency: 523 }, // C5
        { index: 3, image: '../images/rockerz1.png', name: 'Boat Rockerz 555', desc: 'Wireless freedom with superior sound', frequency: 587 }, // D5
        { index: 4, image: '../images/kerz1.png', name: 'Boat Kerz 456', desc: 'Sleek design with powerful audio', frequency: 659 }, // E5
        { index: 5, image: '../images/roc1.png', name: 'Boat Rockerz 789', desc: 'Professional grade headphones', frequency: 698 }, // F5
        { index: 6, image: '../images/apple1.png', name: 'Apple AirPods Pro', desc: 'Premium wireless earbuds with ANC', frequency: 784 }, // G5
        { index: 7, image: '../images/apple2.png', name: 'Apple AirPods Max', desc: 'Over-ear headphones with spatial audio', frequency: 880 }, // A5
        { index: 8, image: '../images/apple3.png', name: 'Apple AirPods Gen 3', desc: 'Latest generation wireless earbuds', frequency: 988 }, // B5
        { index: 9, image: '../images/img1air.png', name: 'Airdrop 500 ANC', desc: 'Active noise cancellation', frequency: 1047 }, // C6
        { index: 10, image: '../images/img2air.png', name: 'Airdrop Sport', desc: 'Water-resistant design for workouts', frequency: 1175 }, // D6
        { index: 11, image: '../images/product.png', name: 'Red Beats M19C22', desc: 'Iconic design with powerful bass', frequency: 1319 }  // E6
    ];

    // Элементы DOM
    const mainImage = document.getElementById('gallery-main-image');
    const productName = document.getElementById('gallery-product-name');
    const productDesc = document.getElementById('gallery-product-desc');
    const soundWave = document.getElementById('sound-wave');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const volumeValue = document.getElementById('volume-value');
    const statusIndicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    const thumbnails = document.querySelectorAll('.gallery-thumb');
    const prevBtn = document.getElementById('gallery-prev');
    const nextBtn = document.getElementById('gallery-next');
    const randomBtn = document.getElementById('gallery-random');

    // Контекст аудио и состояние
    let audioContext = null;
    let oscillator = null;
    let gainNode = null;
    let currentIndex = 0;
    let isPlaying = false;
    let currentVolume = 0.5;

    /**
     * Инициализация Web Audio API
     */
    function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();
            gainNode.connect(audioContext.destination);
            gainNode.gain.value = currentVolume;
            console.log('Audio context initialized');
        }
    }

    /**
     * Воспроизведение звука для текущего элемента
     */
    function playSound(frequency, duration = 800) {
        initAudio();

        // Остановить текущий звук
        stopSound();

        // Создать осциллятор
        oscillator = audioContext.createOscillator();
        oscillator.type = 'sine'; // Синусоидальная волна для плавного звука
        oscillator.frequency.value = frequency;

        // Создать огибающую для плавного начала/окончания
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(currentVolume, now + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, now + duration / 1000);

        // Подключить и запустить
        oscillator.connect(gainNode);
        oscillator.start(now);
        oscillator.stop(now + duration / 1000);

        // Обновить интерфейс
        setPlayingState(true);
        showSoundWave();

        // Скрыть звуковую волну и обновить состояние после окончания звука
        setTimeout(() => {
            setPlayingState(false);
            hideSoundWave();
        }, duration);

        console.log(`Playing sound: ${frequency}Hz`);
    }

    /**
     * Остановить текущий звук
     */
    function stopSound() {
        if (oscillator) {
            try {
                oscillator.stop();
            } catch (e) {
                // Уже остановлен
            }
            oscillator = null;
        }
        setPlayingState(false);
        hideSoundWave();
    }

    /**
     * Показать анимацию звуковой волны
     */
    function showSoundWave() {
        if (soundWave) {
            soundWave.classList.add('active');
        }
    }

    /**
     * Скрыть анимацию звуковой волны
     */
    function hideSoundWave() {
        if (soundWave) {
            soundWave.classList.remove('active');
        }
    }

    /**
     * Установить состояние воспроизведения
     */
    function setPlayingState(playing) {
        isPlaying = playing;

        if (playPauseBtn) {
            if (playing) {
                playPauseBtn.classList.add('playing');
            } else {
                playPauseBtn.classList.remove('playing');
            }
        }

        if (statusIndicator) {
            if (playing) {
                statusIndicator.classList.add('playing');
            } else {
                statusIndicator.classList.remove('playing');
            }
        }

        if (statusText) {
            if (playing) {
                statusText.textContent = 'Playing';
                statusText.classList.add('playing');
            } else {
                statusText.textContent = 'Ready';
                statusText.classList.remove('playing');
            }
        }
    }

    /**
     * Переключиться на конкретный элемент галереи
     */
    function changeGalleryItem(index, playAudio = true) {
        if (index < 0 || index >= galleryItems.length) return;

        const item = galleryItems[index];
        currentIndex = index;

        // Затемнить текущее изображение
        mainImage.classList.add('fade-out');

        setTimeout(() => {
            // Изменить изображение
            mainImage.src = item.image;
            mainImage.alt = item.name;

            // Обновить информацию
            productName.textContent = item.name;
            productDesc.textContent = item.desc;

            // Обновить миниатюры
            thumbnails.forEach((thumb, i) => {
                if (i === index) {
                    thumb.classList.add('active');
                } else {
                    thumb.classList.remove('active');
                }
            });

            // Показать новое изображение
            mainImage.classList.remove('fade-out');
            mainImage.classList.add('fade-in');

            setTimeout(() => {
                mainImage.classList.remove('fade-in');
            }, 600);

            // Воспроизвести звук
            if (playAudio) {
                playSound(item.frequency);
            }

        }, 250);

        console.log(`Gallery changed to: ${item.name}`);
    }

    /**
     * Перейти к следующему элементу
     */
    function nextItem() {
        const nextIndex = (currentIndex + 1) % galleryItems.length;
        changeGalleryItem(nextIndex);
    }

    /**
     * Перейти к предыдущему элементу
     */
    function prevItem() {
        const prevIndex = currentIndex === 0 ? galleryItems.length - 1 : currentIndex - 1;
        changeGalleryItem(prevIndex);
    }

    /**
     * Перейти к случайному элементу
     */
    function randomItem() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * galleryItems.length);
        } while (randomIndex === currentIndex && galleryItems.length > 1);
        
        changeGalleryItem(randomIndex);

        // Показать уведомление
        if (typeof toastInfo === 'function') {
            toastInfo('Случайный товар', galleryItems[randomIndex].name);
        }
    }

    /**
     * Обновить громкость
     */
    function updateVolume(value) {
        currentVolume = value / 100;
        if (gainNode) {
            gainNode.gain.value = currentVolume;
        }

        if (volumeValue) {
            volumeValue.textContent = `${value}%`;
        }

        // Обновить иконку громкости
        const volumeIcon = document.querySelector('.volume-icon');
        if (volumeIcon) {
            if (value === 0) {
                volumeIcon.textContent = '🔇';
            } else if (value < 30) {
                volumeIcon.textContent = '🔈';
            } else if (value < 70) {
                volumeIcon.textContent = '🔉';
            } else {
                volumeIcon.textContent = '🔊';
            }
        }
    }

    // ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================

    document.addEventListener('DOMContentLoaded', function() {
        
        // Клики по миниатюрам
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', function() {
                // Проверить, является ли это миниатюрой видео
                if (this.dataset.type === 'video') {
                    // Миниатюра видео обрабатывается video-player.js
                    return;
                }
                changeGalleryItem(index);
            });
        });

        // Кнопки навигации
        if (prevBtn) {
            prevBtn.addEventListener('click', prevItem);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', nextItem);
        }

        if (randomBtn) {
            randomBtn.addEventListener('click', randomItem);
        }

        // Кнопка воспроизведения/паузы
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', function() {
                if (isPlaying) {
                    stopSound();
                } else {
                    const item = galleryItems[currentIndex];
                    playSound(item.frequency);
                }
            });
        }

        // Слайдер громкости
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function() {
                updateVolume(parseInt(this.value));
            });

            // Инициализировать громкость
            updateVolume(parseInt(volumeSlider.value));
        }

        // Навигация с клавиатуры
        document.addEventListener('keydown', function(e) {
            // Только если галерея в поле зрения
            const gallerySection = document.querySelector('.media-gallery-section');
            if (!gallerySection) return;

            const rect = gallerySection.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;

            if (inView) {
                switch(e.key) {
                    case 'ArrowLeft':
                        prevItem();
                        break;
                    case 'ArrowRight':
                        nextItem();
                        break;
                    case ' ':
                    case 'Enter':
                        e.preventDefault();
                        if (isPlaying) {
                            stopSound();
                        } else {
                            const item = galleryItems[currentIndex];
                            playSound(item.frequency);
                        }
                        break;
                    case 'r':
                    case 'R':
                        randomItem();
                        break;
                }
            }
        });

        // Автоматическое воспроизведение приветственного звука после задержки
        setTimeout(() => {
            if (typeof toastInfo === 'function') {
                toastInfo('Галерея готова', 'Нажмите на любой товар, чтобы услышать его уникальный звук!');
            }
        }, 1000);

        console.log('Media gallery initialized with', galleryItems.length, 'items');
    });

    // ==================== ЭКСПОРТ В ГЛОБАЛЬНУЮ ОБЛАСТЬ ВИДИМОСТИ ====================

    window.galleryChangeItem = changeGalleryItem;
    window.galleryPlaySound = playSound;
    window.galleryStopSound = stopSound;

    console.log('Interactive media gallery initialized!');

})();

