// NAVBAR — scroll shadow
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10
    ? '0 2px 20px rgba(0,0,0,0.12)'
    : '0 1px 12px rgba(0,0,0,0.08)';
}, { passive: true });

// MOBILE MENU
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
function closeMobile() { mobileMenu.classList.remove('open'); }

// ACTIVE NAV LINK on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 90) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

// TESTIMONIOS CARRUSEL
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
    dotsEl.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
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
    dotsEl.querySelectorAll('.dot').forEach((d, i) => d.addEventListener('click', () => { goTo(i); startAuto(); }));

    const slider = document.getElementById('testimoniosSlider');
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    let touchStartX = 0;
    slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); startAuto(); }
    });

    startAuto();
  }
})();

// LIGHTBOX
(function () {
  let items = [];
  let idx = 0;

  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbClose = document.querySelector('.lightbox-close');
  const lbPrev = document.querySelector('.lightbox-prev');
  const lbNext = document.querySelector('.lightbox-next');

  function open(el) {
    items = Array.from(document.querySelectorAll('.gallery-item'));
    idx = items.indexOf(el);
    lbImg.src = el.querySelector('img').src;
    lbImg.alt = el.querySelector('img').alt;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  function nav(dir) {
    idx = (idx + dir + items.length) % items.length;
    const el = items[idx];
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = el.querySelector('img').src;
      lbImg.alt = el.querySelector('img').alt;
      lbImg.style.opacity = '1';
    }, 150);
  }

  // Gallery items — clic y teclado
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => open(item));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(item); }
    });
  });

  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', e => { e.stopPropagation(); nav(-1); });
  lbNext.addEventListener('click', e => { e.stopPropagation(); nav(1); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') nav(1);
    if (e.key === 'ArrowLeft') nav(-1);
  });
})();

// FORM SUBMIT → WhatsApp
(function () {
  const btn = document.querySelector('.contacto-form .btn-orange');
  if (!btn) return;

  btn.addEventListener('click', function (e) {
    e.preventDefault();

    const nombre   = (document.getElementById('form-nombre')?.value   || '').trim();
    const telefono = (document.getElementById('form-telefono')?.value || '').trim();
    const mascota  = (document.getElementById('form-mascota')?.value  || '').trim();
    const servicio =  document.getElementById('form-servicio')?.value  || '';
    const mensaje  = (document.getElementById('form-mensaje')?.value  || '').trim();

    if (!nombre || !telefono) {
      const missing = !nombre
        ? document.getElementById('form-nombre')
        : document.getElementById('form-telefono');
      missing.style.borderColor = '#ef4444';
      missing.focus();
      setTimeout(() => { missing.style.borderColor = ''; }, 3000);
      return;
    }

    let msg = `Hola, me gustaría agendar una cita en Veterinaria Bobby. 🐾\n\n`;
    msg += `*Nombre:* ${nombre}\n`;
    msg += `*Teléfono:* ${telefono}\n`;
    if (mascota)  msg += `*Mascota:* ${mascota}\n`;
    if (servicio) msg += `*Servicio:* ${servicio}\n`;
    if (mensaje)  msg += `*Mensaje:* ${mensaje}`;

    window.open(`https://wa.me/529512862810?text=${encodeURIComponent(msg)}`, '_blank');

    this.textContent = '✓ ¡Abriendo WhatsApp!';
    this.style.background = '#22c55e';
    this.disabled = true;
    const self = this;
    setTimeout(() => {
      self.innerHTML = '<svg width="20" height="20" viewBox="0 0 32 32" fill="white"><path d="M16 0C7.163 0 0 7.163 0 16c0 2.827.74 5.48 2.031 7.785L0 32l8.418-2.007A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm0 29.333a13.27 13.27 0 01-6.77-1.853l-.486-.29-5.002 1.193 1.224-4.862-.318-.5A13.267 13.267 0 012.667 16C2.667 8.636 8.636 2.667 16 2.667S29.333 8.636 29.333 16 23.364 29.333 16 29.333zm7.27-9.87c-.398-.199-2.354-1.162-2.72-1.294-.364-.133-.63-.199-.895.199-.265.398-1.03 1.294-1.262 1.56-.232.265-.465.298-.863.1-.398-.2-1.682-.62-3.203-1.977-1.184-1.057-1.983-2.362-2.215-2.76-.232-.398-.025-.613.174-.811.18-.179.398-.465.597-.698.199-.232.265-.398.398-.664.133-.265.066-.498-.033-.697-.1-.199-.895-2.157-1.227-2.953-.322-.775-.65-.67-.895-.682l-.763-.013c-.265 0-.697.1-1.062.498-.364.398-1.393 1.362-1.393 3.32 0 1.957 1.427 3.848 1.626 4.113.199.265 2.808 4.287 6.805 6.012.951.41 1.693.655 2.272.839.954.304 1.823.261 2.51.158.765-.114 2.354-.962 2.686-1.89.332-.928.332-1.724.232-1.89-.099-.166-.364-.265-.763-.464z"/></svg> Agendar por WhatsApp';
      self.style.background = '';
      self.disabled = false;
    }, 3000);
  });
})();

// STATS COUNTER ANIMATION
function animateCounter(el) {
  const count = parseInt(el.dataset.count, 10);
  if (isNaN(count)) return;
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function update(time) {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * count);
    el.textContent = prefix + value.toLocaleString('es-MX') + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-count]').forEach(el => statObserver.observe(el));

// SCROLL REVEAL (Intersection Observer)
const revealEls = document.querySelectorAll(
  '.service-card, .stat-item, .testi-card, .info-card, .gallery-item'
);

const observer = new IntersectionObserver((entries) => {
  let batchIndex = 0;
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = batchIndex * 0.06;
      batchIndex++;
      entry.target.style.transition = `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`;
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
  el.style.transform = 'translateY(20px)';
  observer.observe(el);
});

// BACK TO TOP
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// FOOTER YEAR
document.getElementById('footerYear').textContent = new Date().getFullYear();

// HORARIO STATUS
(function () {
  const el = document.getElementById('horarioStatus');
  if (!el) return;
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const isOpen = (day >= 1 && day <= 6 && hour >= 9 && hour < 19) ||
                 (day === 0 && hour >= 10 && hour < 17);
  el.textContent = isOpen ? '● Abierto ahora' : '● Cerrado';
  el.classList.add(isOpen ? 'open' : 'closed');
})();

// SMOOTH scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
