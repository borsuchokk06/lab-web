// Scroll Animations with Intersection Observer
(function() {
    'use strict';

    // Configuration
    const animationConfig = {
        threshold: 0.15,        // 15% of element visible triggers animation
        rootMargin: '0px 0px -50px 0px'
    };

    let countersAnimated = false;

    // ==================== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ====================

    /**
     * Initialize Intersection Observer for scroll animations
     */
    function initScrollAnimations() {
        // Check if Intersection Observer is supported
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported, animations disabled');
            // Fallback: show all elements immediately
            document.querySelectorAll('.scroll-animate').forEach(el => {
                el.classList.add('animated');
            });
            return;
        }

        // Create observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Element is visible
                    entry.target.classList.add('animated');
                    
                    // Optional: unobserve after animation (one-time animation)
                    // observer.unobserve(entry.target);
                }
            });
        }, animationConfig);

        // Observe all elements with scroll-animate class
        const animatedElements = document.querySelectorAll('.scroll-animate');
        animatedElements.forEach(element => {
            observer.observe(element);
        });

        console.log(`Observing ${animatedElements.length} elements for scroll animations`);
    }

    // ==================== ANIMATED COUNTERS ====================

    /**
     * Animate counter from 0 to target value
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
     * Format number with commas
     */
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /**
     * Initialize counters
     */
    function initCounters() {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    
                    // Animate all stat numbers
                    const statNumbers = document.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.dataset.count) || 0;
                        animateCounter(stat, target, 2000);
                    });

                    // Show notification
                    if (typeof toastSuccess === 'function') {
                        setTimeout(() => {
                            toastSuccess('Amazing Stats!', 'We are proud of our achievements', { duration: 3000 });
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

    // ==================== HEADER BACKGROUND ON SCROLL ====================

    /**
     * Change header background on scroll
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

    // ==================== PARALLAX EFFECT ====================

    /**
     * Apply parallax effect to elements
     */
    function handleParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const rect = element.getBoundingClientRect();
            
            // Only apply parallax if element is in viewport
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = -(window.pageYOffset * speed);
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    // ==================== CARD REVEAL ANIMATIONS ====================

    /**
     * Animate product cards on scroll
     */
    function initCardAnimations() {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.2 });

        // Observe section3 and section4 cards
        const section3Cards = document.querySelectorAll('.section3-slider-card');
        const section4Cards = document.querySelectorAll('.section4-slider-card');
        
        [...section3Cards, ...section4Cards].forEach(card => {
            cardObserver.observe(card);
        });

        // Observe store cards
        const storeCards = document.querySelectorAll('.store-card');
        storeCards.forEach(card => {
            cardObserver.observe(card);
        });

        // Observe gallery thumbnails
        const galleryThumbs = document.querySelectorAll('.gallery-thumb');
        galleryThumbs.forEach(thumb => {
            cardObserver.observe(thumb);
        });
    }

    // ==================== BACKGROUND COLOR CHANGE ON SCROLL ====================

    /**
     * Change section background colors on scroll
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

    // ==================== SCROLL REVEAL FOR CATALOG PAGE ====================

    /**
     * Reveal catalog cards on scroll
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
            // Initial state
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.6s ease ${index * 0.05}s`;
            
            catalogObserver.observe(card);
        });
    }

    // ==================== EVENT LISTENERS ====================

    document.addEventListener('DOMContentLoaded', function() {
        
        // Initialize all animations
        initScrollAnimations();
        initCounters();
        initCardAnimations();
        initCatalogAnimations();

        // Header scroll effect
        window.addEventListener('scroll', handleHeaderScroll);
        handleHeaderScroll(); // Initial check

        // Background change on scroll
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                handleBackgroundChange();
                handleParallax();
            }, 50);
        });

        // Initial background check
        handleBackgroundChange();

        console.log('Scroll animations initialized!');
    });

    // ==================== UTILITY FUNCTIONS ====================

    /**
     * Add animation to element programmatically
     */
    function addScrollAnimation(element, animationType) {
        element.classList.add('scroll-animate');
        element.setAttribute('data-animation', animationType);
    }

    /**
     * Trigger animation manually
     */
    function triggerAnimation(element) {
        element.classList.add('animated');
    }

    /**
     * Reset animation (for replay)
     */
    function resetAnimation(element) {
        element.classList.remove('animated');
        // Force reflow
        void element.offsetWidth;
        element.classList.add('animated');
    }

    // ==================== EXPORT TO GLOBAL SCOPE ====================

    window.addScrollAnimation = addScrollAnimation;
    window.triggerAnimation = triggerAnimation;
    window.resetAnimation = resetAnimation;

    console.log('Scroll animation system ready!');

})();

