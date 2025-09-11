/* ===============================================
   IMAGE LIGHTBOX FUNCTIONALITY
   =============================================== */

class ImageLightbox {
  constructor() {
    this.lightbox = null;
    this.lightboxImage = null;
    this.lightboxCaption = null;
    this.closeBtn = null;
    this.prevBtn = null;
    this.nextBtn = null;
    this.images = [];
    this.currentIndex = 0;
    this.isOpen = false;
    
    this.init();
  }
  
  init() {
    // Create lightbox HTML if it doesn't exist
    this.createLightboxHTML();
    
    // Get DOM elements
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImage = document.getElementById('lightboxImage');
    this.lightboxCaption = document.getElementById('lightboxCaption');
    this.closeBtn = document.getElementById('lightboxClose');
    this.prevBtn = document.getElementById('lightboxPrev');
    this.nextBtn = document.getElementById('lightboxNext');
    
    // Bind event listeners
    this.bindEvents();
    
    // Initialize timeline images
    this.initializeTimelineImages();
  }
  
  createLightboxHTML() {
    // Check if lightbox already exists
    if (document.getElementById('lightbox')) {
      return;
    }
    
    const lightboxHTML = `
      <div id="lightbox" class="lightbox-overlay" aria-hidden="true" role="dialog" aria-labelledby="lightboxCaption">
        <div class="lightbox-content">
          <button id="lightboxClose" class="lightbox-close" aria-label="Close lightbox" title="Close (Esc)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
          
          <img id="lightboxImage" class="lightbox-image" alt="" />
          
          <div id="lightboxCaption" class="lightbox-caption"></div>
          
          <button id="lightboxPrev" class="lightbox-nav lightbox-prev" aria-label="Previous image" title="Previous (←)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <button id="lightboxNext" class="lightbox-nav lightbox-next" aria-label="Next image" title="Next (→)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
  }
  
  bindEvents() {
    // Close button
    this.closeBtn.addEventListener('click', () => this.close());
    
    // Navigation buttons
    this.prevBtn.addEventListener('click', () => this.showPrevious());
    this.nextBtn.addEventListener('click', () => this.showNext());
    
    // Overlay click to close
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.close();
      }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.showPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.showNext();
          break;
      }
    });
    
    // Prevent body scroll when lightbox is open
    this.lightbox.addEventListener('wheel', (e) => {
      if (this.isOpen) {
        e.preventDefault();
      }
    });
    
    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    this.lightbox.addEventListener('touchstart', (e) => {
      if (!this.isOpen) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });
    
    this.lightbox.addEventListener('touchend', (e) => {
      if (!this.isOpen) return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      // Only respond to horizontal swipes (ignore vertical scrolling)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.showPrevious();
        } else {
          this.showNext();
        }
      }
    });
  }
  
  initializeTimelineImages() {
    // Find all timeline images
    const timelineImages = document.querySelectorAll('.timeline-image img');
    
    // Convert NodeList to array and store image data
    this.images = Array.from(timelineImages).map((img, index) => ({
      src: img.src,
      alt: img.alt,
      caption: this.generateCaption(img),
      element: img,
      index: index
    }));
    
    // Add click event listeners to timeline images
    timelineImages.forEach((img, index) => {
      img.addEventListener('click', (e) => {
        e.preventDefault();
        this.open(index);
      });
      
      // Add keyboard support
      img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.open(index);
        }
      });
      
      // Make images focusable for keyboard navigation
      img.setAttribute('tabindex', '0');
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', `View full size: ${img.alt}`);
    });
  }
  
  generateCaption(img) {
    // Get the timeline item content
    const timelineItem = img.closest('.timeline-item');
    if (!timelineItem) return img.alt;
    
    const date = timelineItem.querySelector('.timeline-date')?.textContent || '';
    const title = timelineItem.querySelector('h3')?.textContent || '';
    const description = timelineItem.querySelector('p')?.textContent || '';
    
    return `${date} - ${title}`;
  }
  
  open(index = 0) {
    if (this.images.length === 0) return;
    
    this.currentIndex = index;
    this.isOpen = true;
    
    // Update image and caption
    this.updateContent();
    
    // Show lightbox
    this.lightbox.classList.add('active');
    this.lightbox.setAttribute('aria-hidden', 'false');
    
    // Focus management
    this.closeBtn.focus();
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Update navigation buttons
    this.updateNavigation();
  }
  
  close() {
    this.isOpen = false;
    
    // Hide lightbox
    this.lightbox.classList.remove('active');
    this.lightbox.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    // Return focus to the clicked image
    if (this.images[this.currentIndex]?.element) {
      this.images[this.currentIndex].element.focus();
    }
  }
  
  showNext() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
      this.updateContent();
      this.updateNavigation();
    }
  }
  
  showPrevious() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateContent();
      this.updateNavigation();
    }
  }
  
  updateContent() {
    const currentImage = this.images[this.currentIndex];
    if (!currentImage) return;
    
    // Show loading state
    this.lightboxImage.style.opacity = '0.5';
    
    // Update image
    this.lightboxImage.src = currentImage.src;
    this.lightboxImage.alt = currentImage.alt;
    
    // Update caption
    this.lightboxCaption.textContent = currentImage.caption;
    
    // Handle image load
    this.lightboxImage.onload = () => {
      this.lightboxImage.style.opacity = '1';
    };
    
    // Handle image error
    this.lightboxImage.onerror = () => {
      this.lightboxImage.style.opacity = '1';
      this.lightboxCaption.textContent = 'Image could not be loaded';
    };
  }
  
  updateNavigation() {
    // Update previous button
    if (this.currentIndex === 0) {
      this.prevBtn.disabled = true;
      this.prevBtn.style.opacity = '0.3';
    } else {
      this.prevBtn.disabled = false;
      this.prevBtn.style.opacity = '1';
    }
    
    // Update next button
    if (this.currentIndex === this.images.length - 1) {
      this.nextBtn.disabled = true;
      this.nextBtn.style.opacity = '0.3';
    } else {
      this.nextBtn.disabled = false;
      this.nextBtn.style.opacity = '1';
    }
    
    // Hide navigation if only one image
    if (this.images.length <= 1) {
      this.prevBtn.style.display = 'none';
      this.nextBtn.style.display = 'none';
    } else {
      this.prevBtn.style.display = 'flex';
      this.nextBtn.style.display = 'flex';
    }
  }
  
  // Public method to refresh images (useful if timeline is dynamically updated)
  refresh() {
    this.initializeTimelineImages();
  }
}

// Initialize lightbox when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on pages with timeline
  if (document.querySelector('.timeline-image')) {
    window.imageLightbox = new ImageLightbox();
  }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageLightbox;
}
