// Interactive Media Gallery with Audio
(function() {
    'use strict';

    // Gallery data - 12 products with unique sounds
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

    // DOM Elements
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

    // Audio Context and State
    let audioContext = null;
    let oscillator = null;
    let gainNode = null;
    let currentIndex = 0;
    let isPlaying = false;
    let currentVolume = 0.5;

    /**
     * Initialize Web Audio API
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
     * Play sound for current item
     */
    function playSound(frequency, duration = 800) {
        initAudio();

        // Stop current sound
        stopSound();

        // Create oscillator
        oscillator = audioContext.createOscillator();
        oscillator.type = 'sine'; // Sine wave for smooth sound
        oscillator.frequency.value = frequency;

        // Create envelope for smooth start/stop
        const now = audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(currentVolume, now + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, now + duration / 1000);

        // Connect and start
        oscillator.connect(gainNode);
        oscillator.start(now);
        oscillator.stop(now + duration / 1000);

        // Update UI
        setPlayingState(true);
        showSoundWave();

        // Hide sound wave and update state after sound ends
        setTimeout(() => {
            setPlayingState(false);
            hideSoundWave();
        }, duration);

        console.log(`Playing sound: ${frequency}Hz`);
    }

    /**
     * Stop current sound
     */
    function stopSound() {
        if (oscillator) {
            try {
                oscillator.stop();
            } catch (e) {
                // Already stopped
            }
            oscillator = null;
        }
        setPlayingState(false);
        hideSoundWave();
    }

    /**
     * Show sound wave animation
     */
    function showSoundWave() {
        if (soundWave) {
            soundWave.classList.add('active');
        }
    }

    /**
     * Hide sound wave animation
     */
    function hideSoundWave() {
        if (soundWave) {
            soundWave.classList.remove('active');
        }
    }

    /**
     * Set playing state
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
     * Change to specific gallery item
     */
    function changeGalleryItem(index, playAudio = true) {
        if (index < 0 || index >= galleryItems.length) return;

        const item = galleryItems[index];
        currentIndex = index;

        // Fade out current image
        mainImage.classList.add('fade-out');

        setTimeout(() => {
            // Change image
            mainImage.src = item.image;
            mainImage.alt = item.name;

            // Update info
            productName.textContent = item.name;
            productDesc.textContent = item.desc;

            // Update thumbnails
            thumbnails.forEach((thumb, i) => {
                if (i === index) {
                    thumb.classList.add('active');
                } else {
                    thumb.classList.remove('active');
                }
            });

            // Fade in new image
            mainImage.classList.remove('fade-out');
            mainImage.classList.add('fade-in');

            setTimeout(() => {
                mainImage.classList.remove('fade-in');
            }, 600);

            // Play sound
            if (playAudio) {
                playSound(item.frequency);
            }

        }, 250);

        console.log(`Gallery changed to: ${item.name}`);
    }

    /**
     * Go to next item
     */
    function nextItem() {
        const nextIndex = (currentIndex + 1) % galleryItems.length;
        changeGalleryItem(nextIndex);
    }

    /**
     * Go to previous item
     */
    function prevItem() {
        const prevIndex = currentIndex === 0 ? galleryItems.length - 1 : currentIndex - 1;
        changeGalleryItem(prevIndex);
    }

    /**
     * Go to random item
     */
    function randomItem() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * galleryItems.length);
        } while (randomIndex === currentIndex && galleryItems.length > 1);
        
        changeGalleryItem(randomIndex);

        // Show notification
        if (typeof toastInfo === 'function') {
            toastInfo('Random Product', galleryItems[randomIndex].name);
        }
    }

    /**
     * Update volume
     */
    function updateVolume(value) {
        currentVolume = value / 100;
        if (gainNode) {
            gainNode.gain.value = currentVolume;
        }

        if (volumeValue) {
            volumeValue.textContent = `${value}%`;
        }

        // Update volume icon
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

    // ==================== EVENT LISTENERS ====================

    document.addEventListener('DOMContentLoaded', function() {
        
        // Thumbnail clicks
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', function() {
                // Check if this is a video thumbnail
                if (this.dataset.type === 'video') {
                    // Video thumbnail handled by video-player.js
                    return;
                }
                changeGalleryItem(index);
            });
        });

        // Navigation buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', prevItem);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', nextItem);
        }

        if (randomBtn) {
            randomBtn.addEventListener('click', randomItem);
        }

        // Play/Pause button
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

        // Volume slider
        if (volumeSlider) {
            volumeSlider.addEventListener('input', function() {
                updateVolume(parseInt(this.value));
            });

            // Initialize volume
            updateVolume(parseInt(volumeSlider.value));
        }

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            // Only if gallery is in view
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

        // Auto-play welcome sound after delay
        setTimeout(() => {
            if (typeof toastInfo === 'function') {
                toastInfo('Gallery Ready', 'Click any product to hear its unique sound!');
            }
        }, 1000);

        console.log('Media gallery initialized with', galleryItems.length, 'items');
    });

    // ==================== EXPORT TO GLOBAL SCOPE ====================

    window.galleryChangeItem = changeGalleryItem;
    window.galleryPlaySound = playSound;
    window.galleryStopSound = stopSound;

    console.log('Interactive media gallery initialized!');

})();

