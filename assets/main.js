/* main.js v11 — nav hamburger, mobile menu, lazy images */

// ── NAV HAMBURGER ──────────────────────────────────────────────
(function(){
  var ham = document.querySelector('.nav-ham');
  if(!ham) return;

  // Create mobile menu if not already in DOM
  var menu = document.getElementById('navMobileMenu');
  if(!menu){
    menu = document.createElement('div');
    menu.id = 'navMobileMenu';
    menu.className = 'nav-mobile-menu';

    // Collect nav links
    var links = document.querySelectorAll('.nav-links a, .nav-links li > a');
    var panel = document.createElement('div');
    panel.className = 'nav-mobile-panel';

    links.forEach(function(a){
      var clone = document.createElement('a');
      clone.href = a.href;
      clone.textContent = a.textContent.trim();
      panel.appendChild(clone);
    });

    // CTA link
    var cta = document.querySelector('.nav-cta');
    if(cta){
      var ctaClone = document.createElement('a');
      ctaClone.href = cta.href;
      ctaClone.textContent = cta.textContent.trim();
      ctaClone.style.cssText = 'color:#fff !important;font-weight:700;';
      panel.appendChild(ctaClone);
    }

    menu.appendChild(panel);
    document.body.appendChild(menu);
  }

  var open = false;

  function openMenu(){
    open = true;
    menu.classList.add('open');
    ham.innerHTML = '&#10005;';
    document.body.style.overflow = 'hidden';
  }
  function closeMenu(){
    open = false;
    menu.classList.remove('open');
    ham.innerHTML = '&#9776;';
    document.body.style.overflow = '';
  }

  ham.addEventListener('click', function(e){
    e.stopPropagation();
    open ? closeMenu() : openMenu();
  });

  menu.addEventListener('click', function(e){
    if(e.target === menu) closeMenu();
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });

  // Close on resize to desktop
  window.addEventListener('resize', function(){
    if(window.innerWidth > 960) closeMenu();
  });
})();

// ── SMOOTH SCROLL ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(function(a){
  a.addEventListener('click', function(e){
    var target = document.querySelector(a.getAttribute('href'));
    if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth'}); }
  });
});

// ── SCROLL-REVEAL (lightweight) ───────────────────────────────
if('IntersectionObserver' in window){
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting){ en.target.style.opacity='1'; en.target.style.transform='none'; }
    });
  },{threshold:0.08});
  document.querySelectorAll('.reveal').forEach(function(el){
    el.style.opacity='0';
    el.style.transform='translateY(14px)';
    el.style.transition='opacity .45s ease,transform .45s ease';
    obs.observe(el);
  });
}
