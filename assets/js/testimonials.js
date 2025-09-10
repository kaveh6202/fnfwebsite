// Testimonial Slider Functionality
(function(){
  const slider = document.querySelector('.testimonial-slider');
  if (!slider) return;
  
  const track = slider.querySelector('.testimonial-track');
  const slides = slider.querySelectorAll('.testimonial-slide');
  const dots = slider.querySelectorAll('.dot');
  const prevBtn = slider.querySelector('.testimonial-prev');
  const nextBtn = slider.querySelector('.testimonial-next');
  
  let currentSlide = 0;
  let autoPlayInterval;
  let progressInterval;
  const autoPlayDelay = 5000; // 5 seconds
  let progressStartTime = 0;
  
  // Initialize slider
  function initSlider() {
    if (slides.length === 0) return;
    
    showSlide(0);
    startAutoPlay();
    
    // Add event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', () => nextSlide(true));
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Remove hover pause - progress should only respond to clicks/taps
    
    // Keyboard navigation
    slider.addEventListener('keydown', handleKeydown);
    
    // Touch/swipe support
    addTouchSupport();
  }
  
  // Show specific slide
  function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide and dot
    if (slides[index]) {
      slides[index].classList.add('active');
      currentSlide = index;
    }
    
    if (dots[index]) {
      dots[index].classList.add('active');
    }
    
    // Transform track to show current slide
    const translateX = -index * 100;
    track.style.transform = `translateX(${translateX}%)`;
    
    // Update button states
    updateButtonStates();
  }
  
  // Go to next slide (automatic or manual)
  function nextSlide(isManual = false) {
    const nextIndex = currentSlide >= slides.length - 1 ? 0 : currentSlide + 1;
    showSlide(nextIndex);
    
    if (isManual) {
      resetProgressBar();
      restartAutoPlay();
    } else {
      // For automatic slides, just restart the progress bar without resetting auto-play
      startProgressBar();
    }
  }
  
  // Go to previous slide (manual only)
  function prevSlide() {
    const prevIndex = currentSlide <= 0 ? slides.length - 1 : currentSlide - 1;
    showSlide(prevIndex);
    resetProgressBar();
    restartAutoPlay();
  }
  
  // Go to specific slide (manual only)
  function goToSlide(index) {
    if (index >= 0 && index < slides.length) {
      showSlide(index);
      resetProgressBar();
      restartAutoPlay();
    }
  }
  
  // Update button states
  function updateButtonStates() {
    if (prevBtn) {
      prevBtn.disabled = false; // Always enabled for infinite loop
    }
    
    if (nextBtn) {
      nextBtn.disabled = false; // Always enabled for infinite loop
    }
  }
  
  // Start auto-play
  function startAutoPlay() {
    if (slides.length <= 1) return;
    
    startProgressBar();
    autoPlayInterval = setInterval(() => {
      nextSlide();
    }, autoPlayDelay);
  }
  
  // Stop auto-play
  function stopAutoPlay() {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
    stopProgressBar();
  }
  
  // Restart auto-play
  function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }
  
  // Start progress bar animation
  function startProgressBar() {
    const progressBar = slider.querySelector('.progress-bar');
    if (!progressBar) return;
    
    progressStartTime = Date.now();
    
    function updateProgress() {
      const elapsed = Date.now() - progressStartTime;
      const progress = Math.min((elapsed / autoPlayDelay) * 100, 100);
      
      progressBar.style.width = progress + '%';
      
      if (progress < 100) {
        progressInterval = requestAnimationFrame(updateProgress);
      }
    }
    
    progressBar.style.width = '0%';
    progressInterval = requestAnimationFrame(updateProgress);
  }
  
  // Stop progress bar animation
  function stopProgressBar() {
    if (progressInterval) {
      cancelAnimationFrame(progressInterval);
      progressInterval = null;
    }
    
    const progressBar = slider.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.width = '0%';
    }
  }
  
  // Reset progress bar
  function resetProgressBar() {
    stopProgressBar();
    const progressBar = slider.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.width = '0%';
    }
  }
  
  // Keyboard navigation
  function handleKeydown(e) {
    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        prevSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextSlide(true);
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        // Toggle auto-play
        if (autoPlayInterval) {
          stopAutoPlay();
        } else {
          startAutoPlay();
        }
        break;
    }
  }
  
  // Touch/swipe support
  function addTouchSupport() {
    let startX = 0;
    let endX = 0;
    let startY = 0;
    let endY = 0;
    
    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      stopAutoPlay();
      resetProgressBar();
    }, { passive: true });
    
    slider.addEventListener('touchmove', (e) => {
      // Prevent vertical scrolling when swiping horizontally
      const deltaX = Math.abs(e.touches[0].clientX - startX);
      const deltaY = Math.abs(e.touches[0].clientY - startY);
      
      if (deltaX > deltaY) {
        e.preventDefault();
      }
    }, { passive: false });
    
    slider.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      const deltaX = startX - endX;
      const deltaY = Math.abs(startY - endY);
      const minSwipeDistance = 50;
      
      // Only process horizontal swipes
      if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > deltaY) {
        if (deltaX > 0) {
          // Swipe left - next slide
          nextSlide(true);
        } else {
          // Swipe right - previous slide
          prevSlide();
        }
      } else {
        // Restart auto-play if no significant swipe
        startAutoPlay();
      }
    }, { passive: true });
  }
  
  // Intersection Observer for auto-play control
  function setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      initSlider();
      return;
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          initSlider();
        } else {
          stopAutoPlay();
        }
      });
    }, {
      threshold: 0.5
    });
    
    observer.observe(slider);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupIntersectionObserver);
  } else {
    setupIntersectionObserver();
  }
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    stopAutoPlay();
    stopProgressBar();
  });
  
  // Handle visibility change (pause when tab is not active)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoPlay();
    } else {
      startAutoPlay();
    }
  });
})();
