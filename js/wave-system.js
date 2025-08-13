// Sophisticated Wave Animation System
class WaveSystem {
    constructor() {
        this.canvas = document.getElementById('waveCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.waves = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        this.scrollOffset = 0;
        this.dpr = Math.min(window.devicePixelRatio || 1, 1.2); // cap pixel density for perf
        this.lowQuality = false;
        this.frameSamples = [];
        this.rafId = null;
        this.defaultWaveCount = 7;
        this.waveCount = this.defaultWaveCount;
        // Chakra palette (RGB) - fixed colors only
        this.baseColors = [
            [211, 47, 47],    // Deep Red – #D32F2F (Root)
            [245, 124, 0],    // Vibrant Orange – #F57C00 (Sacral)
            [251, 192, 45],   // Golden Yellow – #FBC02D (Solar Plexus)
            [56, 142, 60],    // Fresh Green – #388E3C (Heart)
            [2, 136, 209],    // Bright Sky Blue – #0288D1 (Throat)
            [48, 63, 159],    // Indigo – #303F9F (Third Eye)
            [142, 36, 170],   // Violet – #8E24AA (Crown)
        ];
        
        this.init();
        this.createWaves();
        this.animate();
        this.setupEventListeners();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        // Recompute when content height changes so the background always matches the single page height
        const surface = document.getElementById('surface');
        if (window.ResizeObserver && surface) {
            this.resizeObserver = new ResizeObserver(() => this.resize());
            this.resizeObserver.observe(surface);
            this.resizeObserver.observe(document.body);
        }
        // Extra guards for late content (images/fonts) loading
        window.addEventListener('load', () => this.resize());
        setTimeout(() => this.resize(), 600);
        setTimeout(() => this.resize(), 1600);

        // Setup intersection observer for stress relief section
        this.setupStressReliefObserver();

        // Handle navigation clicks
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                // Reset wave count unless clicking stress relief
                if (!link.getAttribute('href').includes('stressRelief')) {
                    this.updateWaveCount(this.defaultWaveCount);
                }
            });
        });
    }

    setupStressReliefObserver() {
        const stressSection = document.getElementById('stressRelief');
        if (!stressSection) return;

        // Handle section visibility
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.updateWaveCount(14); // Increase waves in stress relief section
                } else {
                    this.updateWaveCount(this.defaultWaveCount); // Reset when leaving section
                }
            });
        }, { threshold: 0.3 }); // Trigger when 30% of section is visible

        observer.observe(stressSection);
    }

    updateWaveCount(newCount) {
        if (this.waveCount === newCount) return;
        this.waveCount = newCount;
        this.createWaves(); // Recreate waves with new count
    }

    resize() {
        // Size canvas to viewport height only (fixed background, non-scrollable)
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        this.canvas.width = Math.floor(vw * this.dpr);
        this.canvas.height = Math.floor(vh * this.dpr);
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    createWaves() {
        this.waves = [];
        // Create vertical waves with lifecycle management (lighter)
        for (let i = 0; i < this.waveCount; i++) {
            this.waves.push(this.createWave(i));
        }
    }

    createWave(index) {
        const baseColor = this.baseColors[index % this.baseColors.length];
        // No hue variation: use exact palette only; allow slight alpha/brightness changes
        const r = baseColor[0];
        const g = baseColor[1];
        const b = baseColor[2];
        
        // Random brightness (some waves are brighter)
        const brightness = Math.random() * 0.4 + 0.6; // 0.6-1.0 brightness
        const alpha = Math.random() * 0.25 + 0.5; // 0.5-0.75 opacity
        // Scatter across width using even spacing + jitter
        const widthPx = this.canvas.width / this.dpr;
        const spacing = widthPx / (this.waveCount + 1);
        const jitter = (Math.random() - 0.5) * spacing * 0.6; // up to +-30% spacing
        const baseX = spacing * (index + 1) + jitter;
        
        return {
            color: `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`,
            thickness: Math.random() * 1.2 + 0.15, // thinner range: from whisper-thin to moderately thin
            amplitude: Math.random() * 46 + 28,
            speed: Math.random() * 0.07 + 0.02,
            phase: Math.random() * Math.PI * 2,
            direction: Math.random() > 0.5 ? 1 : -1,
            xPosition: baseX,
            // 5% chance of creating a very curly wave, otherwise normal range
            waveLength: Math.random() < 0.05 ? 
                (Math.random() * 0.0005 + 0.0001) : // super curly (0.0001 to 0.0006)
                (Math.random() * 0.012 + 0.001),    // normal range (0.001 to 0.013)
            secondaryFreq: Math.random() * 0.8 + 0.3,
            tertiaryFreq: Math.random() * 0.6 + 0.2,
            // Lifecycle properties
            life: 0, // Current life (0-1)
            maxLife: Math.random() * 6 + 6, // 6-12 seconds lifespan
            fadeInDuration: Math.random() * 2 + 1, // 1-3 seconds fade in
            fadeOutDuration: Math.random() * 2 + 1, // 1-3 seconds fade out
            brightness: brightness,
            isAlive: true,
            age: 0
        };
    }

    setupEventListeners() {
        // Background should not move with scroll; decouple from scroll position
        this.scrollOffset = 0;

        // No mouse tracking for waves (performance + design request)
        this.mouse.x = -9999; this.mouse.y = -9999;

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
        wave.age += 0.016; // ~60fps
        
        // Calculate lifecycle phase
        if (wave.age < wave.fadeInDuration) {
            // Fade in phase
            wave.life = wave.age / wave.fadeInDuration;
        } else if (wave.age < wave.maxLife - wave.fadeOutDuration) {
            // Alive phase
            wave.life = 1;
        } else if (wave.age < wave.maxLife) {
            // Fade out phase
            const fadeProgress = (wave.age - (wave.maxLife - wave.fadeOutDuration)) / wave.fadeOutDuration;
            wave.life = 1 - fadeProgress;
        } else {
            // Dead - regenerate
            const newWave = this.createWave(Math.floor(Math.random() * this.waveCount));
            Object.assign(wave, newWave);
        }
    }

    drawWave(wave, idx) {
        // Update wave lifecycle
        this.updateWaveLifecycle(wave);
        
        // Skip drawing if wave is not visible
        if (wave.life <= 0) return;
        
        // Low-quality mode: draw every other wave to save time
        if (this.lowQuality && (idx % 2 === 1)) return;
        
        // Apply lifecycle opacity and brightness
        const currentAlpha = wave.life * parseFloat(wave.color.split(',')[3]);
        const lifecycleColor = wave.color.replace(/[\d\.]+\)$/g, `${currentAlpha})`);
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter'; // neon blending
        this.ctx.strokeStyle = lifecycleColor;
        this.ctx.lineWidth = Math.max(1, wave.thickness * wave.life);
        this.ctx.lineCap = 'round';
        this.ctx.shadowBlur = (this.lowQuality ? 6 : 14) * wave.life; // glow, capped in low-quality
        this.ctx.shadowColor = lifecycleColor;
        this.ctx.beginPath();

        const height = this.canvas.height / this.dpr; // viewport height
        const points = [];

        // Generate vertical wave points spanning only the fixed background (viewport height)
        for (let y = 0; y <= height; y += 2) {
            // Calculate X position with scrolling effect
            const adjustedX = wave.xPosition; // fixed background; no scroll-driven shift

            // Multiple layered sine waves for complexity
            const lifeAmplitude = wave.amplitude * wave.life * wave.brightness;
            const primaryWave = Math.sin(y * wave.waveLength + this.time * wave.speed + wave.phase) * lifeAmplitude;
            const secondaryWave = Math.sin(y * wave.waveLength * wave.secondaryFreq + this.time * wave.speed * 0.7 + wave.phase + Math.PI/4) * lifeAmplitude * 0.3;
            const tertiaryWave = Math.sin(y * wave.waveLength * wave.tertiaryFreq + this.time * wave.speed * 1.3 + wave.phase + Math.PI/6) * lifeAmplitude * 0.15;
            
            // Combine all wave layers
            let waveValue = primaryWave + secondaryWave + tertiaryWave;
            const offsetX = 0;

            // No ripple effects

            const x = adjustedX + waveValue + offsetX;
            points.push({ x, y });
        }

        // Draw smooth vertical curve through points
        if (points.length > 0) {
            this.ctx.moveTo(points[0].x, points[0].y);
            
            for (let i = 1; i < points.length - 2; i++) {
                const xc = (points[i].x + points[i + 1].x) / 2;
                const yc = (points[i].y + points[i + 1].y) / 2;
                this.ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
            }
            
            // Handle last points
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

    animate() {
        const start = performance.now();
        // Clear canvas with transparent background (CSS background shows through)
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update time
        this.time += 0.016; // ~60fps

        // Draw waves
        this.waves.forEach((wave, idx) => this.drawWave(wave, idx));

        // Track frame time and adapt quality
        const elapsed = performance.now() - start;
        this.frameSamples.push(elapsed);
        if (this.frameSamples.length > 30) this.frameSamples.shift();
        const avg = this.frameSamples.reduce((a,b)=>a+b,0) / this.frameSamples.length;
        this.lowQuality = avg > 24; // if avg frame > ~24ms (~40fps), reduce effects

        this.rafId = requestAnimationFrame(() => this.animate());
    }
}

// Initialize wave system
let waveSystem;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        waveSystem = new WaveSystem();
    });
} else {
    waveSystem = new WaveSystem();
}
