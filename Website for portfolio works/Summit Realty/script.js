(function () {
  'use strict';

  var header = document.getElementById('site-header');

  // Hero-over: transparent nav while hero is visible
  var hero = document.getElementById('hero');
  if (hero && header) {
    var heroObs = new IntersectionObserver(function (entries) {
      header.classList.toggle('hero-over', entries[0].isIntersecting);
    }, { threshold: 0.05 });
    heroObs.observe(hero);
  }

  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // Mobile nav
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || typeof gsap === 'undefined') { return; }

  gsap.registerPlugin(ScrollTrigger);

  function st(el, overrides) {
    return Object.assign({ trigger: el, start: 'top 88%', toggleActions: 'play none none none' }, overrides || {});
  }

  // ── HERO ENTRANCE ────────────────────────────────────────
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('.hero-bg',        { scale: 1.08, duration: 1.8, ease: 'power2.out' }, 0)
    .from('.hero-hl-white',  { opacity: 0, y: 36, duration: 1.1 }, 0.2)
    .from('.hero-hl-gold',   { opacity: 0, y: 36, duration: 1.1 }, 0.38)
    .from('.hero-divider',   { scaleX: 0, transformOrigin: 'left', duration: 0.7, ease: 'power2.out' }, 0.65)
    .from('.hero-sub',       { opacity: 0, y: 20, duration: 0.9 }, 0.72)
    .from('.hero-ctas .btn', { opacity: 0, y: 16, duration: 0.7, stagger: 0.12 }, 0.88)
    .from('.hero-proof',     { opacity: 0, y: 12, duration: 0.7 }, 1.05);

  // Hero background parallax
  var heroBg = document.getElementById('hero-bg');
  if (heroBg) {
    gsap.to(heroBg, {
      y: '14%', ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
    });
  }

  // ── STANDALONE REVEALS ([data-reveal] but not in stagger groups) ──
  var staggerSelectors = '.service-card, .offer-item, .bonus-item';
  document.querySelectorAll('[data-reveal]').forEach(function (el) {
    if (el.matches(staggerSelectors)) { return; }
    gsap.from(el, { opacity: 0, y: 28, duration: 0.85, ease: 'power3.out', scrollTrigger: st(el) });
  });

  // ── STAGGER GROUPS ───────────────────────────────────────
  var serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length) {
    gsap.from(serviceCards, {
      opacity: 0, y: 28, duration: 0.8, ease: 'power3.out', stagger: 0.13,
      scrollTrigger: st(serviceCards[0])
    });
  }

  var offerItems = document.querySelectorAll('.offer-item');
  if (offerItems.length) {
    gsap.from(offerItems, {
      opacity: 0, y: 24, duration: 0.7, ease: 'power2.out', stagger: 0.08,
      scrollTrigger: st(offerItems[0], { start: 'top 85%' })
    });
  }

  var bonusItems = document.querySelectorAll('.bonus-item');
  if (bonusItems.length) {
    gsap.from(bonusItems, {
      opacity: 0, y: 20, duration: 0.65, ease: 'power2.out', stagger: 0.08,
      scrollTrigger: st(bonusItems[0])
    });
  }

  // ── CTA PARALLAX ─────────────────────────────────────────
  var ctaBg = document.getElementById('cta-bg');
  if (ctaBg) {
    gsap.fromTo(ctaBg, { y: '-12%' }, {
      y: '12%', ease: 'none',
      scrollTrigger: { trigger: '.cta-dark', start: 'top bottom', end: 'bottom top', scrub: 1.4 }
    });
  }

  // ── ABOUT PHOTO PARALLAX ─────────────────────────────────
  var aboutPhoto = document.querySelector('.about-photo');
  if (aboutPhoto) {
    gsap.fromTo(aboutPhoto, { y: '-5%' }, {
      y: '5%', ease: 'none',
      scrollTrigger: { trigger: '.about-split', start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  }

})();
