class BreathingCircle {
    constructor(breathingType = 'kamBreathing') {
        this.colors = [
            '#D32F2F', // Root - Deep Red
            '#F57C00', // Sacral - Orange
            '#FBC02D', // Solar Plexus - Yellow
            '#388E3C', // Heart - Green
            '#0288D1', // Throat - Sky Blue
            '#303F9F', // Third Eye - Indigo
            '#8E24AA'  // Crown - Violet
        ];

        // Breathing patterns (in milliseconds)
        this.breathingPatterns = {
            normal: {
                breatheOutDuration: 4000,  // Exhale duration
                holdOutDuration: 2000,     // Hold after exhale (min size)
                breatheInDuration: 4000,   // Inhale duration
                holdInDuration: 2000       // Hold after inhale (max size)
            },
            relaxing: {
                breatheOutDuration: 6000,
                holdOutDuration: 2000,
                breatheInDuration: 6000,
                holdInDuration: 2000
            },
            energizing: {
                breatheOutDuration: 2000,
                holdOutDuration: 4000,
                breatheInDuration: 2000,
                holdInDuration: 4000
            },
            boxBreathing: {
                breatheOutDuration: 4000,
                holdOutDuration: 4000,
                breatheInDuration: 4000,
                holdInDuration: 4000
            },
            stressBreathing: {
                breatheOutDuration: 1000,
                holdOutDuration: 0,
                breatheInDuration: 1000,
                holdInDuration: 0
            },
            kamBreathing: {
                breatheOutDuration: 15000,
                holdOutDuration: 5000,
                breatheInDuration: 20000,
                holdInDuration: 5000
            }
        };
        
        this.breathingType = breathingType;
        this.circles = [];
        this.activeCircles = new Set();
        this.baseRadius = 100; // will be set in createCircles based on viewport
        
        // Animation state
        this.animationFrameId = null;
        this.phase = 'in'; // 'in' | 'holdIn' | 'out' | 'holdOut'
        this.phaseStartTime = 0;
        this.scale = 1; // 1 -> 2 during in, 2 -> 1 during out

        // Rotation state (radians per second)
        this.rotationSpeedRadPerSec = Math.PI / 12; // 15 deg/sec default
        this.rotationStartTime = performance.now();
        this.currentRotationAngle = 0;

        this.circleAnimationsStarted = false;
        // Controls UI container
        this.controlsContainer = null;
        this.init();
    }

    init() {
        const container = document.querySelector('.breathing-container');
        if (!container) {
            console.error('Breathing container not found');
            return;
        }

        // Clear container
        container.innerHTML = '';

        // Allow overriding breathing type via data attribute
        const containerType = container.getAttribute('data-breathing-type');
        if (containerType && this.breathingPatterns[containerType]) {
            this.breathingType = containerType;
        }

        // Create SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        // Size SVG to fit parent while keeping it square
        const rect = container.getBoundingClientRect();
        const size = Math.max(200, Math.min(rect.width || 500, (rect.height || rect.width || 500)));
        svg.setAttribute('width', String(size));
        svg.setAttribute('height', String(size));
        svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        // Don't clip controls; circles are sized to fit already
        container.style.overflow = 'visible';
        container.appendChild(svg);
        this.svg = svg;
        this.svgSize = size;
        this.centerX = size / 2;
        this.centerY = size / 2;

        // Define SVG defs container for filters
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svg.appendChild(defs);
        this.defs = defs;

        // Build breathing pattern controls UI (append after svg so it sits above)
        this.buildControls(container);

        // No instruction text in the center

        // Create circles
        this.createCircles();
        
        // Start animation
        this.startBreathing();
    }

