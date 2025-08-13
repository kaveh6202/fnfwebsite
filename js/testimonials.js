// Testimonial cycling system
class TestimonialManager {
    constructor() {
        this.testimonials = [
            {
                text: "Armita doesn't just teach—she listens to what your body needs and responds with sequences that feel like they were designed specifically for your soul.",
                author: "— Sarah Chen, Architect"
            },
            {
                text: "I came seeking strength and found a new relationship with gravity itself. Every session reveals layers of possibility I never knew existed.",
                author: "— Marcus Torres, Dancer"
            },
            {
                text: "The VR sessions are like practicing inside a living painting. Technology becomes invisible when it serves the deepest human needs.",
                author: "— Dr. Elena Vasquez, Neuroscientist"
            }
        ];

        this.currentTestimonial = 0;
        this.testimonialContainer = document.querySelector('.testimonial');
        
        if (this.testimonialContainer) {
            this.init();
        }
    }

    init() {
        // Display initial testimonial
        this.updateTestimonial();
        // Start the cycling with visibility optimization
        this.startCycling();
    }

    startCycling() {
        // Only cycle when page is visible to reduce unnecessary rendering
        this.cycleInterval = setInterval(() => {
            if (!document.hidden) {
                this.updateTestimonial();
            }
        }, 4000);
        
        // Pause cycling when page is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.cycleInterval) {
                    clearInterval(this.cycleInterval);
                    this.cycleInterval = null;
                }
            } else if (!this.cycleInterval) {
                this.startCycling();
            }
        });
    }

    updateTestimonial() {
        const testimonial = this.testimonials[this.currentTestimonial];
        
        // Use requestAnimationFrame to optimize DOM updates
        requestAnimationFrame(() => {
            this.testimonialContainer.innerHTML = `
                <p class="testimonial-text">${testimonial.text}</p>
                <p class="testimonial-author">${testimonial.author}</p>
            `;
        });
        
        this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
    }
}

// Initialize testimonial manager
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new TestimonialManager());
} else {
    new TestimonialManager();
}
