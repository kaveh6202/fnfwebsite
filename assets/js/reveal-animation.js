// Intersection reveal animation
(function(){
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('show');
        obs.unobserve(en.target);
      }
    });
  }, {threshold:.15});
  els.forEach(el=>obs.observe(el));
})();