    createCircles() {
		// Calculate base circle size bounded by container so that max scale fits
		const STROKE_WIDTH = 3;
		const SAFETY_PADDING = 3; // extra pixels to avoid visual clipping
		const RADIUS_JITTER_MAX = 10; // px randomness per circle
		const MAX_SCALE = 2;
		const orbitRadius = Math.max(6, Math.min(12, Math.floor(this.svgSize * 0.02))); // small offset circle orbit
		const maxRadius = (this.svgSize / 2) - (STROKE_WIDTH / 2) - SAFETY_PADDING - RADIUS_JITTER_MAX;
		const baseRadius = Math.max(1, Math.floor((maxRadius - orbitRadius) / MAX_SCALE));

        // Create circles (responsive count)
        const circleCount = (window.innerWidth <= 900) ? 4 : 16;
        for (let i = 0; i < circleCount; i++) {
            const strokeColor = this.colors[i % this.colors.length];
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', String(this.centerX));
            circle.setAttribute('cy', String(this.centerY));
			// Randomize initial radius within ±RADIUS_JITTER_MAX
			const rOffset = Math.round((Math.random() * (RADIUS_JITTER_MAX * 2)) - RADIUS_JITTER_MAX);
			circle.dataset.rOffset = String(rOffset);
			circle.setAttribute('r', String(baseRadius + rOffset));
            circle.setAttribute('stroke', strokeColor);
            circle.setAttribute('stroke-width', '3');
            circle.setAttribute('fill', 'none');
            circle.style.opacity = '0';
            // Transition only opacity so radius changes follow exact time interpolation
            circle.style.transition = 'opacity 1.5s ease-in-out';

            // Create a colored glow + directional shadow filter for this circle
            const filterId = `circleShadowGlow-${i}`;
            const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
            filter.setAttribute('id', filterId);
            filter.setAttribute('x', '-50%');
            filter.setAttribute('y', '-50%');
            filter.setAttribute('width', '200%');
            filter.setAttribute('height', '200%');

            // Direction varies per circle index
            const angle = (i / 16) * Math.PI * 2; // unique angle around the ring
            const distance = Math.max(1, Math.round(this.svgSize * 0.012));
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;

            // Soft outer glow (no offset)
            const glow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
            glow.setAttribute('dx', '0');
            glow.setAttribute('dy', '0');
            glow.setAttribute('stdDeviation', '3');
            glow.setAttribute('flood-color', strokeColor);
            glow.setAttribute('flood-opacity', '0.6');
            filter.appendChild(glow);

            // Directional shadow in the same color
            const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
            shadow.setAttribute('dx', String(dx));
            shadow.setAttribute('dy', String(dy));
            shadow.setAttribute('stdDeviation', '2');
            shadow.setAttribute('flood-color', strokeColor);
            shadow.setAttribute('flood-opacity', '0.9');
            filter.appendChild(shadow);

            this.defs.appendChild(filter);
            circle.setAttribute('filter', `url(#${filterId})`);
            
            this.svg.appendChild(circle);
            this.circles.push(circle);
        }

        // Persist base radius and orbit radius for animation use
        this.baseRadius = baseRadius;
        this.orbitRadius = orbitRadius;

        // Make initial circles visible
        const initialActive = Math.min(8, this.circles.length);
        for (let i = 0; i < initialActive; i++) {
            this.circles[i].style.opacity = '1';
            this.activeCircles.add(i);
        }

        // Position circles around center
        this.positionCircles(0);

        // Update base radius and SVG metrics on window resize (keep current scale)
        window.addEventListener('resize', () => {
            const parent = document.querySelector('.breathing-container');
            if (!parent) return;
            const r = parent.getBoundingClientRect();
            const newSize = Math.max(200, Math.min(r.width || this.svgSize, (r.height || r.width || this.svgSize)));
            this.svgSize = newSize;
            this.centerX = newSize / 2;
            this.centerY = newSize / 2;
            this.svg.setAttribute('width', String(newSize));
            this.svg.setAttribute('height', String(newSize));
            this.svg.setAttribute('viewBox', `0 0 ${newSize} ${newSize}`);

			const STROKE_WIDTH = 3;
			const SAFETY_PADDING = 3;
			const RADIUS_JITTER_MAX = 5;
			const MAX_SCALE = 2;
			const maxR = (this.svgSize / 2) - (STROKE_WIDTH / 2) - SAFETY_PADDING - RADIUS_JITTER_MAX;
            this.orbitRadius = Math.max(6, Math.min(12, Math.floor(this.svgSize * 0.02)));
            this.baseRadius = Math.max(1, Math.floor((maxR - this.orbitRadius) / MAX_SCALE));
			const currentRadius = this.baseRadius * this.scale;
            this.positionCircles(this.currentRotationAngle);
			this.circles.forEach(circle => {
				const off = Number(circle.dataset.rOffset || 0);
				const r = Math.max(1, currentRadius + off);
				circle.setAttribute('r', String(r));
			});

        });
    }

