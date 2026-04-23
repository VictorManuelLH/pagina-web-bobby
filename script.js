// ============================
// NAVBAR — scroll shadow
// ============================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.12)';
  } else {
    navbar.style.boxShadow = '0 1px 12px rgba(0,0,0,0.08)';
  }
});

// ============================
// MOBILE MENU
// ============================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

// ============================
// ACTIVE NAV LINK on scroll
// ============================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 90;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--blue)';
    }
  });
});

// ============================
// TESTIMONIOS CARRUSEL
// ============================
(function () {
  const track = document.getElementById('testimoniosTrack');
  const dotsEl = document.getElementById('testiDots');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  const cards = track ? track.querySelectorAll('.testi-card') : [];
  const total = cards.length;
  let current = 0;
  let autoTimer = null;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsEl.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), 4500);
  }

  function stopAuto() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }

  if (track && total > 0) {
    prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
    nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

    dotsEl.querySelectorAll('.dot').forEach((d, i) => {
      d.addEventListener('click', () => { goTo(i); startAuto(); });
    });

    // Pause on hover
    const slider = document.getElementById('testimoniosSlider');
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    // Touch swipe support
    let touchStartX = 0;
    slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
    });

    startAuto();
  }
})();

// ============================
// LIGHTBOX
// ============================
let lightboxItems = [];
let lightboxIndex = 0;

function openLightbox(el) {
  lightboxItems = Array.from(document.querySelectorAll('.gallery-item'));
  lightboxIndex = lightboxItems.indexOf(el);
  const src = el.querySelector('img').src;
  const alt = el.querySelector('img').alt;
  const img = document.getElementById('lightboxImg');
  img.src = src.replace('w=600', 'w=1400');
  img.alt = alt;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
  if (event && event.target !== document.getElementById('lightbox') && !event.target.closest('.lightbox-close')) return;
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxNav(dir, event) {
  event.stopPropagation();
  lightboxIndex = (lightboxIndex + dir + lightboxItems.length) % lightboxItems.length;
  const el = lightboxItems[lightboxIndex];
  const img = document.getElementById('lightboxImg');
  img.style.opacity = '0';
  setTimeout(() => {
    img.src = el.querySelector('img').src.replace('w=600', 'w=1400');
    img.alt = el.querySelector('img').alt;
    img.style.opacity = '1';
  }, 150);
}

document.addEventListener('keydown', (e) => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') { lb.classList.remove('open'); document.body.style.overflow = ''; }
  if (e.key === 'ArrowRight') lightboxNav(1, { stopPropagation: () => {} });
  if (e.key === 'ArrowLeft') lightboxNav(-1, { stopPropagation: () => {} });
});

// ============================
// FORM SUBMIT
// ============================
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target;
  btn.textContent = '✓ Mensaje enviado';
  btn.style.background = '#22c55e';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Enviar mensaje';
    btn.style.background = '';
    btn.disabled = false;
  }, 3000);
}

// ============================
// SCROLL REVEAL (Intersection Observer)
// ============================
const revealEls = document.querySelectorAll(
  '.service-card, .stat-item, .testi-card, .product-card, .info-card, .gallery-item'
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '0';
      entry.target.style.transform = 'translateY(20px)';
      entry.target.style.transition = `opacity 0.5s ease ${i * 0.04}s, transform 0.5s ease ${i * 0.04}s`;
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, 50);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// ============================
// SMOOTH scroll for nav links
// ============================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
