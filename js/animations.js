// Motion One lightweight entrance animations (no GSAP)
class AnimationManager {
    constructor() {
        this.motionApi = window.Motion || window.motion;
        this.animate = this.motionApi && this.motionApi.animate ? this.motionApi.animate : null;
        this.springEase = (this.motionApi && this.motionApi.spring)
            ? this.motionApi.spring({ stiffness: 280, damping: 20, mass: 0.9 })
            : 'cubic-bezier(0.2, 0.8, 0.2, 1)';
        
        if (!this.animate) return;
        
        // Expose for other modules
        window.__mo = { animate: this.animate, springEase: this.springEase };
        
        this.initEntranceAnimations();
        this.initHeroAnimations();
        this.initMicroPhysics();
    }

    initEntranceAnimations() {
        if (!this.animate) return;

        // Hero entrance animation removed to avoid post-load style changes

        // Section titles entrance on first view ONLY (prevent re-animation)
        const animatedTitles = new Set();
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animatedTitles.has(entry.target)) {
                    animatedTitles.add(entry.target);
                    this.animate(entry.target, { opacity: [0,1], y: [12,0] }, { duration: 0.6, easing: 'ease-out' });
                    // Keep observing but don't re-animate
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.section-title').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(12px)';
            io.observe(el);
        });
    }

    initHeroAnimations() {
        // Disable logo rotation to preserve exact color rendering
        // (previous transform caused slight dimming due to compositing)
        const logo = document.querySelector('.hero-brand .hero-logo');
        if (logo) {
            logo.style.transform = 'none';
            logo.style.willChange = 'auto';
        }
    }

    initMicroPhysics() {
        if (!this.animate) return;

        const { animate, springEase } = this;

        const cancelAnim = (ref) => {
            if (!ref) return;
            if (typeof ref.cancel === 'function') ref.cancel();
            else if (typeof ref.stop === 'function') ref.stop();
            else if (Array.isArray(ref)) ref.forEach(r => typeof r.cancel === 'function' && r.cancel());
        };

        // Nav link hover micro-bounce
        const navAnim = new WeakMap();
        document.querySelectorAll('.nav-links a').forEach((link) => {
            link.addEventListener('mouseenter', () => {
                const prev = navAnim.get(link); cancelAnim(prev);
                navAnim.set(link, animate(link, { transform: ['translateY(0) scale(1)', 'translateY(-3px) scale(1.03)'] }, { duration: 0.35, easing: springEase }));
            });
            link.addEventListener('mouseleave', () => {
                const prev = navAnim.get(link); cancelAnim(prev);
                navAnim.set(link, animate(link, { transform: ['translateY(-3px) scale(1.03)', 'translateY(0) scale(1)'] }, { duration: 0.25, easing: springEase }));
            });
            // press feedback
            link.addEventListener('pointerdown', () => {
                const prev = navAnim.get(link); cancelAnim(prev);
                navAnim.set(link, animate(link, { scale: [1, 0.98] }, { duration: 0.12, easing: springEase }));
            });
            link.addEventListener('pointerup', () => {
                const prev = navAnim.get(link); cancelAnim(prev);
                navAnim.set(link, animate(link, { scale: [0.98, 1] }, { duration: 0.18, easing: springEase }));
            });
        });

        // CTA hover micro-bounce
        const cta = document.querySelector('.hero-cta');
        if (cta) {
            let aRef = null;
            cta.addEventListener('mouseenter', () => {
                cancelAnim(aRef);
                aRef = animate(cta, { transform: ['scale(1)', 'scale(1.035)'] }, { duration: 0.25, easing: springEase });
            });
            cta.addEventListener('mouseleave', () => {
                cancelAnim(aRef);
                aRef = animate(cta, { transform: ['scale(1.035)', 'scale(1)'] }, { duration: 0.25, easing: springEase });
            });
            cta.addEventListener('pointerdown', () => {
                cancelAnim(aRef);
                aRef = animate(cta, { scale: [1, 0.98] }, { duration: 0.1, easing: springEase });
            });
            cta.addEventListener('pointerup', () => {
                cancelAnim(aRef);
                aRef = animate(cta, { scale: [0.98, 1] }, { duration: 0.18, easing: springEase });
            });
        }

        // Class cards: subtle lift on hover
        document.querySelectorAll('.class-card').forEach((card) => {
            let aRef = null;
            card.addEventListener('mouseenter', () => {
                cancelAnim(aRef);
                aRef = animate(card, { transform: ['translateY(0) scale(1)', 'translateY(-4px) scale(1.01)'] }, { duration: 0.28, easing: springEase });
            });
            card.addEventListener('mouseleave', () => {
                cancelAnim(aRef);
                aRef = animate(card, { transform: ['translateY(-4px) scale(1.01)', 'translateY(0) scale(1)'] }, { duration: 0.25, easing: springEase });
            });
        });

        // Enhanced Practices flip-cards: subtle lift (works with existing crossfade)
        document.querySelectorAll('#enhancedPracticesPanel .flip-card .flip-inner').forEach((inner) => {
            let aRef = null;
            const parent = inner.closest('.flip-card');
            if (!parent) return;
            parent.addEventListener('mouseenter', () => {
                cancelAnim(aRef);
                aRef = animate(inner, { y: [0, -4] }, { duration: 0.28, easing: springEase });
            });
            parent.addEventListener('mouseleave', () => {
                cancelAnim(aRef);
                aRef = animate(inner, { y: [-4, 0] }, { duration: 0.25, easing: springEase });
            });
        });
    }
}

// Initialize animations when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new AnimationManager());
} else {
    new AnimationManager();
}
