// Burger Menu Functionality
(function(){
  const burgerMenu = document.querySelector('.burger-menu');
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('nav a');
  
  if (!burgerMenu || !nav) return;
  
  // Toggle menu
  function toggleMenu() {
    burgerMenu.classList.toggle('active');
    nav.classList.toggle('active');
    
    // Toggle aria-expanded for accessibility
    const isExpanded = nav.classList.contains('active');
    burgerMenu.setAttribute('aria-expanded', isExpanded);
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isExpanded ? 'hidden' : '';
  }
  
  // Close menu
  function closeMenu() {
    burgerMenu.classList.remove('active');
    nav.classList.remove('active');
    burgerMenu.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  
  // Event listeners
  burgerMenu.addEventListener('click', toggleMenu);
  
  // Close menu when clicking on nav links
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !burgerMenu.contains(e.target)) {
      closeMenu();
    }
  });
  
  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      closeMenu();
    }
  });
  
  // Handle window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      closeMenu();
    }
  });
  
  // Initialize accessibility attributes
  burgerMenu.setAttribute('aria-expanded', 'false');
  burgerMenu.setAttribute('role', 'button');
})();
