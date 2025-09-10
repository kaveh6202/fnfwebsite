// Wellness-Themed Wave Animation System for Feather and Flow
class WellnessWaves {
    constructor() {
        this.canvas = document.getElementById('waveCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.waves = [];
        this.particles = [];
        this.time = 0;
        this.scrollOffset = 0;
        this.dpr = Math.min(window.devicePixelRatio || 1, 1.2);
        this.lowQuality = false;
        this.frameSamples = [];
        this.rafId = null;
        this.defaultWaveCount = 5;
        this.waveCount = this.defaultWaveCount;
        this.particleCount = 12;
        this.inStressRelief = false;
        this.mobileBreakpointPx = 900;
        
        // Chakra colors with wellness theme variations
        this.chakraColors = [
            [211, 47, 47],    // Root - Deep Red
            [245, 124, 0],    // Sacral - Orange
            [251, 192, 45],   // Solar Plexus - Golden Yellow
            [56, 142, 60],    // Heart - Green
            [2, 136, 209],    // Throat - Blue
            [48, 63, 159],    // Third Eye - Indigo
            [142, 36, 170],   // Crown - Violet
        ];
        
        // Wellness accent colors (soft, calming variations)
        this.wellnessColors = [
            [5, 150, 105],    // Brand Green
            [245, 158, 11],   // Accent Amber
            [139, 69, 19],    // Earth Brown
            [75, 85, 99],     // Slate Gray
            [219, 234, 254], // Light Blue
            [254, 240, 138], // Light Yellow
        ];
        
        this.init();
        this.createWaves();
        this.createParticles();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Monitor content changes
        const surface = document.getElementById('surface');
        if (window.ResizeObserver && surface) {
            this.resizeObserver = new ResizeObserver(() => this.resize());
            this.resizeObserver.observe(surface);
            this.resizeObserver.observe(document.body);
        }
        
        // Load event guards
        window.addEventListener('load', () => this.resize());
        setTimeout(() => this.resize(), 600);
        setTimeout(() => this.resize(), 1600);

        // Setup stress relief section observer
        this.setupStressReliefObserver();
    }

    setupStressReliefObserver() {
        const stressSection = document.getElementById('stressRelief');
        if (!stressSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.inStressRelief = entry.isIntersecting;
                const isMobile = window.innerWidth <= this.mobileBreakpointPx;
                if (this.inStressRelief) {
                    // Enhanced waves and particles for stress relief
                    this.updateWaveCount(isMobile ? 0 : 8);
                    this.updateParticleCount(isMobile ? 0 : 20);
                } else {
                    this.updateWaveCount(this.defaultWaveCount);
                    this.updateParticleCount(this.particleCount);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(stressSection);
    }

    updateWaveCount(newCount) {
        if (this.waveCount === newCount) return;
        this.waveCount = newCount;
        this.createWaves();
    }

    updateParticleCount(newCount) {
        if (this.particles.length === newCount) return;
        this.particleCount = newCount;
        this.createParticles();
    }

    resize() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        this.canvas.width = Math.floor(vw * this.dpr);
        this.canvas.height = Math.floor(vh * this.dpr);
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

        // Responsive adjustments
        const isMobile = window.innerWidth <= this.mobileBreakpointPx;
        if (this.inStressRelief) {
            this.updateWaveCount(isMobile ? 0 : 8);
            this.updateParticleCount(isMobile ? 0 : 20);
        } else {
            this.updateWaveCount(this.defaultWaveCount);
            this.updateParticleCount(this.particleCount);
        }
    }

    createWaves() {
        this.waves = [];
        for (let i = 0; i < this.waveCount; i++) {
            this.waves.push(this.createWave(i));
        }
    }

    createWave(index) {
        const useChakra = Math.random() < 0.6; // 60% chakra, 40% wellness colors
        const colorPalette = useChakra ? this.chakraColors : this.wellnessColors;
        const baseColor = colorPalette[index % colorPalette.length];
        
        const r = baseColor[0];
        const g = baseColor[1];
        const b = baseColor[2];
        
        const brightness = Math.random() * 0.3 + 0.7; // 0.7-1.0 brightness
        const alpha = Math.random() * 0.15 + 0.25; // 0.25-0.4 opacity (more subtle)
        
        // Horizontal waves for wellness flow
        const widthPx = this.canvas.width / this.dpr;
        const heightPx = this.canvas.height / this.dpr;
        const spacing = heightPx / (this.waveCount + 2);
        const jitter = (Math.random() - 0.5) * spacing * 0.4;
        const baseY = spacing * (index + 1.5) + jitter;
        
        return {
            color: `rgba(${Math.round(r * brightness)}, ${Math.round(g * brightness)}, ${Math.round(b * brightness)}, ${alpha})`,
            thickness: Math.random() * 2 + 0.5, // 0.5-2.5 thickness
            amplitude: Math.random() * 60 + 40, // 40-100 amplitude
            speed: Math.random() * 0.04 + 0.01, // Slower, more meditative
            phase: Math.random() * Math.PI * 2,
            direction: Math.random() > 0.5 ? 1 : -1,
            yPosition: baseY,
            frequency: Math.random() * 0.008 + 0.002, // Lower frequency for gentler waves
            secondaryFreq: Math.random() * 0.5 + 0.3,
            tertiaryFreq: Math.random() * 0.3 + 0.2,
            // Breathing-like lifecycle
            life: 0,
            maxLife: Math.random() * 8 + 8, // 8-16 seconds (longer for meditation)
            fadeInDuration: Math.random() * 3 + 2, // 2-5 seconds fade in
            fadeOutDuration: Math.random() * 3 + 2, // 2-5 seconds fade out
            brightness: brightness,
            isAlive: true,
            age: 0,
            // Wellness-specific properties
            breathingPhase: Math.random() * Math.PI * 2,
            breathingSpeed: Math.random() * 0.02 + 0.008, // Very slow breathing
        };
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        const useChakra = Math.random() < 0.7;
        const colorPalette = useChakra ? this.chakraColors : this.wellnessColors;
        const baseColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        
        const r = baseColor[0];
        const g = baseColor[1];
        const b = baseColor[2];
        
        const widthPx = this.canvas.width / this.dpr;
        const heightPx = this.canvas.height / this.dpr;
        
        return {
            x: Math.random() * widthPx,
            y: Math.random() * heightPx,
            vx: (Math.random() - 0.5) * 0.2, // Very slow movement
            vy: (Math.random() - 0.5) * 0.2,
            size: Math.random() * 3 + 1, // 1-4 size
            alpha: Math.random() * 0.1 + 0.05, // Very subtle
            color: `rgba(${r}, ${g}, ${b}`,
            life: Math.random(),
            maxLife: Math.random() * 10 + 10, // 10-20 seconds
            age: 0,
            pulsePhase: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 0.02 + 0.01,
        };
    }

    setupEventListeners() {
        this.scrollOffset = 0;

        // Pause when tab is hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.rafId) cancelAnimationFrame(this.rafId);
                this.rafId = null;
            } else if (!this.rafId) {
                this.animate();
            }
        });
    }

    updateWaveLifecycle(wave) {
        wave.age += 0.016;
        
        // Breathing effect
        const breathingIntensity = Math.sin(this.time * wave.breathingSpeed + wave.breathingPhase) * 0.1 + 1;
        
        // Lifecycle phases
        if (wave.age < wave.fadeInDuration) {
            wave.life = (wave.age / wave.fadeInDuration) * breathingIntensity;
        } else if (wave.age < wave.maxLife - wave.fadeOutDuration) {
            wave.life = breathingIntensity;
        } else if (wave.age < wave.maxLife) {
            const fadeProgress = (wave.age - (wave.maxLife - wave.fadeOutDuration)) / wave.fadeOutDuration;
            wave.life = (1 - fadeProgress) * breathingIntensity;
        } else {
            // Regenerate
            const newWave = this.createWave(Math.floor(Math.random() * this.waveCount));
            Object.assign(wave, newWave);
        }
    }

    updateParticleLifecycle(particle) {
        particle.age += 0.016;
        
        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around screen
        const widthPx = this.canvas.width / this.dpr;
        const heightPx = this.canvas.height / this.dpr;
        
        if (particle.x < 0) particle.x = widthPx;
        if (particle.x > widthPx) particle.x = 0;
        if (particle.y < 0) particle.y = heightPx;
        if (particle.y > heightPx) particle.y = 0;
        
        // Pulsing effect
        const pulse = Math.sin(this.time * particle.pulseSpeed + particle.pulsePhase) * 0.3 + 0.7;
        particle.currentAlpha = particle.alpha * pulse;
        
        // Lifecycle
        if (particle.age >= particle.maxLife) {
            const newParticle = this.createParticle();
            Object.assign(particle, newParticle);
        }
    }

    drawWave(wave, idx) {
        this.updateWaveLifecycle(wave);
        
        if (wave.life <= 0) return;
        
        // Skip for performance in low quality mode
        if (this.lowQuality && (idx % 2 === 1)) return;
        
        const currentAlpha = wave.life * parseFloat(wave.color.split(',')[3]);
        const lifecycleColor = wave.color.replace(/[\d\.]+\)$/g, `${currentAlpha})`);
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.strokeStyle = lifecycleColor;
        this.ctx.lineWidth = Math.max(0.5, wave.thickness * wave.life);
        this.ctx.lineCap = 'round';
        this.ctx.shadowBlur = (this.lowQuality ? 8 : 16) * wave.life;
        this.ctx.shadowColor = lifecycleColor;
        this.ctx.beginPath();

        const width = this.canvas.width / this.dpr;
        const points = [];

        // Generate horizontal wave points (wellness flow direction)
        for (let x = 0; x <= width; x += 3) {
            const adjustedY = wave.yPosition;

            // Multiple layered sine waves for gentle, flowing movement
            const lifeAmplitude = wave.amplitude * wave.life * wave.brightness;
            const primaryWave = Math.sin(x * wave.frequency + this.time * wave.speed * wave.direction + wave.phase) * lifeAmplitude;
            const secondaryWave = Math.sin(x * wave.frequency * wave.secondaryFreq + this.time * wave.speed * 0.6 + wave.phase + Math.PI/3) * lifeAmplitude * 0.4;
            const tertiaryWave = Math.sin(x * wave.frequency * wave.tertiaryFreq + this.time * wave.speed * 1.2 + wave.phase + Math.PI/6) * lifeAmplitude * 0.2;
            
            // Breathing effect
            const breathingOffset = Math.sin(this.time * wave.breathingSpeed + wave.breathingPhase) * lifeAmplitude * 0.1;
            
            const waveValue = primaryWave + secondaryWave + tertiaryWave + breathingOffset;
            const y = adjustedY + waveValue;
            points.push({ x, y });
        }

        // Draw smooth horizontal curve
        if (points.length > 0) {
            this.ctx.moveTo(points[0].x, points[0].y);
            
            for (let i = 1; i < points.length - 2; i++) {
                const xc = (points[i].x + points[i + 1].x) / 2;
                const yc = (points[i].y + points[i + 1].y) / 2;
                this.ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
            
            if (points.length > 2) {
                this.ctx.quadraticCurveTo(
                    points[points.length - 2].x, 
                    points[points.length - 2].y,
                    points[points.length - 1].x, 
                    points[points.length - 1].y
                );
            }
        }

        this.ctx.stroke();
        this.ctx.restore();
    }

    drawParticle(particle) {
        this.updateParticleLifecycle(particle);
        
        if (particle.currentAlpha <= 0) return;
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.fillStyle = `${particle.color}, ${particle.currentAlpha})`;
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = `${particle.color}, ${particle.currentAlpha * 0.5})`;
        
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }

    animate() {
        const start = performance.now();
        
        // Clear with transparency
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update time
        this.time += 0.016;

        // Draw waves
        this.waves.forEach((wave, idx) => this.drawWave(wave, idx));
        
        // Draw particles
        if (!this.lowQuality) {
            this.particles.forEach(particle => this.drawParticle(particle));
        }

        // Performance monitoring
        const elapsed = performance.now() - start;
        this.frameSamples.push(elapsed);
        if (this.frameSamples.length > 30) this.frameSamples.shift();
        const avg = this.frameSamples.reduce((a,b)=>a+b,0) / this.frameSamples.length;
        this.lowQuality = avg > 20; // Adjust for better performance

        this.rafId = requestAnimationFrame(() => this.animate());
    }
}

// Initialize wellness waves
let wellnessWaves;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        wellnessWaves = new WellnessWaves();
    });
} else {
    wellnessWaves = new WellnessWaves();
}
