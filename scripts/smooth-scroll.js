// Smooth Scroll to Sections
(function() {
    'use strict';

    // Configuration
    const scrollOffset = 80; // Offset for fixed header
    const scrollDuration = 1000; // Animation duration in ms

    /**
     * Smooth scroll to element
     */
    function smoothScrollTo(target, offset = scrollOffset) {
        const targetElement = document.querySelector(target);
        
        if (!targetElement) {
            console.warn('Scroll target not found:', target);
            return;
        }

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        // Easing function (easeInOutCubic)
        function easeInOutCubic(t) {
            return t < 0.5 
                ? 4 * t * t * t 
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        // Animation loop
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / scrollDuration, 1);
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + distance * ease);

            if (timeElapsed < scrollDuration) {
                requestAnimationFrame(animation);
            } else {
                // Scroll complete
                console.log('Scrolled to:', target);
                
                // Show notification
                if (typeof toastInfo === 'function') {
                    const sectionName = target.replace('#', '').replace('-', ' ');
                    toastInfo('Section', `Navigated to ${sectionName}`, { duration: 2000 });
                }
            }
        }

        requestAnimationFrame(animation);
    }

    /**
     * Handle navigation link clicks
     */
    function handleNavClick(e) {
        const href = this.getAttribute('href');
        
        // Only handle anchor links (starting with #)
        if (href && href.startsWith('#')) {
            e.preventDefault();
            
            smoothScrollTo(href);
            
            // Close mobile menu if open
            if (typeof closeMenu === 'function' || window.closeMenu) {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    setTimeout(() => {
                        if (typeof closeMenu !== 'undefined') {
                            closeMenu();
                        }
                    }, 300);
                }
            }

            // Update active state
            updateActiveNavLink(href);
        }
    }

    /**
     * Update active navigation link
     */
    function updateActiveNavLink(target) {
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            if (link.getAttribute('href') === target) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Detect active section on scroll
     */
    function detectActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let currentSection = '';
        const scrollPosition = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Update active link
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // ==================== BACK TO TOP BUTTON ====================

    const backToTopBtn = document.getElementById('back-to-top');

    /**
     * Show/hide back to top button based on scroll position
     */
    function toggleBackToTopButton() {
        if (!backToTopBtn) return;

        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    /**
     * Scroll to top
     */
    function scrollToTop() {
        smoothScrollTo('#home', 0);
    }

    // ==================== SCROLL PROGRESS BAR ====================

    const scrollProgressBar = document.getElementById('scroll-progress');

    /**
     * Update scroll progress bar
     */
    function updateScrollProgress() {
        if (!scrollProgressBar) return;

        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        
        scrollProgressBar.style.width = `${scrolled}%`;
    }

    // ==================== EVENT LISTENERS ====================

    document.addEventListener('DOMContentLoaded', function() {
        
        // Attach smooth scroll to all navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });

        // Back to top button
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', scrollToTop);
        }

        // Scroll event listeners
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            // Throttle scroll events
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                detectActiveSection();
                toggleBackToTopButton();
                updateScrollProgress();
            }, 100);
        });

        // Initial checks
        detectActiveSection();
        toggleBackToTopButton();
        updateScrollProgress();

        // Set first link as active initially
        const firstNavLink = document.querySelector('.nav-link[href="#home"]');
        if (firstNavLink) {
            firstNavLink.classList.add('active');
        }

        console.log('Smooth scroll initialized!');
    });

    // ==================== EXPORT TO GLOBAL SCOPE ====================

    window.smoothScrollTo = smoothScrollTo;
    window.scrollToTop = scrollToTop;

    console.log('Navigation scroll functionality ready!');

})();

