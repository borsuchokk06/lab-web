// Parallax Effect Script
(function() {
    'use strict';

    // Skip parallax if user prefers reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        console.log('Parallax disabled (prefers-reduced-motion)');
        return;
    }

    let ticking = false;
    let lastScrollY = window.pageYOffset;

    // Cache parallax elements
    const section = document.querySelector('.parallax-section');
    if (!section) {
        console.warn('Parallax section not found');
        return;
    }

    // Layers (wrappers)
    const layers = section.querySelectorAll('.parallax-layer');
    // Individual elements with speed
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

        // Get section bounds to create local parallax relative to section
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.pageYOffset;
        const relativeY = lastScrollY - sectionTop; // scroll offset relative to section

        // Update layer offsets (slower for background, faster for foreground)
        layers.forEach(layer => {
            const speedAttr = layer.getAttribute('data-parallax-speed');
            const speed = speedAttr ? parseFloat(speedAttr) : 0.5;
            const translateY = -relativeY * speed * 0.2; // soften motion factor
            layer.style.transform = `translate3d(0, ${translateY}px, 0)`;
        });

        // Update individual elements (including reverse motion with negative speed)
        elements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax-speed')) || 0.5;
            // Only process elements inside the parallax section
            if (!section.contains(el)) return;

            // Compute element motion
            const moveY = -relativeY * speed * 0.3; // element motion factor
            el.style.transform = `translate3d(0, ${moveY}px, 0)`;
        });
    }

    // Visibility handling to avoid doing work in background tabs
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            requestTick();
        }
    });

    // Resize handling (recalculate positions)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            requestTick();
        }, 150);
    });

    // Initial kick
    window.addEventListener('scroll', onScroll, { passive: true });
    requestTick();

    console.log('Parallax initialized');
})();
