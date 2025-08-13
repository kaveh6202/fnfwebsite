// Visual effects and interactions
class EffectsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupRippleEffect();
    }

    setupRippleEffect() {
        // Ripple effect removed
    }
}

// Initialize effects manager
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new EffectsManager());
} else {
    new EffectsManager();
}
