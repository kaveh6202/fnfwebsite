// ===== YOGA PRACTICES MODAL =====

class YogaPractices {
    constructor() {
        this.modal = document.getElementById('yogaModal');
        this.categoriesView = document.getElementById('yogaCategories');
        this.videosView = document.getElementById('yogaVideos');
        this.videoGrid = document.getElementById('videoGrid');
        this.categoryName = document.getElementById('currentCategoryName');
        
        this.currentCategory = null;
        
        // Video data for each category
        this.videoData = {
            beginner: {
                name: 'Beginner Flow',
                videos: [
                    {
                        id: 'v7AYKMP6rOE',
                        title: 'Yoga For Complete Beginners',
                        description: 'A gentle 20-minute flow perfect for those new to yoga',
                        duration: '20 min',
                        level: 'Beginner'
                    },
                    {
                        id: 'oBu-pQG6sTY',
                        title: 'Basic Yoga Flow',
                        description: 'Learn fundamental poses and breathing techniques',
                        duration: '15 min',
                        level: 'Beginner'
                    },
                    {
                        id: 'Eml2xnoLpYE',
                        title: 'Gentle Morning Yoga',
                        description: 'Start your day with this easy, energizing routine',
                        duration: '18 min',
                        level: 'Beginner'
                    },
                    {
                        id: 'GLy2rYHwUqY',
                        title: 'Yoga Basics for Flexibility',
                        description: 'Build flexibility with these foundational poses',
                        duration: '22 min',
                        level: 'Beginner'
                    }
                ]
            },
            intermediate: {
                name: 'Intermediate Flow',
                videos: [
                    {
                        id: 'Ci3na6ThUJc',
                        title: 'Intermediate Vinyasa Flow',
                        description: 'Dynamic flowing sequences to build strength and flexibility',
                        duration: '30 min',
                        level: 'Intermediate'
                    },
                    {
                        id: 'KWBfQjuwp4E',
                        title: 'Power Yoga Flow',
                        description: 'Energizing practice to build core strength',
                        duration: '35 min',
                        level: 'Intermediate'
                    },
                    {
                        id: 'CLdCQYWWLnY',
                        title: 'Intermediate Hatha Yoga',
                        description: 'Hold poses longer to deepen your practice',
                        duration: '28 min',
                        level: 'Intermediate'
                    },
                    {
                        id: 'UEEsdXn8oG8',
                        title: 'Flow for Strength',
                        description: 'Build muscle tone with challenging sequences',
                        duration: '32 min',
                        level: 'Intermediate'
                    }
                ]
            },
            restorative: {
                name: 'Restorative Flow',
                videos: [
                    {
                        id: 'BiWnaZ2nph0',
                        title: 'Deep Relaxation Yoga',
                        description: 'Gentle poses with props for ultimate relaxation',
                        duration: '45 min',
                        level: 'All Levels'
                    },
                    {
                        id: 'o5w2xkZuWrI',
                        title: 'Restorative Evening Practice',
                        description: 'Wind down with supported poses and breathing',
                        duration: '35 min',
                        level: 'All Levels'
                    },
                    {
                        id: 'xz0p5TZlPqg',
                        title: 'Yin Yoga for Deep Stretching',
                        description: 'Hold poses for 3-5 minutes to release tension',
                        duration: '40 min',
                        level: 'All Levels'
                    },
                    {
                        id: 'A0pkEgZiRG4',
                        title: 'Gentle Restorative Flow',
                        description: 'Nurturing practice for stress relief',
                        duration: '30 min',
                        level: 'All Levels'
                    }
                ]
            },
            morning: {
                name: 'Morning Energizer',
                videos: [
                    {
                        id: 'VaoV1PrYft4',
                        title: 'Energizing Morning Yoga',
                        description: 'Wake up your body with gentle stretches',
                        duration: '15 min',
                        level: 'All Levels'
                    },
                    {
                        id: 'r3G4GH7AxD4',
                        title: '10 Minute Morning Yoga',
                        description: 'Quick flow to start your day right',
                        duration: '10 min',
                        level: 'Beginner'
                    },
                    {
                        id: 'oX6I6vs1EFs',
                        title: 'Sun Salutation Flow',
                        description: 'Classic morning sequence for energy',
                        duration: '20 min',
                        level: 'Intermediate'
                    },
                    {
                        id: 'UEja0Q6_hDw',
                        title: 'Morning Stretch & Flow',
                        description: 'Gentle awakening for your entire body',
                        duration: '18 min',
                        level: 'All Levels'
                    }
                ]
            },
            evening: {
                name: 'Evening Wind Down',
                videos: [
                    {
                        id: 'BiWnaZ2nph0',
                        title: 'Bedtime Yoga for Better Sleep',
                        description: 'Calming poses to prepare your body for rest',
                        duration: '30 min',
                        level: 'All Levels'
                    },
                    {
                        id: 'v7rJzHlsOv8',
                        title: 'Evening Relaxation Flow',
                        description: 'Release tension from your day',
                        duration: '25 min',
                        level: 'All Levels'
                    },
                    {
                        id: 'LqXZ628YNj4',
                        title: 'Gentle Evening Stretch',
                        description: 'Slow, mindful movements for relaxation',
                        duration: '15 min',
                        level: 'Beginner'
                    },
                    {
                        id: 'cC7J1dhj4-w',
                        title: 'Yoga for Deep Sleep',
                        description: 'Prepare mind and body for restful sleep',
                        duration: '20 min',
                        level: 'All Levels'
                    }
                ]
            },
            stress: {
                name: 'Stress Relief',
                videos: [
                    {
                        id: 'hJbRpHZr_d0',
                        title: 'Yoga for Stress Relief',
                        description: 'Targeted poses to release tension and anxiety',
                        duration: '25 min',
                        level: 'All Levels'
                    },
                    {
                        id: 'COp7BR_Dvps',
                        title: 'Calming Yoga Flow',
                        description: 'Soothing practice to quiet the mind',
                        duration: '30 min',
                        level: 'All Levels'
                    },
                    {
                        id: 'Yzm3fA2HhkQ',
                        title: 'Anxiety Relief Yoga',
                        description: 'Gentle movements to ease worry and tension',
                        duration: '20 min',
                        level: 'Beginner'
                    },
                    {
                        id: 'UEja0Q6_hDw',
                        title: 'Mindful Stress Release',
                        description: 'Combine breath work with gentle movement',
                        duration: '28 min',
                        level: 'All Levels'
                    }
                ]
            }
        };
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal || e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (this.modal.classList.contains('active')) {
                if (e.key === 'Escape') {
                    this.closeModal();
                }
            }
        });
    }
    
    openModal() {
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        this.showCategories();
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management
        setTimeout(() => {
            const firstCategory = this.modal.querySelector('.category-card');
            if (firstCategory) firstCategory.focus();
        }, 100);
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Reset to categories view
        this.showCategories();
    }
    
    showCategories() {
        this.categoriesView.style.display = 'block';
        this.videosView.style.display = 'none';
        this.currentCategory = null;
    }
    
    showYogaVideos(category) {
        if (!this.videoData[category]) return;
        
        this.currentCategory = category;
        const categoryData = this.videoData[category];
        
        // Update category name
        this.categoryName.textContent = categoryData.name;
        
        // Generate video grid
        this.videoGrid.innerHTML = categoryData.videos.map(video => this.createVideoCard(video)).join('');
        
        // Switch views
        this.categoriesView.style.display = 'none';
        this.videosView.style.display = 'block';
        
        // Focus management
        setTimeout(() => {
            const backButton = this.modal.querySelector('.back-btn');
            if (backButton) backButton.focus();
        }, 100);
    }
    
    createVideoCard(video) {
        return `
            <div class="video-card">
                <div class="video-thumbnail">
                    <iframe 
                        src="https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1"
                        title="${video.title}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowfullscreen
                        loading="lazy">
                    </iframe>
                </div>
                <div class="video-info">
                    <h4 class="video-title">${video.title}</h4>
                    <p class="video-description">${video.description}</p>
                    <div class="video-meta">
                        <span class="video-duration">${video.duration}</span>
                        <span class="video-level">${video.level}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    backToCategories() {
        this.showCategories();
        
        // Focus management
        setTimeout(() => {
            const firstCategory = this.modal.querySelector('.category-card');
            if (firstCategory) firstCategory.focus();
        }, 100);
    }
}

// Initialize yoga practices
const yogaPractices = new YogaPractices();

// Global functions for HTML onclick handlers
function openYogaModal() {
    yogaPractices.openModal();
}

function closeYogaModal() {
    yogaPractices.closeModal();
}

function showYogaVideos(category) {
    yogaPractices.showYogaVideos(category);
}

function backToCategories() {
    yogaPractices.backToCategories();
}

// Export for module use if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { YogaPractices, openYogaModal, closeYogaModal, showYogaVideos, backToCategories };
}
