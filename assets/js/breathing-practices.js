// Breathing Practices System
class BreathingPractices {
    constructor() {
        this.modal = document.getElementById('breathingModal');
        this.techniqueSelection = document.getElementById('techniqueSelection');
        this.breathingPractice = document.getElementById('breathingPractice');
        this.breathingCircle = document.getElementById('breathingCircle');
        this.breathCount = document.getElementById('breathCount');
        this.phasePill = document.getElementById('phasePill');
        this.patternPill = document.getElementById('patternPill');
        this.progressRing = null; // Will be set after modal opens
        this.sessionTimer = document.getElementById('sessionTimer');
        this.cycleCount = document.getElementById('cycleCount');
        this.totalCycles = document.getElementById('totalCycles');
        this.progressFill = document.getElementById('progressFill');
        this.guidanceText = document.getElementById('guidanceText');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.currentTechniqueName = document.getElementById('currentTechniqueName');
        
        // Technique details elements
        this.techniqueDetails = document.getElementById('techniqueDetails');
        this.techniqueOverview = document.getElementById('techniqueOverview');
        this.techniqueBenefits = document.getElementById('techniqueBenefits');
        this.techniqueInstructions = document.getElementById('techniqueInstructions');
        this.techniqueTips = document.getElementById('techniqueTips');
        this.techniqueBestFor = document.getElementById('techniqueBestFor');
        
        // Practice state
        this.currentTechnique = null;
        this.isActive = false;
        this.isPaused = false;
        this.currentPhase = 0;
        this.phaseTimer = 0;
        this.cycleCounter = 0;
        this.sessionStartTime = null;
        this.sessionDuration = 0;
        this.animationFrame = null;
        
        // Breathing techniques configuration
        this.techniques = {
            'box': {
                name: 'Box Breathing',
                phases: [
                    { name: 'Inhale', duration: 4, instruction: 'Breathe In', class: 'inhale' },
                    { name: 'Hold', duration: 4, instruction: 'Hold', class: 'hold' },
                    { name: 'Exhale', duration: 4, instruction: 'Breathe Out', class: 'exhale' },
                    { name: 'Hold', duration: 4, instruction: 'Hold', class: 'hold' }
                ],
                cycles: 10,
                description: 'Equal breathing for focus and calm',
                details: {
                    overview: 'Box breathing, also known as four-square breathing, is a powerful technique used by Navy SEALs and athletes to enhance focus and manage stress.',
                    benefits: [
                        'Reduces stress and anxiety',
                        'Improves concentration and focus',
                        'Lowers blood pressure',
                        'Enhances emotional regulation',
                        'Promotes mental clarity'
                    ],
                    instructions: [
                        'Find a comfortable seated position with your back straight',
                        'Place one hand on your chest, one on your belly',
                        'Inhale slowly through your nose for 4 counts',
                        'Hold your breath gently for 4 counts',
                        'Exhale slowly through your mouth for 4 counts',
                        'Hold empty for 4 counts before the next inhale'
                    ],
                    tips: 'Focus on making each phase equal in duration. If 4 counts feels too long, start with 3 counts and gradually increase.',
                    bestFor: 'Before important meetings, during stressful situations, or when you need to enhance focus and concentration.'
                }
            },
            'stress-relief': {
                name: 'Stress Relief (4-7-8)',
                phases: [
                    { name: 'Inhale', duration: 4, instruction: 'Breathe In', class: 'inhale' },
                    { name: 'Hold', duration: 7, instruction: 'Hold', class: 'hold' },
                    { name: 'Exhale', duration: 8, instruction: 'Breathe Out', class: 'exhale' }
                ],
                cycles: 8,
                description: 'Powerful technique for instant relaxation',
                details: {
                    overview: 'The 4-7-8 breathing technique, developed by Dr. Andrew Weil, is a natural tranquilizer for the nervous system that helps reduce anxiety and promote sleep.',
                    benefits: [
                        'Quickly reduces anxiety and stress',
                        'Helps with falling asleep faster',
                        'Lowers heart rate and blood pressure',
                        'Activates the parasympathetic nervous system',
                        'Reduces cortisol levels',
                        'Improves emotional balance'
                    ],
                    instructions: [
                        'Sit comfortably with your back straight',
                        'Place the tip of your tongue against the roof of your mouth',
                        'Exhale completely through your mouth with a whoosh sound',
                        'Close your mouth and inhale through your nose for 4 counts',
                        'Hold your breath for 7 counts',
                        'Exhale through your mouth for 8 counts with a whoosh sound'
                    ],
                    tips: 'The ratio is more important than the speed. Start slowly and maintain the 4:7:8 ratio throughout.',
                    bestFor: 'When feeling overwhelmed, before bed, during anxiety attacks, or when you need immediate stress relief.'
                }
            },
            'energizing': {
                name: 'Energizing Breath',
                phases: [
                    { name: 'Inhale', duration: 2, instruction: 'Quick In', class: 'inhale' },
                    { name: 'Exhale', duration: 2, instruction: 'Quick Out', class: 'exhale' }
                ],
                cycles: 20,
                description: 'Quick breathing to boost energy',
                details: {
                    overview: 'Energizing breath is a dynamic breathing technique that increases oxygen flow, stimulates the sympathetic nervous system, and boosts mental alertness.',
                    benefits: [
                        'Increases energy and alertness',
                        'Improves mental clarity and focus',
                        'Enhances oxygen delivery to the brain',
                        'Stimulates the nervous system',
                        'Boosts metabolism',
                        'Improves circulation'
                    ],
                    instructions: [
                        'Sit upright with your spine straight',
                        'Place both hands on your knees',
                        'Take quick, sharp inhales through your nose',
                        'Follow immediately with quick, sharp exhales',
                        'Keep the breathing rhythm steady and energetic',
                        'Focus on the belly rising and falling rapidly'
                    ],
                    tips: 'Start slowly and gradually increase the pace. If you feel dizzy, slow down or take a break.',
                    bestFor: 'Morning wake-up routine, before workouts, when feeling sluggish, or when you need a natural energy boost.'
                }
            },
            'coherent': {
                name: 'Coherent Breathing',
                phases: [
                    { name: 'Inhale', duration: 5, instruction: 'Breathe In', class: 'inhale' },
                    { name: 'Exhale', duration: 5, instruction: 'Breathe Out', class: 'exhale' }
                ],
                cycles: 15,
                description: '5-5 rhythm for balance and coherence',
                details: {
                    overview: 'Coherent breathing, also known as resonant breathing, synchronizes your heart rate variability and creates a state of physiological coherence and emotional balance.',
                    benefits: [
                        'Improves heart rate variability',
                        'Reduces stress and anxiety',
                        'Enhances emotional regulation',
                        'Improves focus and mental clarity',
                        'Balances the autonomic nervous system',
                        'Promotes feelings of calm and well-being'
                    ],
                    instructions: [
                        'Sit or lie down in a comfortable position',
                        'Place one hand on your chest, one on your belly',
                        'Breathe slowly and deeply through your nose',
                        'Inhale for exactly 5 seconds, feeling your belly rise',
                        'Exhale for exactly 5 seconds, feeling your belly fall',
                        'Maintain this steady 5:5 rhythm throughout'
                    ],
                    tips: 'Focus on smooth, continuous breathing. Imagine breathing into your heart center for added emotional benefit.',
                    bestFor: 'Daily meditation practice, emotional regulation, improving heart health, or creating overall balance and well-being.'
                }
            },
            'triangle': {
                name: 'Triangle Breathing',
                phases: [
                    { name: 'Inhale', duration: 4, instruction: 'Breathe In', class: 'inhale' },
                    { name: 'Hold', duration: 4, instruction: 'Hold', class: 'hold' },
                    { name: 'Exhale', duration: 4, instruction: 'Breathe Out', class: 'exhale' }
                ],
                cycles: 12,
                description: 'Three-part breathing for grounding',
                details: {
                    overview: 'Triangle breathing is a grounding technique that uses three equal phases to create stability, focus, and a sense of centeredness. It\'s simpler than box breathing but equally effective.',
                    benefits: [
                        'Promotes grounding and stability',
                        'Reduces anxiety and restlessness',
                        'Improves concentration',
                        'Creates emotional balance',
                        'Enhances mindfulness',
                        'Builds breathing awareness'
                    ],
                    instructions: [
                        'Find a stable, comfortable seated position',
                        'Rest your hands gently on your thighs',
                        'Inhale slowly through your nose for 4 counts',
                        'Hold the breath gently for 4 counts',
                        'Exhale slowly through your nose for 4 counts',
                        'Immediately begin the next inhale without pausing'
                    ],
                    tips: 'Visualize drawing a triangle as you breathe - up on the inhale, across on the hold, down on the exhale.',
                    bestFor: 'When feeling scattered or ungrounded, during transitions, or as a simple daily breathing practice.'
                }
            },
            'extended-exhale': {
                name: 'Extended Exhale',
                phases: [
                    { name: 'Inhale', duration: 4, instruction: 'Breathe In', class: 'inhale' },
                    { name: 'Exhale', duration: 8, instruction: 'Long Exhale', class: 'exhale' }
                ],
                cycles: 10,
                description: 'Extended exhales for deep relaxation',
                details: {
                    overview: 'Extended exhale breathing emphasizes longer exhalations to activate the parasympathetic nervous system, promoting deep relaxation and stress relief.',
                    benefits: [
                        'Activates the relaxation response',
                        'Reduces stress and tension',
                        'Lowers blood pressure and heart rate',
                        'Improves sleep quality',
                        'Calms the nervous system',
                        'Releases physical and mental tension'
                    ],
                    instructions: [
                        'Lie down or sit comfortably with good posture',
                        'Place one hand on your chest, one on your belly',
                        'Inhale naturally through your nose for 4 counts',
                        'Exhale slowly through your mouth for 8 counts',
                        'Make the exhale smooth and controlled, not forced',
                        'Allow a natural pause before the next inhale'
                    ],
                    tips: 'Focus on making the exhale twice as long as the inhale. Let the exhale be like a gentle sigh of relief.',
                    bestFor: 'Evening relaxation, before sleep, after stressful events, or when you need to release tension and unwind.'
                }
            }
        };
        
        this.init();
    }
    
