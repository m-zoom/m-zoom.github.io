// Tab switching functionality with smooth fade transitions
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    
    // Hide all tab contents with fade out
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
        tabcontent[i].style.opacity = "0";
    }
    
    // Remove active class from all buttons
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    
    // Show selected tab with fade in
    setTimeout(() => {
        var activeTab = document.getElementById(tabName);
        if (activeTab) {
            activeTab.classList.add("active");
            setTimeout(() => {
                activeTab.style.opacity = "1";
            }, 10);
        }
    }, 300);
    
    // Add active class to clicked button
    evt.currentTarget.classList.add("active");
}

// Scroll reveal animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with scroll-reveal class
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));
    
    // Initialize first tab if exists
    const firstTab = document.querySelector('.tab-content.active');
    if (firstTab) {
        firstTab.style.opacity = "1";
    }
    
    // Sticky header scroll animation
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Hero Slider Functionality
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = document.querySelector('.slider-btn.prev');
        const nextBtn = document.querySelector('.slider-btn.next');
        const dotsContainer = document.querySelector('.slider-dots');
        
        if (slides.length > 0) {
            let currentSlide = 0;
            let autoSlideInterval = null;
            let isPaused = false;
            
            // Create dots if container exists
            let dots = [];
            if (dotsContainer) {
                slides.forEach((_, index) => {
                    const dot = document.createElement('div');
                    dot.classList.add('slider-dot');
                    if (index === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => goToSlide(index));
                    dotsContainer.appendChild(dot);
                });
                dots = dotsContainer.querySelectorAll('.slider-dot');
            }
            
            function updateSlider() {
                slides.forEach((slide, index) => {
                    slide.classList.remove('active');
                    if (dots[index]) dots[index].classList.remove('active');
                });
                
                slides[currentSlide].classList.add('active');
                if (dots[currentSlide]) dots[currentSlide].classList.add('active');
            }
            
            function nextSlide() {
                currentSlide = (currentSlide + 1) % slides.length;
                updateSlider();
            }
            
            function prevSlide() {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                updateSlider();
            }
            
            function goToSlide(index) {
                if (index >= 0 && index < slides.length) {
                    currentSlide = index;
                    updateSlider();
                    resetAutoSlide();
                }
            }
            
            function startAutoSlide() {
                // Always clear existing interval first
                if (autoSlideInterval !== null) {
                    clearInterval(autoSlideInterval);
                    autoSlideInterval = null;
                }
                
                // Only start if not paused
                if (!isPaused) {
                    autoSlideInterval = setInterval(() => {
                        nextSlide();
                    }, 5000);
                }
            }
            
            function stopAutoSlide() {
                if (autoSlideInterval !== null) {
                    clearInterval(autoSlideInterval);
                    autoSlideInterval = null;
                }
            }
            
            function resetAutoSlide() {
                stopAutoSlide();
                startAutoSlide();
            }
            
            // Event listeners
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    nextSlide();
                    resetAutoSlide();
                });
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    prevSlide();
                    resetAutoSlide();
                });
            }
            
            // Pause on hover
            slider.addEventListener('mouseenter', () => {
                isPaused = true;
                stopAutoSlide();
            });
            
            slider.addEventListener('mouseleave', () => {
                isPaused = false;
                startAutoSlide();
            });
            
            // Handle page visibility - restart when page becomes visible
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    stopAutoSlide();
                } else {
                    if (!isPaused) {
                        startAutoSlide();
                    }
                }
            });
            
            // Ensure slider continues even when scrolling - use IntersectionObserver
            const sliderObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Slider is visible - ensure it's running
                        if (!isPaused && autoSlideInterval === null) {
                            startAutoSlide();
                        }
                    }
                });
            }, { threshold: 0.1 });
            
            sliderObserver.observe(slider);
            
            // Start auto-slide
            startAutoSlide();
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    prevSlide();
                    resetAutoSlide();
                } else if (e.key === 'ArrowRight') {
                    nextSlide();
                    resetAutoSlide();
                }
            });
        }
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    const body = document.body;
    
    if (mobileMenuToggle && nav) {
        // Create overlay element
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
        
        function openMenu() {
            mobileMenuToggle.classList.add('active');
            nav.classList.add('active');
            body.classList.add('menu-open');
            overlay.classList.add('active');
        }
        
        function closeMenu() {
            mobileMenuToggle.classList.remove('active');
            nav.classList.remove('active');
            body.classList.remove('menu-open');
            overlay.classList.remove('active');
        }
        
        mobileMenuToggle.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        
        // Close menu when clicking on overlay
        overlay.addEventListener('click', closeMenu);
        
        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
});