    positionCircles(angleOffset = 0) {
        const centerX = this.centerX;
        const centerY = this.centerY;
        const radius = this.orbitRadius; // small orbit so circles are visible individually

        this.circles.forEach((circle, index) => {
            const divisor = this.circles.length || 1;
            const baseAngle = (index / divisor) * Math.PI * 2;
            const angle = baseAngle + angleOffset;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
        });
    }

    // No instruction text sizing functions (removed)

    buildControls(container) {
        const patterns = Object.keys(this.breathingPatterns);
        const controls = document.createElement('div');
        controls.className = 'breathing-controls';
        controls.setAttribute('role', 'radiogroup');
        const groupName = `breathingPattern-${Math.random().toString(36).slice(2)}`;

        patterns.forEach((patternKey) => {
            const id = `${groupName}-${patternKey}`;
            const label = document.createElement('label');
            label.className = 'breathing-option';
            label.setAttribute('for', id);
            label.setAttribute('data-pattern', patternKey);

            const input = document.createElement('input');
            input.type = 'radio';
            input.name = groupName;
            input.value = patternKey;
            input.id = id;
            if (patternKey === this.breathingType) input.checked = true;

            const dot = document.createElement('span');
            dot.className = 'breathing-dot';

            const text = document.createElement('span');
            text.className = 'breathing-label';
            text.textContent = patternKey
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (s) => s.toUpperCase());

            // Make the input cover the label to ensure accessibility and click
            input.style.position = 'absolute';
            input.style.left = '0';
            input.style.top = '0';
            input.style.width = '100%';
            input.style.height = '100%';
            input.style.margin = '0';
            input.style.opacity = '0';
            input.style.cursor = 'pointer';
            label.appendChild(input);
            label.appendChild(dot);
            label.appendChild(text);
            controls.appendChild(label);

            // Make label itself switch the pattern for robust interaction
            label.addEventListener('click', (ev) => {
                // Let the radio event handle state; just ensure it doesn't get blocked
                setTimeout(() => {
                    this.setBreathingType(patternKey);
                    this.updateControlsSelection(patternKey);
                }, 0);
            });
        });

        controls.addEventListener('change', (e) => {
            const target = e.target;
            if (!(target instanceof HTMLInputElement)) return;
            if (target.type !== 'radio') return;
            const pattern = target.value;
            if (this.breathingPatterns[pattern]) {
                this.setBreathingType(pattern);
                this.updateControlsSelection(pattern);
            }
        });

