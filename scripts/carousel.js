document.addEventListener('DOMContentLoaded', () => {
    // Wrap in try-catch to prevent silent failures
    try {
        const track = document.querySelector('.reset-carousel-track');
        const cards = document.querySelectorAll('.reset-card');
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next');

        // Overlay setup
        let overlay = document.querySelector('.card-clone-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.classList.add('card-clone-overlay');
            document.body.appendChild(overlay);
        }

        if (track && cards.length > 0) {
            // Configuration
            const originalCardsCount = cards.length;
            const cloneCount = Math.min(3, originalCardsCount); // Ensure we don't clone more than exist

            // --- Cloning ---
            const clonesToAppend = [];
            const clonesToPrepend = [];

            for (let i = 0; i < cloneCount; i++) {
                if (cards[i]) clonesToAppend.push(cards[i].cloneNode(true));
                if (cards[originalCardsCount - 1 - i]) clonesToPrepend.push(cards[originalCardsCount - 1 - i].cloneNode(true));
            }

            clonesToAppend.forEach(clone => {
                clone.classList.add('clone');
                track.appendChild(clone);
            });

            clonesToPrepend.forEach(clone => {
                clone.classList.add('clone');
                track.insertBefore(clone, track.firstChild);
            });

            // Re-select all cards (REAL Source of Truth)
            const allCards = document.querySelectorAll('.reset-card');

            // Set Start Index (First real card)
            let currentIndex = cloneCount;

            // Dimensions Config
            const getDimensions = () => {
                if (window.innerWidth <= 768) {
                    return { inactive: 60, active: 260, gap: 15 };
                }
                return { inactive: 80, active: 350, gap: 15 };
            };

            // Main Update Function
            const updateCarousel = (index, animate = true) => {
                // Bounds check
                if (index < 0) index = 0;
                if (index >= allCards.length) index = allCards.length - 1;

                requestAnimationFrame(() => {
                    // 1. Set Active Class
                    allCards.forEach((c, i) => {
                        if (i === index) c.classList.add('active');
                        else c.classList.remove('active');
                    });

                    // 2. Calculate Position
                    const dims = getDimensions();
                    const containerWidth = track.parentElement ? track.parentElement.offsetWidth : window.innerWidth;

                    const previousItemsWidth = index * (dims.inactive + dims.gap);
                    const centerOfTarget = previousItemsWidth + (dims.active / 2);
                    const desiredTrackPosition = (containerWidth / 2) - centerOfTarget;

                    // Apply
                    if (animate) {
                        track.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
                    } else {
                        track.style.transition = 'none';
                    }

                    track.style.transform = `translateX(${desiredTrackPosition}px)`;
                });

                currentIndex = index;
            };

            // Initial Render
            setTimeout(() => {
                updateCarousel(currentIndex, false);
            }, 50);

            // Infinite Loop Handler
            let isTransitioning = false;
            track.addEventListener('transitionend', () => {
                isTransitioning = false;

                if (currentIndex >= originalCardsCount + cloneCount) {
                    // Loop back to start
                    const newIndex = cloneCount;
                    // Force reflow/frame wait before removing transition
                    requestAnimationFrame(() => {
                        updateCarousel(newIndex, false);
                    });
                }
                else if (currentIndex < cloneCount) {
                    // Loop to end
                    const newIndex = originalCardsCount + cloneCount - 1;
                    requestAnimationFrame(() => {
                        updateCarousel(newIndex, false);
                    });
                }
            });

            // Controls
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    if (isTransitioning) return;
                    isTransitioning = true;
                    updateCarousel(currentIndex + 1);
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    if (isTransitioning) return;
                    isTransitioning = true;
                    updateCarousel(currentIndex - 1);
                });
            }

            // Click Interaction (Center or Expand)
            track.addEventListener('click', (e) => {
                const card = e.target.closest('.reset-card');
                if (!card) return;

                // Determine index in allCards
                let index = -1;
                for (let i = 0; i < allCards.length; i++) {
                    if (allCards[i] === card) {
                        index = i;
                        break;
                    }
                }

                if (index === -1) return;

                if (index === currentIndex) {
                    // Expand
                    expandCard(card);
                } else {
                    // Center
                    if (isTransitioning) return;
                    isTransitioning = true;
                    updateCarousel(index);
                }
            });

            // Resize Helper
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    updateCarousel(currentIndex, false);
                }, 100);
            });

            // Expand Logic
            function expandCard(card) {
                stopAutoScroll(); // Stop auto-scroll when expanding
                const rect = card.getBoundingClientRect();
                const clone = card.cloneNode(true);

                clone.classList.add('clone-animating');
                clone.classList.add('active'); // Ensure active styling
                // Fixed position for animation start
                clone.style.top = `${rect.top}px`;
                clone.style.left = `${rect.left}px`;
                clone.style.width = `${rect.width}px`;
                clone.style.height = `${rect.height}px`;
                clone.style.margin = '0'; // override

                // Add Close Button
                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '&times;';
                closeBtn.classList.add('expanded-close-btn');
                closeBtn.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    closeExpandedCard();
                });
                clone.appendChild(closeBtn);

                document.body.appendChild(clone);

                // Trigger animation next frame
                requestAnimationFrame(() => {
                    clone.classList.add('expanded');
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });

                const closeExpandedCard = () => {
                    clone.classList.remove('expanded');
                    overlay.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    setTimeout(() => {
                        clone.remove();
                        startAutoScroll(); // Restart auto-scroll after closing
                    }, 500);
                };

                overlay.onclick = closeExpandedCard;
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') closeExpandedCard();
                }, { once: true });
            }

            // --- Auto Scroll Logic ---
            let autoScrollInterval;
            const autoScrollDelay = 7000; // 7 seconds

            const startAutoScroll = () => {
                stopAutoScroll(); // Clear any existing
                autoScrollInterval = setInterval(() => {
                    if (!isTransitioning) {
                        isTransitioning = true;
                        updateCarousel(currentIndex + 1);
                    }
                }, autoScrollDelay);
            };

            const stopAutoScroll = () => {
                clearInterval(autoScrollInterval);
            };

            // Start initially
            startAutoScroll();

            // Pause on interaction
            track.addEventListener('mouseenter', stopAutoScroll);
            track.addEventListener('mouseleave', startAutoScroll);
            track.addEventListener('touchstart', stopAutoScroll);
            track.addEventListener('touchend', startAutoScroll);

            if (nextBtn) {
                nextBtn.addEventListener('mouseenter', stopAutoScroll);
                nextBtn.addEventListener('mouseleave', startAutoScroll);
            }
            if (prevBtn) {
                prevBtn.addEventListener('mouseenter', stopAutoScroll);
                prevBtn.addEventListener('mouseleave', startAutoScroll);
            }

        }
    } catch (e) {
        console.error("Carousel Error:", e);
    }
});
