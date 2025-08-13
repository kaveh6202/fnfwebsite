// Performance Manager - Optimize animations based on device capabilities
class PerformanceManager {
    constructor() {
        this.isLowPerformance = false;
        this.rafThrottle = false;
        this.scrollThrottle = false;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    init() {
        this.detectPerformance();
        this.optimizeAnimations();
        this.optimizeScrollHandlers();
        this.setupVisibilityOptimization();
    }

    detectPerformance() {
        // Detect low-performance devices  
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const slowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
        const limitedMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        const limitedCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        
        this.isLowPerformance = slowConnection || limitedMemory || limitedCores || this.reducedMotion;
        
        if (this.isLowPerformance) {
            document.documentElement.classList.add('low-performance');
        }
    }

    optimizeAnimations() {
        if (this.isLowPerformance || this.reducedMotion) {
            // Only disable non-essential animations, keep waves
            this.reduceAnimationComplexity();
        }
        // Keep wave system running for all devices
    }

    // Wave system optimization removed - keeping waves untouched

    reduceAnimationComplexity() {
        // Add CSS class to reduce expensive effects (background-related optimizations removed)
        document.head.insertAdjacentHTML('beforeend', `
            <style>
                .low-performance * {
                    animation-duration: 0.01ms !important;
                    animation-delay: 0.01ms !important;
                    transition-duration: 0.01ms !important;
                    transition-delay: 0.01ms !important;
                }
                .low-performance .logo-icon,
                .low-performance #bgBrand {
                    animation: none !important;
                }
                .low-performance [class*="backdrop-filter"],
                .low-performance [style*="backdrop-filter"] {
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                }
                .low-performance [class*="box-shadow"],
                .low-performance [style*="box-shadow"] {
                    box-shadow: none !important;
                }
            </style>
        `);
    }

    optimizeScrollHandlers() {
        // Throttle scroll events
        let scrollTimeout;
        const originalScrollHandler = this.handleScroll.bind(this);
        
        window.addEventListener('scroll', () => {
            if (this.scrollThrottle) return;
            
            this.scrollThrottle = true;
            requestAnimationFrame(() => {
                originalScrollHandler();
                this.scrollThrottle = false;
            });
        }, { passive: true });
    }

    handleScroll() {
        // Scroll handling optimized - logo rotation moved to animations.js to prevent duplication
        if (this.isLowPerformance) return;
        
        // Reserved for future scroll-based optimizations
    }

    setupVisibilityOptimization() {
        // Pause animations when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAllAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }

    pauseAllAnimations() {
        document.documentElement.classList.add('animations-paused');
        // Wave system pause/resume removed - keeping waves running
    }

    resumeAnimations() {
        document.documentElement.classList.remove('animations-paused');
        // Wave system pause/resume removed - keeping waves running
    }
}

// Initialize performance manager
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new PerformanceManager());
} else {
    new PerformanceManager();
}
