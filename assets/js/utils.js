// Utility functions

// Current year display
document.getElementById('year').textContent = new Date().getFullYear();

// Hero image fallback if asset missing
(function(){
  const hero = document.querySelector('.hero');
  const testImg = new Image();
  const url = hero.style.backgroundImage.match(/url\("(.+)"\)/)?.[1];
  if(!url) return;
  testImg.onerror = ()=>{
    hero.style.background = 'linear-gradient(180deg, rgba(10,14,11,.02), rgba(10,14,11,.85)), radial-gradient(1200px 400px at 70% 0%, rgba(255,255,255,.18), transparent 60%), linear-gradient(120deg, #f1f5ee, #cfe0c3)';
  };
  testImg.src = url;
})();
