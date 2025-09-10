// Countdown Timer for Studio Opening
class CountdownTimer {
    constructor() {
        this.targetDate = this.calculateTargetDate();
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        
        // Check if elements exist (countdown might not be on every page)
        if (this.elements.days) {
            this.init();
        }
    }

    calculateTargetDate() {
        // Set target date to 2 months from now
        const now = new Date();
        const target = new Date(now.getTime() + (60 * 24 * 60 * 60 * 1000)); // 60 days from now
        return target;
    }

    init() {
        this.updateCountdown();
        this.interval = setInterval(() => this.updateCountdown(), 1000);
        
        // Clean up interval when page is unloaded
        window.addEventListener('beforeunload', () => {
            if (this.interval) {
                clearInterval(this.interval);
            }
        });
    }

    updateCountdown() {
        const now = new Date().getTime();
        const distance = this.targetDate.getTime() - now;

        if (distance < 0) {
            // Countdown finished
            this.handleCountdownComplete();
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update DOM elements with animation
        this.updateElement(this.elements.days, days.toString().padStart(2, '0'));
        this.updateElement(this.elements.hours, hours.toString().padStart(2, '0'));
        this.updateElement(this.elements.minutes, minutes.toString().padStart(2, '0'));
        this.updateElement(this.elements.seconds, seconds.toString().padStart(2, '0'));
    }

    updateElement(element, newValue) {
        if (element && element.textContent !== newValue) {
            // Add animation class
            element.style.animation = 'countdownFlip 0.5s ease-in-out';
            
            // Update value after animation starts
            setTimeout(() => {
                element.textContent = newValue;
            }, 250);
            
            // Remove animation class
            setTimeout(() => {
                element.style.animation = '';
            }, 500);
        }
    }

    handleCountdownComplete() {
        clearInterval(this.interval);
        
        // Update all elements to show zeros
        Object.values(this.elements).forEach(element => {
            if (element) element.textContent = '00';
        });
        
        // Optional: Show launch message
        const countdownContainer = document.getElementById('countdown-timer');
        if (countdownContainer) {
            countdownContainer.innerHTML = `
                <div class="launch-message">
                    <h3 style="color: white; margin: 0; font-size: 1.5rem;">🎉 We're Open!</h3>
                    <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Welcome to our beautiful new studio!</p>
                </div>
            `;
        }
    }
}

// Progress Bar Animation for Founding Members
class FoundingMemberProgress {
    constructor() {
        this.progressBar = document.querySelector('.progress-fill');
        this.urgencyText = document.querySelector('.urgency-text');
        
        if (this.progressBar) {
            this.init();
        }
    }

    init() {
        // Simulate realistic progress updates
        this.updateProgress();
        
        // Update every 30 seconds to create urgency
        setInterval(() => this.updateProgress(), 30000);
    }

    updateProgress() {
        // Simulate members joining (between 45-50% filled)
        const minProgress = 45;
        const maxProgress = 50;
        const currentProgress = Math.random() * (maxProgress - minProgress) + minProgress;
        const membersLeft = Math.floor(50 - (currentProgress / 100 * 50));
        const membersClaimed = 50 - membersLeft;
        
        if (this.progressBar) {
            this.progressBar.style.width = `${currentProgress}%`;
        }
        
        if (this.urgencyText) {
            this.urgencyText.innerHTML = `Only <strong>${membersLeft} founding memberships</strong> available. <strong>${membersClaimed} already claimed!</strong>`;
        }
    }
}

// Add CSS for countdown animation
const countdownStyles = `
    @keyframes countdownFlip {
        0% { transform: rotateX(0deg); }
        50% { transform: rotateX(90deg); }
        100% { transform: rotateX(0deg); }
    }
    
    .launch-message {
        text-align: center;
        padding: 20px;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = countdownStyles;
document.head.appendChild(styleSheet);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new CountdownTimer();
        new FoundingMemberProgress();
    });
} else {
    new CountdownTimer();
    new FoundingMemberProgress();
}
