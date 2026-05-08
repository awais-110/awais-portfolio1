(function () {
    function renderIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function toggleMobileMenu() {
        const menu = document.getElementById('mobile-menu');
        const menuIcon = document.getElementById('menu-icon');
        const closeIcon = document.getElementById('close-icon');

        if (!menu || !menuIcon || !closeIcon) {
            return;
        }

        const isActive = menu.classList.toggle('active');
        menuIcon.style.display = isActive ? 'none' : 'block';
        closeIcon.style.display = isActive ? 'block' : 'none';
        renderIcons();
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function animateCounter(element, target) {
        if (!element || element.dataset.counted === 'true') {
            return;
        }

        element.dataset.counted = 'true';

        let current = 0;
        const increment = target / 100;
        const duration = 2000;
        const stepTime = duration / 100;

        const timer = window.setInterval(() => {
            current += increment;

            if (current >= target) {
                element.textContent = target;
                window.clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, stepTime);
    }

    function handleSubmit(event) {
        event.preventDefault();

        const form = document.getElementById('contactForm');
        const btnText = document.getElementById('btnText');
        const btnIcon = document.getElementById('btnIcon');

        if (!form || !btnText || !btnIcon) {
            return;
        }

        btnText.textContent = 'Message Sent!';
        btnIcon.setAttribute('data-lucide', 'check-circle');
        renderIcons();

        window.setTimeout(() => {
            btnText.textContent = 'Send Message';
            btnIcon.setAttribute('data-lucide', 'send');
            renderIcons();
            form.reset();
        }, 3000);
    }

    async function handleCvDownload(event) {
        event.preventDefault();

        const link = event.currentTarget;
        const fileUrl = link.href;
        const downloadName = link.getAttribute('download') || 'Tehreem_Malik_CV.pdf';

        try {
            const response = await fetch(fileUrl, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`Download failed with status ${response.status}`);
            }

            const blob = await response.blob();
            const objectUrl = window.URL.createObjectURL(blob);
            const tempLink = document.createElement('a');

            tempLink.href = objectUrl;
            tempLink.download = downloadName;
            tempLink.style.display = 'none';

            document.body.appendChild(tempLink);
            tempLink.click();
            tempLink.remove();

            window.setTimeout(() => {
                window.URL.revokeObjectURL(objectUrl);
            }, 1000);
        } catch (error) {
            // Keep the portfolio page open even if the browser blocks blob downloads.
            const fallbackLink = document.createElement('a');
            fallbackLink.href = fileUrl;
            fallbackLink.download = downloadName;
            fallbackLink.target = '_blank';
            fallbackLink.rel = 'noopener';
            fallbackLink.style.display = 'none';

            document.body.appendChild(fallbackLink);
            fallbackLink.click();
            fallbackLink.remove();

            window.console.warn('CV download fell back to the browser default behavior.', error);
        }
    }

    function initializePage() {
        if (!document.body || document.body.dataset.portfolioInitialized === 'true') {
            return;
        }

        document.body.dataset.portfolioInitialized = 'true';

        renderIcons();
        window.addEventListener('load', renderIcons, { once: true });

        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            window.setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 2500);
        }

        const particlesContainer = document.getElementById('particles');
        if (particlesContainer && particlesContainer.children.length === 0) {
            for (let i = 0; i < 50; i += 1) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 15}s`;
                particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
                particlesContainer.appendChild(particle);
            }
        }

        const navbar = document.getElementById('navbar');
        const backToTopButton = document.getElementById('back-to-top');
        const updateScrollUi = () => {
            if (navbar) {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            }

            if (backToTopButton) {
                backToTopButton.classList.toggle('visible', window.scrollY > 420);
            }
        };

        updateScrollUi();
        window.addEventListener('scroll', updateScrollUi, { passive: true });

        if (backToTopButton) {
            backToTopButton.addEventListener('click', scrollToTop);
        }

        const animatedElements = document.querySelectorAll(
            '.section-header, .about-content, .feature-card, .education-item, ' +
            '.skill-item, .skill-progress, ' +
            '.project-card, .achievement-card, .contact-info, .contact-form'
        );

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add('visible');

                    if (entry.target.classList.contains('achievement-card')) {
                        const number = entry.target.querySelector('.achievement-number');
                        const target = Number.parseInt(number?.getAttribute('data-target') ?? '0', 10);
                        animateCounter(number, target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach((element) => observer.observe(element));
        } else {
            animatedElements.forEach((element) => element.classList.add('visible'));
        }

        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (event) {
                const href = this.getAttribute('href');
                if (!href || href === '#') {
                    event.preventDefault();
                    return;
                }

                event.preventDefault();
                const target = document.querySelector(href);

                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        const downloadCvButton = document.getElementById('download-cv-btn');
        if (downloadCvButton) {
            downloadCvButton.addEventListener('click', handleCvDownload);
        }
    }

    window.toggleMobileMenu = toggleMobileMenu;
    window.scrollToTop = scrollToTop;
    window.handleSubmit = handleSubmit;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePage, { once: true });
    } else {
        initializePage();
    }
}());
