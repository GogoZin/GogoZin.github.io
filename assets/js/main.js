// Particle Generation
        function createParticles() {
            const bg = document.querySelector(`.animated-bg`);
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement(`div`);
                particle.className = `particle`;
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 20}s`;
                particle.style.animationDuration = `${15 + Math.random() * 10}s`;
                bg.appendChild(particle);
            }
        }

        // Scroll Progress Bar
        function updateScrollProgress() {
            const scrollProgress = document.querySelector(`.scroll-progress`);
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;
            scrollProgress.style.transform = `scaleX(${progress / 100})`;
        }

        // Navbar Scroll Effect
        function handleNavbarScroll() {
            const navbar = document.getElementById(`navbar`);
            if (window.scrollY > 50) {
                navbar.classList.add(`scrolled`);
            } else {
                navbar.classList.remove(`scrolled`);
            }
        }

        // Intersection Observer for Reveal Animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: `0px 0px -100px 0px`
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add(`reveal`);
                    }, delay);
                }
            });
        }, observerOptions);

        // Custom Cursor
        function initCustomCursor() {
            const cursor = document.querySelector(`.custom-cursor`);
            const follower = document.querySelector(`.cursor-follower`);

            let mouseX = 0, mouseY = 0;
            let cursorX = 0, cursorY = 0;
            let followerX = 0, followerY = 0;

            document.addEventListener(`mousemove`, (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                cursor.style.opacity = `1`;
                follower.style.opacity = `1`;
            });

            function animate() {
                const speed = 0.15;

                cursorX += (mouseX - cursorX) * speed;
                cursorY += (mouseY - cursorY) * speed;

                followerX += (mouseX - followerX) * speed * 0.5;
                followerY += (mouseY - followerY) * speed * 0.5;

                cursor.style.left = `${cursorX}px`;
                cursor.style.top = `${cursorY}px`;
                follower.style.left = `${followerX}px`;
                follower.style.top = `${followerY}px`;

                requestAnimationFrame(animate);
            }
            animate();

            document.querySelectorAll(`a, button, .service-card, .contact-link`).forEach(el => {
                el.addEventListener(`mouseenter`, () => {
                    cursor.style.transform = `translate(-50%, -50%) scale(1.5)`;
                    follower.style.transform = `translate(-50%, -50%) scale(1.5)`;
                });
                el.addEventListener(`mouseleave`, () => {
                    cursor.style.transform = `translate(-50%, -50%) scale(1)`;
                    follower.style.transform = `translate(-50%, -50%) scale(1)`;
                });
            });
        }

        // Ripple Effect
        function createRipple(e) {
            const button = e.currentTarget;
            const ripple = document.createElement(`span`);
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.className = `ripple`;
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        }

        // Smooth Scroll
        document.querySelectorAll(`a[href^="#"]`).forEach(anchor => {
            anchor.addEventListener(`click`, function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute(`href`));
                if (target) {
                    target.scrollIntoView({
                        behavior: `smooth`,
                        block: `start`
                    });
                }
            });
        });

        // Initialize
        document.addEventListener(`DOMContentLoaded`, () => {
            createParticles();
            initCustomCursor();

            // Observe all animatable elements
            document.querySelectorAll(`.service-card, .about-card, .feature-item, .contact-link`).forEach(el => {
                observer.observe(el);
            });

            // Add ripple effect to buttons
            document.querySelectorAll(`.cta-button, .contact-link`).forEach(button => {
                button.addEventListener(`click`, createRipple);
            });

            // Scroll events
            window.addEventListener(`scroll`, () => {
                updateScrollProgress();
                handleNavbarScroll();
            });
        });