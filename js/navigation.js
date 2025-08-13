// Navigation and scrolling management
class NavigationManager {
    constructor() {
        this.sections = Array.from(document.querySelectorAll('section.section, #hero'));
        this.navLinks = Array.from(document.querySelectorAll('.nav-links a'));
        this.isSnapping = false;
        
        this.init();
    }

    init() {
        this.setupObserver();
        this.setupBurgerMenu();
        this.setupNavigation();
        this.setupFlipCards();
    }

    setupObserver() {
        let currentActive = null;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && currentActive !== entry.target.id) {
                    currentActive = entry.target.id;
                    this.setActiveById(entry.target.id);
                }
            });
        }, { threshold: 0.5, rootMargin: '-10% 0px -10% 0px' }); // Only trigger when well within viewport
        this.sections.forEach(s => observer.observe(s));
    }

    setupBurgerMenu() {
        const navEl = document.querySelector('nav');
        const burger = document.querySelector('.burger');
        
        burger.addEventListener('click', () => {
            const open = navEl.classList.toggle('open');
            burger.setAttribute('aria-expanded', String(open));
            
            // Animate drawer items with micro-physics when opening/closing
            const mo = window.__mo;
            if (mo && mo.animate) {
                const links = Array.from(document.querySelectorAll('.nav-links a'));
                links.forEach((a, i) => {
                    if (open) {
                        // Staggered enter
                        a.style.opacity = '0';
                        mo.animate(a, { opacity: [0,1], x: [16, 0] }, { duration: 0.3, delay: i * 0.03, easing: mo.springEase });
                    } else {
                        mo.animate(a, { opacity: [1,0], x: [0, 8] }, { duration: 0.2, delay: (links.length - i) * 0.02, easing: 'ease-out' });
                    }
                });
            }
        });
        
        // Close drawer on link click
        document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
            if (navEl.classList.contains('open')) {
                navEl.classList.remove('open');
                document.querySelector('.burger').setAttribute('aria-expanded', 'false');
            }
        }));
        
        // Close drawer when clicking on overlay
        document.addEventListener('click', (e) => {
            if (navEl.classList.contains('open') && 
                !navEl.contains(e.target) && 
                !burger.contains(e.target)) {
                navEl.classList.remove('open');
                burger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    setupNavigation() {
        // Navigation clicks -> native smooth scroll
        document.querySelectorAll('.nav-links a').forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const id = link.getAttribute('href').slice(1);
                const target = document.getElementById(id);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // CTA button -> native smooth scroll
        const ctaButton = document.querySelector('[data-target="classes"]');
        if (ctaButton) {
            ctaButton.addEventListener('click', (e) => {
                e.preventDefault();
                const t = document.getElementById('classes');
                if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }

    setupFlipCards() {
        // Flip-card behavior: flip on enter, fade back on leave without flipping
        const cards = document.querySelectorAll('#enhancedPracticesPanel .flip-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.classList.add('hovering');
            });
            card.addEventListener('mouseleave', () => {
                card.classList.add('fade-back');
                card.classList.remove('hovering');
                setTimeout(() => {
                    card.classList.remove('fade-back');
                }, 900); // matches longer opacity transition
            });
        });
    }

    setActiveById(id) {
        this.navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
        
        const titleEl = document.querySelector('#currentSectionTitle');
        if (titleEl) titleEl.textContent = '';
    }
}

// Initialize navigation manager
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new NavigationManager());
} else {
    new NavigationManager();
}
