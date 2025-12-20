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

// Mobile menu toggle (placeholder)
const hamburger = document.querySelector('.hamburger');
if (hamburger) {
    hamburger.addEventListener('click', function () {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
    });
}
