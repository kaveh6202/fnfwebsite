// Wellness Tips Slider Functionality
(function(){
  const slider = document.querySelector('.wellness-tips-slider');
  if (!slider) return;
  
  const track = slider.querySelector('.wellness-tips-track');
  const slides = slider.querySelectorAll('.wellness-tip-slide');
  const dots = slider.querySelectorAll('.wellness-tips-dots .dot');
  const prevBtn = slider.querySelector('.wellness-tips-prev');
  const nextBtn = slider.querySelector('.wellness-tips-next');
  const playPauseBtn = slider.querySelector('.wellness-tips-play-pause');
  
  let currentSlide = 0;
  let autoPlayInterval;
  let progressInterval;
  const autoPlayDelay = 10000; // 10 seconds for wellness tips
  let progressStartTime = 0;
  let isPlaying = true;
  
  // Initialize slider
  function initSlider() {
    if (slides.length === 0) return;
    
    showSlide(0);
    startAutoPlay();
    
    // Add event listeners
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', () => nextSlide(true));
    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => goToSlide(index));
    });
    
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
  
  // Toggle play/pause
  function togglePlayPause() {
    if (isPlaying) {
      pauseAutoPlay();
    } else {
      resumeAutoPlay();
    }
  }

  // Start auto-play
  function startAutoPlay() {
    if (slides.length <= 1) return;
    
    isPlaying = true;
    updatePlayPauseButton();
    startProgressBar();
    autoPlayInterval = setInterval(() => {
      nextSlide();
    }, autoPlayDelay);
  }

  // Pause auto-play (user initiated)
  function pauseAutoPlay() {
    isPlaying = false;
    updatePlayPauseButton();
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
    stopProgressBar();
  }

  // Resume auto-play (user initiated)
  function resumeAutoPlay() {
    if (slides.length <= 1) return;
    
    isPlaying = true;
    updatePlayPauseButton();
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

  // Update play/pause button appearance
  function updatePlayPauseButton() {
    if (!playPauseBtn) return;
    
    if (isPlaying) {
      playPauseBtn.classList.remove('paused');
      playPauseBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="6" y="4" width="4" height="16" fill="currentColor"/>
          <rect x="14" y="4" width="4" height="16" fill="currentColor"/>
        </svg>
      `;
      playPauseBtn.setAttribute('aria-label', 'Pause slideshow');
    } else {
      playPauseBtn.classList.add('paused');
      playPauseBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M8 5v14l11-7z" fill="currentColor"/>
        </svg>
      `;
      playPauseBtn.setAttribute('aria-label', 'Play slideshow');
    }
  }
  
  // Start progress bar animation
  function startProgressBar() {
    const progressBar = slider.querySelector('.progress-bar');
    if (!progressBar) return;
    
    progressBar.style.width = '0%';
    progressStartTime = Date.now();
    
    progressInterval = setInterval(() => {
      const elapsed = Date.now() - progressStartTime;
      const progress = Math.min((elapsed / autoPlayDelay) * 100, 100);
      progressBar.style.width = progress + '%';
      
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 50);
  }
  
  // Stop progress bar
  function stopProgressBar() {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }
  
  // Reset progress bar
  function resetProgressBar() {
    const progressBar = slider.querySelector('.progress-bar');
    if (!progressBar) return;
    
    stopProgressBar();
    progressBar.style.width = '0%';
  }
  
  // Handle keyboard navigation
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
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(slides.length - 1);
        break;
    }
  }
  
  // Add touch/swipe support
  function addTouchSupport() {
    let startX = 0;
    let endX = 0;
    let startY = 0;
    let endY = 0;
    
    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });
    
    slider.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      handleSwipe();
    });
    
    function handleSwipe() {
      const deltaX = startX - endX;
      const deltaY = startY - endY;
      const minSwipeDistance = 50;
      
      // Only handle horizontal swipes (ignore if vertical swipe is dominant)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // Swiped left - go to next slide
          nextSlide(true);
        } else {
          // Swiped right - go to previous slide
          prevSlide();
        }
      }
    }
  }
  
  // Pause on hover (optional - can be enabled if desired)
  function addHoverPause() {
    slider.addEventListener('mouseenter', stopAutoPlay);
    slider.addEventListener('mouseleave', startAutoPlay);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSlider);
  } else {
    initSlider();
  }
  
})();