        container.appendChild(controls);
        this.controlsContainer = controls;
        this.updateControlsSelection(this.breathingType);
    }

    updateControlsSelection(selected) {
        if (!this.controlsContainer) return;
        const options = this.controlsContainer.querySelectorAll('.breathing-option');
        options.forEach((opt) => {
            const isSelected = opt.getAttribute('data-pattern') === selected;
            opt.classList.toggle('selected', isSelected);
            const input = opt.querySelector('input[type="radio"]');
            if (input) input.checked = isSelected;
        });
    }

    animateCircle(index) {
        if (!this.circles[index]) return;
        
        const circle = this.circles[index];
        const lifespan = Math.random() * 2000 + 2000; // 2-4 seconds

        // Fade in
        circle.style.opacity = '1';
        
        // Schedule fade out
        setTimeout(() => {
            circle.style.opacity = '0';
            this.activeCircles.delete(index);
            
            // Find next circle to animate
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * this.circles.length);
            } while (this.activeCircles.has(nextIndex));
            
            this.activeCircles.add(nextIndex);
            this.animateCircle(nextIndex);
        }, lifespan);
    }

    startBreathing() {
        // Start animation for initial active circles if not already running
        if (!this.circleAnimationsStarted) {
            this.activeCircles.forEach(index => {
                this.animateCircle(index);
            });
            this.circleAnimationsStarted = true;
        }

        // Cancel any previous loop
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        // Reset state
        this.scale = 1;
        this.phase = 'in';
        this.phaseStartTime = performance.now();

        const timing = this.breathingPatterns[this.breathingType];

        const step = (now) => {
            const elapsed = now - this.phaseStartTime;
            // Update rotation angle
            this.currentRotationAngle = ((now - this.rotationStartTime) / 1000) * this.rotationSpeedRadPerSec;

            if (this.phase === 'in') {
                // Growing: use breatheInDuration
                const t = Math.min(elapsed / timing.breatheInDuration, 1);
                this.scale = 1 + t * (2 - 1);
                // no center text
                if (t >= 1) {
                    this.phase = 'holdIn';
                    this.phaseStartTime = now;
                }
            } else if (this.phase === 'holdIn') {
                // Hold at max after inhale
                this.scale = 2;
                if (elapsed >= timing.holdInDuration) {
                    this.phase = 'out';
                    this.phaseStartTime = now;
                }
            } else if (this.phase === 'out') {
                // Shrinking: use breatheOutDuration
                const t = Math.min(elapsed / timing.breatheOutDuration, 1);
                this.scale = 2 - t * (2 - 1);
                if (t >= 1) {
                    this.phase = 'holdOut';
                    this.phaseStartTime = now;
                }
            } else if (this.phase === 'holdOut') {
                // Hold at min after exhale
                this.scale = 1;
                if (elapsed >= timing.holdOutDuration) {
                    this.phase = 'in';
                    this.phaseStartTime = now;
                }
            }

            const currentRadius = this.baseRadius * this.scale;
            // Update circle positions with rotation
            this.positionCircles(this.currentRotationAngle);
            this.circles.forEach(circle => {
                const off = Number(circle.dataset.rOffset || 0);
                const r = Math.max(1, currentRadius + off);
                circle.setAttribute('r', String(r));
            });

            // Rebuild if responsive count changed
            const desiredCount = (window.innerWidth <= 900) ? 4 : 16;
            if (desiredCount !== this.circles.length) {
                // Remove existing
                this.circles.forEach(c => c.remove());
                this.circles = [];
                this.activeCircles.clear();
                // Recreate
                for (let i = 0; i < desiredCount; i++) {
                    const strokeColor = this.colors[i % this.colors.length];
                    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    circle.setAttribute('cx', String(this.centerX));
                    circle.setAttribute('cy', String(this.centerY));
                    const off2 = Math.round((Math.random() * (RADIUS_JITTER_MAX * 2)) - RADIUS_JITTER_MAX);
                    circle.dataset.rOffset = String(off2);
                    circle.setAttribute('r', String(Math.max(1, currentRadius + off2)));
                    circle.setAttribute('stroke', strokeColor);
                    circle.setAttribute('stroke-width', '3');
                    circle.setAttribute('fill', 'none');
                    circle.style.opacity = '0';
                    circle.style.transition = 'opacity 1.5s ease-in-out';
                    this.svg.appendChild(circle);
                    this.circles.push(circle);
                }
                // Activate subset
                const initCount = Math.min(8, this.circles.length);
                for (let i = 0; i < initCount; i++) {
                    this.circles[i].style.opacity = '1';
                    this.activeCircles.add(i);
                }
                // Reposition and start animations for active set
                this.positionCircles(this.currentRotationAngle);
                this.activeCircles.forEach(idx => this.animateCircle(idx));
            }

            // No center text updates

            this.animationFrameId = requestAnimationFrame(step);
        };

        this.animationFrameId = requestAnimationFrame(step);
    }

    // Method to change breathing type
    setBreathingType(type) {
        if (this.breathingPatterns[type]) {
            this.breathingType = type;
            // Restart animation with new timing
            this.startBreathing();
        } else {
            console.error('Invalid breathing type:', type);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const breathing = new BreathingCircle('normal');
    
    // Example of changing breathing type (can be triggered by UI)
    // breathing.setBreathingType('relaxing');
});