// Функциональность видеоплеера
(function() {
    'use strict';

    // Элементы DOM
    const videoModal = document.getElementById('video-modal');
    const videoModalOverlay = document.getElementById('video-modal-overlay');
    const videoModalClose = document.getElementById('video-modal-close');
    const videoElement = document.getElementById('product-video');
    const videoPlayPauseBtn = document.getElementById('video-play-pause');
    const videoProgressBar = document.getElementById('video-progress');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalTimeDisplay = document.getElementById('total-time');
    const videoMuteBtn = document.getElementById('video-mute');
    const videoVolumeSlider = document.getElementById('video-volume');
    const videoFullscreenBtn = document.getElementById('video-fullscreen');

    if (!videoModal || !videoElement) {
        console.warn('Video modal or video element not found');
        return;
    }

    /**
     * Форматировать время (секунды в MM:SS)
     */
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    /**
     * Открыть модальное окно видео
     */
    function openVideoModal() {
        console.log('Открытие модального окна видео...');
        
        videoModal.classList.add('active');
        document.body.classList.add('video-modal-open');
        
        // Автоматическое воспроизведение видео
        setTimeout(() => {
            if (videoElement) {
                videoElement.play().then(() => {
                    console.log('Видео начало воспроизведение');
                    updatePlayPauseButton(true);
                }).catch(err => {
                    console.error('Ошибка воспроизведения видео:', err);
                });
            }
        }, 400);

        // Показать уведомление
        if (typeof toastInfo === 'function') {
            toastInfo('Видеоплеер', 'Наслаждайтесь нашей презентацией товаров!');
        }
    }

    /**
     * Закрыть модальное окно видео
     */
    function closeVideoModal() {
        console.log('Закрытие модального окна видео...');
        
        // Приостановить и сбросить видео
        if (videoElement) {
            videoElement.pause();
            videoElement.currentTime = 0;
        }
        
        videoModal.classList.remove('active');
        document.body.classList.remove('video-modal-open');
        
        updatePlayPauseButton(false);
    }

    /**
     * Переключить воспроизведение/паузу
     */
    function togglePlayPause() {
        if (!videoElement) return;

        if (videoElement.paused) {
            videoElement.play();
            updatePlayPauseButton(true);
        } else {
            videoElement.pause();
            updatePlayPauseButton(false);
        }
    }

    /**
     * Обновить состояние кнопки воспроизведения/паузы
     */
    function updatePlayPauseButton(isPlaying) {
        if (!videoPlayPauseBtn) return;

        if (isPlaying) {
            videoPlayPauseBtn.classList.add('playing');
        } else {
            videoPlayPauseBtn.classList.remove('playing');
        }
    }

    /**
     * Переключить беззвучный режим
     */
    function toggleMute() {
        if (!videoElement) return;

        videoElement.muted = !videoElement.muted;
        
        if (videoMuteBtn) {
            if (videoElement.muted) {
                videoMuteBtn.textContent = '🔇';
            } else {
                if (videoElement.volume > 0.7) {
                    videoMuteBtn.textContent = '🔊';
                } else if (videoElement.volume > 0.3) {
                    videoMuteBtn.textContent = '🔉';
                } else {
                    videoMuteBtn.textContent = '🔈';
                }
            }
        }
    }

    /**
     * Обновить громкость
     */
    function updateVolume(value) {
        if (!videoElement) return;

        const volume = value / 100;
        videoElement.volume = volume;
        
        if (videoMuteBtn && !videoElement.muted) {
            if (volume === 0) {
                videoMuteBtn.textContent = '🔇';
            } else if (volume < 0.3) {
                videoMuteBtn.textContent = '🔈';
            } else if (volume < 0.7) {
                videoMuteBtn.textContent = '🔉';
            } else {
                videoMuteBtn.textContent = '🔊';
            }
        }
    }

    /**
     * Обновить индикатор прогресса
     */
    function updateProgress() {
        if (!videoElement || !videoProgressBar) return;

        const progress = (videoElement.currentTime / videoElement.duration) * 100;
        videoProgressBar.value = progress || 0;

        // Обновить отображение времени
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = formatTime(videoElement.currentTime);
        }
        if (totalTimeDisplay) {
            totalTimeDisplay.textContent = formatTime(videoElement.duration);
        }
    }

    /**
     * Переместиться по видео
     */
    function seekVideo(value) {
        if (!videoElement) return;

        const time = (value / 100) * videoElement.duration;
        videoElement.currentTime = time;
    }

    /**
     * Переключить полноэкранный режим
     */
    function toggleFullscreen() {
        const videoContainer = document.querySelector('.video-modal-content');
        
        if (!document.fullscreenElement) {
            if (videoContainer.requestFullscreen) {
                videoContainer.requestFullscreen();
            } else if (videoContainer.webkitRequestFullscreen) {
                videoContainer.webkitRequestFullscreen();
            } else if (videoContainer.msRequestFullscreen) {
                videoContainer.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // ==================== ОБРАБОТЧИКИ СОБЫТИЙ ====================

    document.addEventListener('DOMContentLoaded', function() {
        
        // Клик по миниатюре видео в галерее
        const videoThumb = document.querySelector('.gallery-thumb.video-thumb');
        if (videoThumb) {
            videoThumb.addEventListener('click', function(e) {
                e.stopPropagation();
                openVideoModal();
            });
        }

        // Кнопка закрытия модального окна
        if (videoModalClose) {
            videoModalClose.addEventListener('click', closeVideoModal);
        }

        // Закрытие модального окна по клику на оверлей
        if (videoModalOverlay) {
            videoModalOverlay.addEventListener('click', closeVideoModal);
        }

        // Закрытие модального окна клавишей Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeVideoModal();
            }
        });

        // Элементы управления видео
        if (videoPlayPauseBtn) {
            videoPlayPauseBtn.addEventListener('click', togglePlayPause);
        }

        if (videoMuteBtn) {
            videoMuteBtn.addEventListener('click', toggleMute);
        }

        if (videoVolumeSlider) {
            videoVolumeSlider.addEventListener('input', function() {
                updateVolume(parseInt(this.value));
            });
            
            // Инициализировать громкость
            updateVolume(parseInt(videoVolumeSlider.value));
        }

        if (videoProgressBar) {
            videoProgressBar.addEventListener('input', function() {
                seekVideo(parseInt(this.value));
            });
        }

        if (videoFullscreenBtn) {
            videoFullscreenBtn.addEventListener('click', toggleFullscreen);
        }

        // События видео
        if (videoElement) {
            // Обновить прогресс
            videoElement.addEventListener('timeupdate', updateProgress);

            // Видео закончилось
            videoElement.addEventListener('ended', function() {
                updatePlayPauseButton(false);
                
                if (typeof toastSuccess === 'function') {
                    toastSuccess('Видео закончилось', 'Спасибо за просмотр!');
                }
            });

            // Воспроизведение видео
            videoElement.addEventListener('play', function() {
                updatePlayPauseButton(true);
            });

            // Пауза видео
            videoElement.addEventListener('pause', function() {
                updatePlayPauseButton(false);
            });

            // Метаданные загружены
            videoElement.addEventListener('loadedmetadata', function() {
                if (totalTimeDisplay) {
                    totalTimeDisplay.textContent = formatTime(videoElement.duration);
                }
            });

            // Загрузка видео
            videoElement.addEventListener('waiting', function() {
                if (typeof toastInfo === 'function') {
                    toastInfo('Буферизация', 'Загрузка видео...', { duration: 2000 });
                }
            });

            // Видео готово к воспроизведению
            videoElement.addEventListener('canplay', function() {
                console.log('Видео готово к воспроизведению');
            });

            // Клик по видео для переключения воспроизведения/паузы
            videoElement.addEventListener('click', function() {
                togglePlayPause();
            });

            // Управление с клавиатуры для видео
            document.addEventListener('keydown', function(e) {
                if (!videoModal.classList.contains('active')) return;

                switch(e.key) {
                    case ' ':
                    case 'k':
                    case 'K':
                        e.preventDefault();
                        togglePlayPause();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        videoElement.currentTime = Math.max(0, videoElement.currentTime - 5);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        videoElement.currentTime = Math.min(videoElement.duration, videoElement.currentTime + 5);
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        videoElement.volume = Math.min(1, videoElement.volume + 0.1);
                        if (videoVolumeSlider) {
                            videoVolumeSlider.value = videoElement.volume * 100;
                        }
                        updateVolume(videoElement.volume * 100);
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        videoElement.volume = Math.max(0, videoElement.volume - 0.1);
                        if (videoVolumeSlider) {
                            videoVolumeSlider.value = videoElement.volume * 100;
                        }
                        updateVolume(videoElement.volume * 100);
                        break;
                    case 'm':
                    case 'M':
                        toggleMute();
                        break;
                    case 'f':
                    case 'F':
                        toggleFullscreen();
                        break;
                }
            });
        }

        console.log('Видеоплеер инициализирован!');
    });

    // ==================== ЭКСПОРТ В ГЛОБАЛЬНУЮ ОБЛАСТЬ ВИДИМОСТИ ====================

    window.openVideoModal = openVideoModal;
    window.closeVideoModal = closeVideoModal;
    window.toggleVideoPlayPause = togglePlayPause;

    console.log('Функциональность видеоплеера готова!');

})();

