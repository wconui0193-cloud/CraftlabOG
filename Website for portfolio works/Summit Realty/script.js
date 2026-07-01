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


  // ── PROPERTIES CAROUSEL ──────────────────────────────────
  var propTrack = document.getElementById('prop-track');
  var propPrev = document.getElementById('prop-prev');
  var propNext = document.getElementById('prop-next');

  if (propTrack && propPrev && propNext) {
    var getScrollAmount = function () {
      var card = propTrack.querySelector('.prop-card');
      if (!card) { return 400; }
      return (card.offsetWidth + 24) * 3;
    };

    propPrev.addEventListener('click', function () {
      propTrack.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });
    propNext.addEventListener('click', function () {
      propTrack.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    var isDragging = false, startX, scrollStart;
    propTrack.addEventListener('mousedown', function (e) {
      isDragging = true;
      startX = e.pageX;
      scrollStart = propTrack.scrollLeft;
      propTrack.classList.add('grabbing');
    });
    window.addEventListener('mousemove', function (e) {
      if (!isDragging) { return; }
      propTrack.scrollLeft = scrollStart - (e.pageX - startX);
    });
    window.addEventListener('mouseup', function () {
      isDragging = false;
      propTrack.classList.remove('grabbing');
    });
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || typeof gsap === 'undefined') { return; }

  gsap.registerPlugin(ScrollTrigger);

  // ── STORY CAROUSEL (horizontal scroll) ───────────────────
  var storyTrack        = document.querySelector('.story-track');
  var storyProgressFill = document.querySelector('.story-progress-fill');
  if (storyTrack) {
    var storySlides  = storyTrack.querySelectorAll('.story-slide');
    var slideCount   = storySlides.length;
    var storyDone    = false;
    gsap.to(storyTrack, {
      x: function () { return -(slideCount - 1) * window.innerWidth; },
      ease: 'none',
      scrollTrigger: {
        trigger: '.story-section',
        start: 'top top',
        end: function () { return '+=' + (slideCount - 1) * window.innerWidth; },
        scrub: 0.6,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / (slideCount - 1),
          duration: { min: 0.3, max: 0.6 },
          delay: 0.05,
          ease: 'power2.inOut'
        },
        onUpdate: function (self) {
          if (storyProgressFill) {
            storyProgressFill.style.transform = 'scaleX(' + self.progress + ')';
          }
        },
        onLeave: function () {
          if (storyDone) { return; }
          storyDone = true;
          var next = document.querySelector('.ticker-belt') || document.querySelector('.properties');
          if (next) {
            var top = next.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: top, behavior: 'smooth' });
          }
        },
        onEnterBack: function () { storyDone = false; }
      }
    });

    // Give pin-spacer the story section background so no white flash
    ScrollTrigger.addEventListener('refresh', function () {
      var spacer = document.querySelector('.pin-spacer');
      if (spacer && spacer.contains(document.querySelector('.story-section'))) {
        spacer.style.background = 'var(--navy-deep)';
      }
    });
  }

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


})();