    init() {
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (this.modal.classList.contains('active')) {
                if (e.key === 'Escape') {
                    this.closeModal();
                } else if (e.key === ' ' && this.currentTechnique) {
                    e.preventDefault();
                    this.togglePractice();
                }
            }
        });
    }
    
    openModal() {
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Show technique selection
        this.showTechniqueSelection();
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        
        // Stop any active practice
        this.stopPractice();
    }
    
    showTechniqueSelection() {
        this.techniqueSelection.style.display = 'block';
        this.breathingPractice.style.display = 'none';
        this.currentTechnique = null;
    }
    
    startTechnique(techniqueId) {
        const technique = this.techniques[techniqueId];
        if (!technique) return;
        
        this.currentTechnique = technique;
        this.currentTechniqueName.textContent = technique.name;
        this.totalCycles.textContent = technique.cycles;
        
        // Switch to practice interface
        this.techniqueSelection.style.display = 'none';
        this.breathingPractice.style.display = 'block';
        
        // Reset practice state
        this.resetPractice();
        
        // Update technique details
        this.updateTechniqueDetails(technique);
        
        // Initialize progress ring after DOM is ready
        setTimeout(() => {
            this.progressRing = this.breathingCircle.querySelector('.progress-ring-circle');
            this.resetProgressRing();
        }, 100);
        
        // Update guidance
        this.guidanceText.textContent = technique.description + '. Click play when ready.';
    }
    
    togglePractice() {
        if (!this.currentTechnique) return;
        
        if (this.isActive && !this.isPaused) {
            this.pausePractice();
        } else {
            this.resumePractice();
        }
    }
    
    resumePractice() {
        if (!this.currentTechnique) return;
        
        this.isActive = true;
        this.isPaused = false;
        
        if (!this.sessionStartTime) {
            this.sessionStartTime = Date.now();
            this.currentPhase = 0;
            this.phaseTimer = 0;
            this.cycleCounter = 0;
        }
        
        this.updatePlayPauseButton();
        this.startBreathingLoop();
        this.startProgressRingAnimation();
        
        this.guidanceText.textContent = 'Focus on your breath and follow the visual guide.';
    }
    
    resumePractice() {
        if (!this.currentTechnique) return;
        
        this.isActive = true;
        this.isPaused = false;
        
        if (!this.sessionStartTime) {
            this.sessionStartTime = Date.now();
            this.currentPhase = 0;
            this.phaseTimer = 0;
            this.cycleCounter = 0;
        }
        
        this.updatePlayPauseButton();
        this.startBreathingLoop();
        this.startProgressRingAnimation();
        
        this.guidanceText.textContent = 'Focus on your breath and follow the visual guide.';
    }
    
    pausePractice() {
        this.isPaused = true;
        this.updatePlayPauseButton();
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Cancel smooth progress ring animation
        if (this.progressAnimationFrame) {
            cancelAnimationFrame(this.progressAnimationFrame);
            this.progressAnimationFrame = null;
        }
        
        this.guidanceText.textContent = 'Practice paused. Click play to continue.';
    }
    
    stopPractice() {
        this.isActive = false;
        this.isPaused = false;
        this.sessionStartTime = null;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Cancel smooth progress ring animation
        if (this.progressAnimationFrame) {
            cancelAnimationFrame(this.progressAnimationFrame);
            this.progressAnimationFrame = null;
        }
        
        this.updatePlayPauseButton();
    }
    
    resetPractice() {
        this.stopPractice();
        
        this.currentPhase = 0;
        this.phaseTimer = 0;
        this.cycleCounter = 0;
        this.sessionDuration = 0;
        
        this.updateDisplay();
        this.updateProgress();
        this.updateSessionTimer();
        
        this.breathingCircle.className = 'breathing-circle';
        this.breathCount.textContent = '';
        this.phasePill.textContent = 'Get Ready';
        this.phasePill.className = 'phase-pill';
        
        if (this.currentTechnique) {
            this.guidanceText.textContent = this.currentTechnique.description + '. Click play when ready.';
        }
    }
    
    startBreathingLoop() {
        if (!this.isActive || this.isPaused) return;
        
        const technique = this.currentTechnique;
        const currentPhaseData = technique.phases[this.currentPhase];
        
        // Update timers first
        this.phaseTimer += 0.1;
        this.sessionDuration += 0.1;
        
        // Check if phase is complete after timer update
        if (this.phaseTimer >= currentPhaseData.duration) {
            this.phaseTimer = 0;
            this.currentPhase++;
            
            // Check if cycle is complete
            if (this.currentPhase >= technique.phases.length) {
                this.currentPhase = 0;
                this.cycleCounter++;
                
                // Check if practice is complete
                if (this.cycleCounter >= technique.cycles) {
                    this.completePractice();
                    return;
                }
            }
        }
        
        // Get current phase data (might be new after transition)
        const activePhaseData = technique.phases[this.currentPhase];
        
        // Update all visuals with current state
        this.breathingCircle.className = `breathing-circle ${activePhaseData.class}`;
        this.breathCount.textContent = Math.ceil(activePhaseData.duration - this.phaseTimer);
        this.phasePill.textContent = activePhaseData.instruction;
        this.phasePill.className = `phase-pill ${activePhaseData.class}`;
        
        // Update session-level progress (not circular progress)
        this.cycleCount.textContent = this.cycleCounter;
        if (this.currentTechnique) {
            const totalPhases = this.currentTechnique.cycles * this.currentTechnique.phases.length;
            const completedPhases = (this.cycleCounter * this.currentTechnique.phases.length) + this.currentPhase;
            const progress = (completedPhases / totalPhases) * 100;
            this.progressFill.style.width = `${Math.min(progress, 100)}%`;
        }
        this.updateSessionTimer();
        
        // Continue loop
        this.animationFrame = requestAnimationFrame(() => {
            setTimeout(() => this.startBreathingLoop(), 100);
        });
    }
    
    startProgressRingAnimation() {
        if (!this.isActive || this.isPaused || !this.progressRing) return;
        
        const technique = this.currentTechnique;
        if (!technique) return;
        
        const currentPhaseData = technique.phases[this.currentPhase];
        
        // Update progress ring with current timer state
        this.updateProgressRing(currentPhaseData.duration, this.phaseTimer);
        
        // Continue smooth animation at 60fps
        this.progressAnimationFrame = requestAnimationFrame(() => {
            this.startProgressRingAnimation();
        });
    }
    
    completePractice() {
        this.stopPractice();
        
        this.breathingCircle.className = 'breathing-circle';
        this.breathCount.textContent = '✓';
        this.phasePill.textContent = 'Complete!';
        this.phasePill.className = 'phase-pill';
        
        this.guidanceText.textContent = `Great job! You completed ${this.currentTechnique.cycles} cycles of ${this.currentTechnique.name}.`;
        
        // Show completion celebration
        setTimeout(() => {
            this.guidanceText.textContent += ' Take a moment to notice how you feel.';
        }, 2000);
    }
    
    updateDisplay() {
        this.cycleCount.textContent = this.cycleCounter;
    }
    
    updateProgress() {
        if (!this.currentTechnique) return;
        
        const totalPhases = this.currentTechnique.cycles * this.currentTechnique.phases.length;
        const completedPhases = (this.cycleCounter * this.currentTechnique.phases.length) + this.currentPhase;
        const progress = (completedPhases / totalPhases) * 100;
        
        this.progressFill.style.width = `${Math.min(progress, 100)}%`;
    }
    
    updateSessionTimer() {
        if (!this.sessionStartTime) {
            this.sessionTimer.textContent = '00:00';
            return;
        }
        
        const elapsed = Math.floor(this.sessionDuration);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        
        this.sessionTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updatePlayPauseButton() {
        const isPlaying = this.isActive && !this.isPaused;
        
        this.playPauseBtn.innerHTML = isPlaying ? `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
                <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
            </svg>
        ` : `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 5v14l11-7z" stroke="currentColor" stroke-width="2" fill="currentColor"/>
            </svg>
        `;
        
        this.playPauseBtn.classList.toggle('paused', !isPlaying);
    }
    
    updateTechniqueDetails(technique) {
        if (!technique.details) return;
        
        // Update overview
        this.techniqueOverview.textContent = technique.details.overview;
        
        // Update breathing pattern pill
        const pattern = this.generateBreathingPattern(technique);
        this.patternPill.textContent = pattern;
        
        // Update benefits
        this.techniqueBenefits.innerHTML = '';
        technique.details.benefits.forEach(benefit => {
            const li = document.createElement('li');
            li.textContent = benefit;
            this.techniqueBenefits.appendChild(li);
        });
        
        // Update instructions
        this.techniqueInstructions.innerHTML = '';
        technique.details.instructions.forEach(instruction => {
            const li = document.createElement('li');
            li.textContent = instruction;
            this.techniqueInstructions.appendChild(li);
        });
        
        // Update tips and best for
        this.techniqueTips.textContent = technique.details.tips;
        this.techniqueBestFor.textContent = technique.details.bestFor;
    }

    generateBreathingPattern(technique) {
        // Extract durations from phases and create pattern string
        const durations = technique.phases.map(phase => Math.floor(phase.duration));
        return durations.join('-');
    }

    updateProgressRing(duration, elapsed) {
        if (!this.progressRing) return;
        
        // Calculate progress (0 to 1)
        const progress = elapsed / duration;
        
        // Get circumference (2π × radius) - Updated for new responsive SVG
        const circumference = 609.13; // 2 * Math.PI * 97
        
        // Calculate offset (ring starts at 0 and increases as time progresses)
        // When progress = 0: offset = 0 (full ring visible)
        // When progress = 1: offset = circumference (no ring visible)
        const offset = progress * circumference;
        
        // Update the progress ring
        this.progressRing.style.strokeDashoffset = offset.toString();
    }

    resetProgressRing() {
        if (!this.progressRing) return;
        
        // Reset to full ring (0 offset means full circle visible)
        this.progressRing.style.strokeDashoffset = '0';
    }
    
    backToSelection() {
        this.stopPractice();
        this.showTechniqueSelection();
    }
}

// Global functions for HTML onclick handlers
let breathingPractices;

function openBreathingModal() {
    if (!breathingPractices) {
        breathingPractices = new BreathingPractices();
    }
    breathingPractices.openModal();
}

function closeBreathingModal() {
    if (breathingPractices) {
        breathingPractices.closeModal();
    }
}

function startTechnique(techniqueId) {
    if (breathingPractices) {
        breathingPractices.startTechnique(techniqueId);
    }
}

function togglePractice() {
    if (breathingPractices) {
        breathingPractices.togglePractice();
    }
}

function resetPractice() {
    if (breathingPractices) {
        breathingPractices.resetPractice();
    }
}

function backToSelection() {
    if (breathingPractices) {
        breathingPractices.backToSelection();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Breathing practices will be initialized when modal is first opened
    });
} else {
    // DOM is already ready
}