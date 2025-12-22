// Header scroll effect
window.addEventListener('scroll', function () {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Cookie Consent Management
document.addEventListener('DOMContentLoaded', function () {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');

    if (!cookieConsent) {
        // Show cookie banner after a short delay
        setTimeout(() => {
            document.getElementById('cookieConsent').classList.add('show');
        }, 1000);
    }
});

// Toggle cookie category details
function toggleCategory(categoryId) {
    const content = document.getElementById(categoryId);
    const header = content.previousElementSibling;
    const arrow = header.querySelector('.category-arrow');

    if (content.style.display === 'block') {
        content.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)';
    } else {
        content.style.display = 'block';
        arrow.style.transform = 'rotate(90deg)';
    }
}

// Close cookie banner
function closeCookieBanner() {
    document.getElementById('cookieConsent').classList.remove('show');
}

// Show cookie banner (from floating button)
function showCookieBanner() {
    document.getElementById('cookieConsent').classList.add('show');
}

// Accept all cookies
function acceptAll() {
    const preferences = {
        necessary: true,
        functional: true,
        analytics: true,
        performance: true,
        timestamp: new Date().toISOString()
    };

    // Seleziona automaticamente tutte le checkbox
    document.getElementById('functional-cookies').checked = true;
    document.getElementById('analytics-cookies').checked = true;
    document.getElementById('performance-cookies').checked = true;

    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    document.getElementById('cookieConsent').classList.remove('show');

    // Enable all cookie types
    enableCookies(preferences);
}

// Reject all optional cookies
function rejectAll() {
    const preferences = {
        necessary: true,
        functional: false,
        analytics: false,
        performance: false,
        timestamp: new Date().toISOString()
    };

    // Deseleziona automaticamente tutte le checkbox
    document.getElementById('functional-cookies').checked = false;
    document.getElementById('analytics-cookies').checked = false;
    document.getElementById('performance-cookies').checked = false;

    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    document.getElementById('cookieConsent').classList.remove('show');

    // Only enable necessary cookies
    enableCookies(preferences);
}

// Save custom preferences
function savePreferences() {
    const preferences = {
        necessary: true, // Always true
        functional: document.getElementById('functional-cookies').checked,
        analytics: document.getElementById('analytics-cookies').checked,
        performance: document.getElementById('performance-cookies').checked,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    document.getElementById('cookieConsent').classList.remove('show');

    // Enable selected cookies
    enableCookies(preferences);
}

// Enable cookies based on preferences
function enableCookies(preferences) {
    // Here you would enable/disable actual cookie functionality
    // For example, Google Analytics, Facebook Pixel, etc.

    if (preferences.analytics) {
        // Enable analytics cookies
        console.log('Analytics cookies enabled');
    }

    if (preferences.functional) {
        // Enable functional cookies
        console.log('Functional cookies enabled');
    }

    if (preferences.performance) {
        // Enable performance cookies
        console.log('Performance cookies enabled');
    }
}

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Close menu when clicking on a link
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (event) {
        const isClickInsideNav = navLinks.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);

        if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
}

// Scroll Animations
document.addEventListener('DOMContentLoaded', function () {
    // Add animation classes to elements
    const heroSection = document.querySelector('.hero-section');
    const servicesSection = document.querySelector('.services-section');
    const serviceBoxes = document.querySelectorAll('.service-box');
    const footer = document.querySelector('footer');
    const aboutSection = document.querySelector('.about-section');

    // Add initial hidden state
    if (heroSection) heroSection.classList.add('animate-on-scroll');
    if (aboutSection) {
        const aboutTitle = aboutSection.querySelector('.section-title');
        const aboutText = aboutSection.querySelector('.about-text');
        if (aboutTitle) aboutTitle.classList.add('animate-on-scroll');
        if (aboutText) aboutText.classList.add('animate-on-scroll');
    }
    if (servicesSection) {
        const servicesTitle = servicesSection.querySelector('.services-title');
        if (servicesTitle) servicesTitle.classList.add('animate-on-scroll');
    }
    serviceBoxes.forEach((box, index) => {
        box.classList.add('animate-on-scroll');
        box.style.transitionDelay = `${index * 0.1}s`;
    });
    if (footer) footer.classList.add('animate-on-scroll');

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Stop observing after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // Parallax effect for hero shapes
    const shapes = document.querySelectorAll('.abstract-shape');
    let ticking = false;

    function updateParallax() {
        const scrolled = window.pageYOffset;
        const heroHeight = heroSection ? heroSection.offsetHeight : 0;

        if (scrolled < heroHeight) {
            shapes.forEach((shape, index) => {
                const speed = 0.1 + (index * 0.05); // Different speeds for each shape
                const yPos = -(scrolled * speed);
                shape.style.transform = `translateY(${yPos}px)`;
            });
        }

        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
});
