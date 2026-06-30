(function () {
  'use strict';

  // Header scroll shadow
  var header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 48);
    }, { passive: true });
  }

  // Hero magazine: hide site header while hero is visible
  var heroMag = document.querySelector('.hero-magazine');
  if (heroMag && header) {
    var heroObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        header.classList.toggle('hero-over', e.isIntersecting);
      });
    }, { threshold: 0.1 });
    heroObs.observe(heroMag);
  }

  // Fit RADIANCE wordmark to viewport width
  function fitWordmark() {
    var wm = document.getElementById('hero-wordmark');
    if (!wm) { return; }
    var target = window.innerWidth * 0.88;
    // temporarily shrink to max-content so we measure text, not the stretched container
    wm.style.right = 'auto';
    wm.style.width = 'max-content';
    var lo = 4, hi = 50, mid;
    for (var i = 0; i < 32; i++) {
      mid = (lo + hi) / 2;
      wm.style.fontSize = mid + 'vw';
      var w = wm.getBoundingClientRect().width;
      if (w < target) { lo = mid; } else { hi = mid; }
      if (hi - lo < 0.02) { break; }
    }
    wm.style.fontSize = lo + 'vw';
    // restore centered layout
    wm.style.right = '0';
    wm.style.width = '';
  }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitWordmark);
  } else {
    window.addEventListener('load', fitWordmark);
  }
  window.addEventListener('resize', fitWordmark);

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
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

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answer = btn.nextElementSibling;
      btn.setAttribute('aria-expanded', String(!expanded));
      answer.hidden = expanded;
    });
  });

  // Form submit
  var form = document.querySelector('.cta-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = 'Request Received'; btn.disabled = true; }
    });
  }

  // GSAP animations
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || typeof gsap === 'undefined') { return; }

  gsap.registerPlugin(ScrollTrigger);

  // Helper: trigger when element enters viewport
  function st(el, extra) {
    return Object.assign({
      trigger: el,
      start: 'top 88%',
      toggleActions: 'play none none none'
    }, extra || {});
  }

  // ── HERO MAGAZINE: entrance timeline ─────────────────────────────────────────
  if (document.querySelector('.hero-magazine')) {
    var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
      .from('.hero-mag-bg', { scale: 1.12, duration: 1.6, ease: 'power2.out' }, 0)
      .from('.hero-mag-scrim', { opacity: 0, duration: 1.4 }, 0)
      .from('#hero-wordmark', { opacity: 0, y: 40, duration: 1.3 }, 0.15)
      .from('.hero-mag-woman', { opacity: 0, y: 60, duration: 1.4, ease: 'power2.out' }, 0.35)
      .from('.hero-hl', { opacity: 0, y: 26, duration: 0.9, stagger: 0.12 }, 0.7)
      .from('.hero-toc .toc-item', { opacity: 0, x: -20, duration: 0.8, stagger: 0.1 }, 0.85)
      .from('.hero-vert-left, .hero-vert-right', { opacity: 0, duration: 1 }, 0.9)
      .from('.hero-right-caption-wrap', { opacity: 0, x: 18, duration: 0.8 }, 1.0)
      .from('.hero-cta-circle', { opacity: 0, scale: 0.8, duration: 0.8, ease: 'back.out(1.6)' }, 1.1)
      .from('.hero-bottombar span', { opacity: 0, y: 12, duration: 0.8, stagger: 0.1 }, 1.0);

    // Parallax: background drifts as the hero scrolls out
    var heroBg = document.getElementById('hero-mag-bg');
    if (heroBg) {
      gsap.to(heroBg, {
        y: '12%',
        ease: 'none',
        scrollTrigger: { trigger: '.hero-magazine', start: 'top top', end: 'bottom top', scrub: 1 }
      });
    }
    // Wordmark + woman drift at different rates for depth
    gsap.to('#hero-wordmark', {
      y: '-18%', ease: 'none',
      scrollTrigger: { trigger: '.hero-magazine', start: 'top top', end: 'bottom top', scrub: 1 }
    });
    gsap.to('.hero-mag-woman', {
      y: '6%', ease: 'none',
      scrollTrigger: { trigger: '.hero-magazine', start: 'top top', end: 'bottom top', scrub: 1.2 }
    });
  }

  // ── INTRO ────────────────────────────────────────────────────────────────────
  var introHeadline = document.querySelector('.intro-headline');
  if (introHeadline) {
    gsap.from(introHeadline, { opacity: 0, y: 32, duration: 0.9, ease: 'power3.out', scrollTrigger: st(introHeadline) });
  }
  var introBody = document.querySelector('.intro-body');
  if (introBody) {
    gsap.from(introBody, { opacity: 0, y: 20, duration: 0.8, ease: 'power2.out', delay: 0.12, scrollTrigger: st(introBody) });
  }

  // Stat counters
  document.querySelectorAll('.stat-num').forEach(function (el) {
    var raw = el.textContent.trim();
    var suffix = raw.replace(/[\d.]/g, '');
    var num = parseFloat(raw);
    if (isNaN(num)) { return; }
    gsap.from({ v: 0 }, {
      v: num,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: st(el),
      onUpdate: function () {
        el.textContent = (Number.isInteger(num)
          ? Math.round(this.targets()[0].v)
          : this.targets()[0].v.toFixed(0)) + suffix;
      }
    });
  });

  // ── TREATMENTS ───────────────────────────────────────────────────────────────
  var treatmentHeader = document.querySelector('.treatments .section-header');
  if (treatmentHeader) {
    gsap.from(treatmentHeader, { opacity: 0, y: 28, duration: 0.9, ease: 'power3.out', scrollTrigger: st(treatmentHeader) });
  }
  var treatmentCards = document.querySelectorAll('.treatment-card');
  if (treatmentCards.length) {
    gsap.from(treatmentCards, {
      opacity: 0, y: 36, duration: 0.8, ease: 'power3.out',
      stagger: 0.1,
      scrollTrigger: st(treatmentCards[0])
    });
  }

  // ── DREAM LIST ───────────────────────────────────────────────────────────────
  var dreamLeft = document.querySelector('.dream-left');
  if (dreamLeft) {
    gsap.from(dreamLeft, { opacity: 0, y: 28, duration: 0.9, ease: 'power3.out', scrollTrigger: st(dreamLeft) });
  }
  var dreamItems = document.querySelectorAll('.dream-list li');
  if (dreamItems.length) {
    gsap.from(dreamItems, {
      opacity: 0, x: 20, duration: 0.7, ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: st(dreamItems[0])
    });
  }
  var dreamClose = document.querySelector('.dream-close');
  if (dreamClose) {
    gsap.from(dreamClose, { opacity: 0, y: 16, duration: 0.7, ease: 'power2.out', delay: 0.5, scrollTrigger: st(dreamClose) });
  }

  // ── PROGRAM FEATURE: parallax on image ──────────────────────────────────────
  var pfImg = document.querySelector('.program-feature-img');
  if (pfImg) {
    gsap.fromTo(pfImg,
      { y: '-6%' },
      { y: '6%', ease: 'none', scrollTrigger: { trigger: '.program-feature', start: 'top bottom', end: 'bottom top', scrub: 1 } }
    );
  }
  var pfText = document.querySelector('.program-feature-text');
  if (pfText) {
    gsap.from(pfText, { opacity: 0, x: 32, duration: 1, ease: 'power3.out', scrollTrigger: st(pfText) });
  }

  // ── PROGRAM ITEMS ─────────────────────────────────────────────────────────────
  var programHeader = document.querySelector('.program .section-header');
  if (programHeader) {
    gsap.from(programHeader, { opacity: 0, y: 28, duration: 0.9, ease: 'power3.out', scrollTrigger: st(programHeader) });
  }
  var programItems = document.querySelectorAll('.program-item');
  if (programItems.length) {
    gsap.from(programItems, {
      opacity: 0, x: -18, duration: 0.75, ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: st(programItems[0])
    });
  }
  var programAside = document.querySelector('.program-aside');
  if (programAside) {
    gsap.from(programAside, { opacity: 0, y: 28, duration: 0.9, ease: 'power3.out', delay: 0.2, scrollTrigger: st(programAside) });
  }

  // ── BONUSES ──────────────────────────────────────────────────────────────────
  var bonusHeader = document.querySelector('.bonuses .section-header');
  if (bonusHeader) {
    gsap.from(bonusHeader, { opacity: 0, y: 28, duration: 0.9, ease: 'power3.out', scrollTrigger: st(bonusHeader) });
  }
  var bonusItems = document.querySelectorAll('.bonus-item');
  if (bonusItems.length) {
    gsap.from(bonusItems, {
      opacity: 0, y: 32, duration: 0.75, ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: st(bonusItems[0])
    });
  }

  // ── TESTIMONIALS ─────────────────────────────────────────────────────────────
  var testimonialFeatured = document.querySelector('.testimonial-featured');
  if (testimonialFeatured) {
    gsap.from(testimonialFeatured, { opacity: 0, y: 24, duration: 1, ease: 'power3.out', scrollTrigger: st(testimonialFeatured) });
  }
  var testimonialSecondary = document.querySelectorAll('.testimonial-secondary');
  if (testimonialSecondary.length) {
    gsap.from(testimonialSecondary, {
      opacity: 0, y: 24, duration: 0.8, ease: 'power2.out',
      stagger: 0.15,
      scrollTrigger: st(testimonialSecondary[0])
    });
  }

  // ── PROCESS ──────────────────────────────────────────────────────────────────
  var processHeader = document.querySelector('.process .section-header');
  if (processHeader) {
    gsap.from(processHeader, { opacity: 0, y: 28, duration: 0.9, ease: 'power3.out', scrollTrigger: st(processHeader) });
  }
  var processSteps = document.querySelectorAll('.process-step');
  if (processSteps.length) {
    gsap.from(processSteps, {
      opacity: 0, y: 28, duration: 0.75, ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: st(processSteps[0])
    });
  }

  // ── GUARANTEE ────────────────────────────────────────────────────────────────
  var guaranteeLeft = document.querySelector('.guarantee-left');
  if (guaranteeLeft) {
    gsap.from(guaranteeLeft, { opacity: 0, y: 28, duration: 0.9, ease: 'power3.out', scrollTrigger: st(guaranteeLeft) });
  }
  var guaranteeItems = document.querySelectorAll('.guarantee-item');
  if (guaranteeItems.length) {
    gsap.from(guaranteeItems, {
      opacity: 0, x: 24, duration: 0.75, ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: st(guaranteeItems[0])
    });
  }

  // ── FAQ ──────────────────────────────────────────────────────────────────────
  var faqHeader = document.querySelector('.faq-header');
  if (faqHeader) {
    gsap.from(faqHeader, { opacity: 0, y: 24, duration: 0.9, ease: 'power3.out', scrollTrigger: st(faqHeader) });
  }
  var faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length) {
    gsap.from(faqItems, {
      opacity: 0, y: 16, duration: 0.65, ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: st(faqItems[0])
    });
  }

  // ── URGENCY: parallax background ─────────────────────────────────────────────
  var urgencyBg = document.querySelector('.urgency-bg');
  if (urgencyBg) {
    gsap.fromTo(urgencyBg,
      { y: '-15%' },
      { y: '15%', ease: 'none', scrollTrigger: { trigger: '.urgency', start: 'top bottom', end: 'bottom top', scrub: 1.5 } }
    );
  }
  var urgencyContent = document.querySelector('.urgency-content');
  if (urgencyContent) {
    gsap.from(urgencyContent, { opacity: 0, y: 28, duration: 1, ease: 'power3.out', scrollTrigger: st(urgencyContent) });
  }

  // ── CTA ──────────────────────────────────────────────────────────────────────
  var ctaInner = document.querySelector('.cta-inner');
  if (ctaInner) {
    gsap.from(ctaInner, { opacity: 0, y: 32, duration: 1, ease: 'power3.out', scrollTrigger: st(ctaInner) });
  }

})();
