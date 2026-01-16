/**
 * Mental Lion - Anna Jaworska
 * Nowoczesny JavaScript 2026
 */

document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // LOADER
    // =============================================
    const loader = document.getElementById('loader');

    // Dodaj klasę loading do body
    document.body.classList.add('loading');

    // Ukryj loader po załadowaniu
    window.addEventListener('load', function() {
        setTimeout(function() {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');

            // Uruchom animacje po ukryciu loadera
            initRevealAnimations();
            initCounterAnimation();
        }, 1500); // Minimalny czas wyświetlania loadera
    });

    // =============================================
    // ELEMENTY DOM
    // =============================================
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const cursorFollower = document.querySelector('.cursor-follower');

    // =============================================
    // CURSOR FOLLOWER (tylko desktop)
    // =============================================
    if (window.matchMedia('(hover: hover)').matches && cursorFollower) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Smooth follow
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;

            cursorFollower.style.left = cursorX - 15 + 'px';
            cursorFollower.style.top = cursorY - 15 + 'px';

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Efekt hover na elementach interaktywnych
        const interactiveElements = document.querySelectorAll('a, button, .workshop-card');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.style.transform = 'scale(1.5)';
                cursorFollower.style.borderColor = '#ec4899';
            });
            el.addEventListener('mouseleave', () => {
                cursorFollower.style.transform = 'scale(1)';
                cursorFollower.style.borderColor = '#6366f1';
            });
        });
    }

    // =============================================
    // NAWIGACJA - SCROLL EFFECT
    // =============================================
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Dodaj klasę scrolled po przewinięciu
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // =============================================
    // MENU MOBILNE
    // =============================================
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Zamknij menu po kliknięciu w link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // =============================================
    // SMOOTH SCROLL
    // =============================================
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;

                    window.scrollTo({
                        top: targetPosition - navbarHeight - 20,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // =============================================
    // REVEAL ANIMATIONS (Intersection Observer)
    // =============================================
    function initRevealAnimations() {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    }

    // =============================================
    // COUNTER ANIMATION
    // =============================================
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number[data-count]');

        const observerOptions = {
            threshold: 0.5
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-count'));
                    animateCounter(counter, target);
                    observer.unobserve(counter);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 60; // 60 klatek
        const duration = 2000; // 2 sekundy
        const stepTime = duration / 60;

        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }

    // =============================================
    // PARTICLES (proste cząsteczki w tle hero)
    // =============================================
    const particlesContainer = document.getElementById('particles');

    if (particlesContainer) {
        createParticles();
    }

    function createParticles() {
        const particleCount = 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Losowe właściwości
            const size = Math.random() * 4 + 2;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 20 + 10;
            const delay = Math.random() * 5;

            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
                border-radius: 50%;
                left: ${x}%;
                top: ${y}%;
                animation: particleFloat ${duration}s ease-in-out ${delay}s infinite;
                pointer-events: none;
            `;

            particlesContainer.appendChild(particle);
        }

        // Dodaj animację CSS dla cząsteczek
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                    opacity: 0.5;
                }
                25% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.2);
                    opacity: 0.8;
                }
                50% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0.8);
                    opacity: 0.3;
                }
                75% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.1);
                    opacity: 0.6;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // =============================================
    // PARALLAX EFFECT NA HERO SHAPES
    // =============================================
    const shapes = document.querySelectorAll('.shape');

    if (shapes.length > 0 && window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 20;
                const x = mouseX * speed;
                const y = mouseY * speed;

                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }

    // =============================================
    // FORMULARZ - WALIDACJA I FEEDBACK
    // =============================================
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = contactForm.querySelector('.btn-submit');
            const originalHTML = submitBtn.innerHTML;

            // Zmień tekst przycisku
            submitBtn.innerHTML = '<span>Wysyłanie...</span>';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';

            // Web3Forms obsługuje resztę
            // Po wysłaniu użytkownik zostanie przekierowany
        });

        // Floating labels effect
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
    }

    // =============================================
    // AKTYWNY LINK W NAWIGACJI
    // =============================================
    const sections = document.querySelectorAll('section[id]');

    function setActiveLink() {
        const scrollPosition = window.pageYOffset + navbar.offsetHeight + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);

    // =============================================
    // WORKSHOP CARDS - STAGGER ANIMATION
    // =============================================
    const workshopCards = document.querySelectorAll('.workshop-card');

    workshopCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.05}s`;
    });

    // =============================================
    // EASTER EGG - Konami Code
    // =============================================
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', function(e) {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                document.body.style.animation = 'rainbow 2s linear infinite';
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes rainbow {
                        0% { filter: hue-rotate(0deg); }
                        100% { filter: hue-rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
                konamiIndex = 0;

                setTimeout(() => {
                    document.body.style.animation = '';
                }, 5000);
            }
        } else {
            konamiIndex = 0;
        }
    });

    console.log('%c Mental Lion ', 'background: linear-gradient(135deg, #6366f1, #ec4899); color: white; padding: 10px 20px; border-radius: 10px; font-size: 16px; font-weight: bold;');
    console.log('%c Strona załadowana pomyślnie! ', 'color: #6366f1;');
});
