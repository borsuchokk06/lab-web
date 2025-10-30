// Video Player Functionality
(function() {
    'use strict';

    // DOM Elements
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
     * Format time (seconds to MM:SS)
     */
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    /**
     * Open video modal
     */
    function openVideoModal() {
        console.log('Opening video modal...');
        
        videoModal.classList.add('active');
        document.body.classList.add('video-modal-open');
        
        // Auto-play video
        setTimeout(() => {
            if (videoElement) {
                videoElement.play().then(() => {
                    console.log('Video started playing');
                    updatePlayPauseButton(true);
                }).catch(err => {
                    console.error('Video play error:', err);
                });
            }
        }, 400);

        // Show notification
        if (typeof toastInfo === 'function') {
            toastInfo('Video Player', 'Enjoy our product showcase!');
        }
    }

    /**
     * Close video modal
     */
    function closeVideoModal() {
        console.log('Closing video modal...');
        
        // Pause and reset video
        if (videoElement) {
            videoElement.pause();
            videoElement.currentTime = 0;
        }
        
        videoModal.classList.remove('active');
        document.body.classList.remove('video-modal-open');
        
        updatePlayPauseButton(false);
    }

    /**
     * Toggle play/pause
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
     * Update play/pause button state
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
     * Toggle mute
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
     * Update volume
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
     * Update progress bar
     */
    function updateProgress() {
        if (!videoElement || !videoProgressBar) return;

        const progress = (videoElement.currentTime / videoElement.duration) * 100;
        videoProgressBar.value = progress || 0;

        // Update time displays
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = formatTime(videoElement.currentTime);
        }
        if (totalTimeDisplay) {
            totalTimeDisplay.textContent = formatTime(videoElement.duration);
        }
    }

    /**
     * Seek video
     */
    function seekVideo(value) {
        if (!videoElement) return;

        const time = (value / 100) * videoElement.duration;
        videoElement.currentTime = time;
    }

    /**
     * Toggle fullscreen
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

    // ==================== EVENT LISTENERS ====================

    document.addEventListener('DOMContentLoaded', function() {
        
        // Video thumbnail click in gallery
        const videoThumb = document.querySelector('.gallery-thumb.video-thumb');
        if (videoThumb) {
            videoThumb.addEventListener('click', function(e) {
                e.stopPropagation();
                openVideoModal();
            });
        }

        // Close modal button
        if (videoModalClose) {
            videoModalClose.addEventListener('click', closeVideoModal);
        }

        // Close modal by clicking overlay
        if (videoModalOverlay) {
            videoModalOverlay.addEventListener('click', closeVideoModal);
        }

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && videoModal.classList.contains('active')) {
                closeVideoModal();
            }
        });

        // Video controls
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
            
            // Initialize volume
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

        // Video events
        if (videoElement) {
            // Update progress
            videoElement.addEventListener('timeupdate', updateProgress);

            // Video ended
            videoElement.addEventListener('ended', function() {
                updatePlayPauseButton(false);
                
                if (typeof toastSuccess === 'function') {
                    toastSuccess('Video Ended', 'Thanks for watching!');
                }
            });

            // Video play
            videoElement.addEventListener('play', function() {
                updatePlayPauseButton(true);
            });

            // Video pause
            videoElement.addEventListener('pause', function() {
                updatePlayPauseButton(false);
            });

            // Metadata loaded
            videoElement.addEventListener('loadedmetadata', function() {
                if (totalTimeDisplay) {
                    totalTimeDisplay.textContent = formatTime(videoElement.duration);
                }
            });

            // Video loading
            videoElement.addEventListener('waiting', function() {
                if (typeof toastInfo === 'function') {
                    toastInfo('Buffering', 'Loading video...', { duration: 2000 });
                }
            });

            // Video can play
            videoElement.addEventListener('canplay', function() {
                console.log('Video ready to play');
            });

            // Click on video to toggle play/pause
            videoElement.addEventListener('click', function() {
                togglePlayPause();
            });

            // Keyboard controls for video
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

        console.log('Video player initialized!');
    });

    // ==================== EXPORT TO GLOBAL SCOPE ====================

    window.openVideoModal = openVideoModal;
    window.closeVideoModal = closeVideoModal;
    window.toggleVideoPlayPause = togglePlayPause;

    console.log('Video player functionality ready!');

})();

