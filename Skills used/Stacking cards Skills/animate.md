# Animate — Stacking Card Scroll Effect (Production-Ready)

**Source:** brandappart.com (original reference) + CraftLab. portfolio (final tuned implementation)
**Effect:** Scroll-pinned cards that stack, scale, and rotate on scroll using GSAP ScrollTrigger
**Status:** ✅ Fully working — zoom-stable, responsive, mobile-tested, reverse-scroll safe

---

## Key Lessons Learned

1. **Never add `transform: translateY(-50%)` in CSS** — GSAP reads it as the base and double-applies `yPercent: -50`, pushing cards off-screen above.
2. **Always set initial positions in JS** (before `ScrollTrigger.create`) so cards are visible before the user scrolls.
3. **Always use a function for `end`** (`end: () => '...'`) + `invalidateOnRefresh: true` — otherwise zoom/resize breaks the pin.
4. **Split heading and cards into two sections** with the same background — use `margin-top: -Xpx` on the cards section to close the gap between them. Avoids the absolute-positioning overlap problem.
5. **Remove static z-index from HTML** — let GSAP manage z-index entirely in `onUpdate` to ensure the active card is always on top.
6. **Last card stays visible** — add an `isLast` check so the last card never exits upward, avoiding an empty container at the end.
7. **Mobile: use `pinType: 'transform'`** — `position: fixed` (GSAP default) can mis-fire on real mobile Chrome. Set `ScrollTrigger.config({ pinType: 'transform' })` **at the very top of your script**, before ANY ScrollTrigger instance is created. Setting it inside a function or mid-script means existing instances don't inherit it.
8. **Mobile: skip `rotationX`** — `perspective: 1200px` + `rotateX(35deg)` on a small viewport makes cards appear as a flat horizontal strip at the bottom of the screen. Use a `useTilt` flag to skip the tilt on mobile (≤600px) and just slide cards up instead.
9. **Mobile: past cards use `yPercent: -200`, not `-250`**
10. **Always refresh ScrollTrigger on tab-switch and bfcache restore** — listen for `visibilitychange` (tab focus) and `pageshow` with `e.persisted` (back/forward cache). Without this, GSAP pin positions go stale when the user leaves the page and returns. Add both listeners at the very top of the script alongside the `pinType` config. — when scrolling back up, cards jump from the "past" position to the "active exit" position. On desktop the jump is hidden by `rotationX`. On mobile (no tilt), use `-200` for past cards to match the active-exit endpoint exactly — zero jump on reverse scroll.

---

## HTML Structure

```html
<!-- HEADING — standalone section, same background as cards -->
<section class="system-heading" id="system">
  <div class="container">
    <div class="system__header">
      <h2>Section Heading</h2>
      <p class="system__sub">Supporting subtitle text.</p>
    </div>
  </div>
</section>

<!-- CARDS — separate section, same background makes it seamless -->
<section class="system-cards">
  <div class="sticky-cards">

    <div class="sticky-card" data-stack-card style="--c:#FF6A00;">
      <span class="card-num">(01)</span>
      <div class="card-top">
        <h3 class="card-title">Card One Heading</h3>
        <p class="card-desc">Short description text here.</p>
      </div>
      <div class="card-bottom">
        <blockquote class="card-quote">
          "Quote text."
          <cite>— Name, Role</cite>
        </blockquote>
        <div class="card-tags">
          <span class="tag">Tag One</span>
          <span class="tag">Tag Two</span>
        </div>
      </div>
    </div>

    <div class="sticky-card" data-stack-card style="--c:#0B0B0E;">
      <!-- Card 02 content -->
    </div>

    <div class="sticky-card" data-stack-card style="--c:#1A1A1A;">
      <!-- Card 03 content -->
    </div>

    <!-- Last card: add sticky-card--light for dark text on light bg -->
    <div class="sticky-card sticky-card--light" data-stack-card style="--c:#D6A14A;">
      <!-- Card 04 content -->
    </div>

  </div><!-- /sticky-cards -->
</section><!-- /system-cards -->
```

**Critical:** Do NOT put static `z-index` values on `.sticky-card` elements in HTML. GSAP manages z-index dynamically.

---

## CSS

```css
/* ── Two-section structure ── */
.system-heading {
  background: var(--white);   /* same as cards bg */
  padding: 80px 0 0;          /* bottom 0 — gap controlled by margin-top on cards */
}
.system-cards {
  background: var(--white);
  padding: 0;
  margin-top: -160px;         /* pull cards up toward heading — adjust to taste */
}
.system__header { max-width: 900px; margin: 0 auto; text-align: center; }
.system__header h2 { font-size: clamp(36px, 6vw, 88px); font-weight: 900; line-height: 0.92; }
.system__sub { font-size: 17px; line-height: 1.7; max-width: 62ch; margin: 0 auto; }

/* ── Pin container ── */
.sticky-cards {
  position: relative;
  height: 100vh;
  max-width: 1064px;
  margin: 0 auto;
  padding: 0 48px;
  perspective: 1200px;        /* enables rotationX 3D tilt on desktop */
  box-sizing: border-box;
  /* ⚠️ Do NOT add overflow:hidden — it clips the tilt exit on desktop */
}

/* ── Individual cards ── */
.sticky-card {
  position: absolute;
  top: 50%;                   /* GSAP sets yPercent: -50 to center — no CSS transform here */
  left: 48px;
  right: 48px;
  aspect-ratio: 1000 / 540;
  border-radius: 16px;
  background: var(--c, #FF6A00);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.4em 2.8em;
  overflow: hidden;
  transform-origin: center top; /* rotation pivots from top edge */
  will-change: transform;
  /* ⚠️ NO transform: translateY(-50%) here — GSAP handles centering */
}
.sticky-card--light { color: #0B0B0E; }

.card-num { position: absolute; top: 2.4em; right: 2.8em; font-size: 1em; font-weight: 700; letter-spacing: 0.14em; opacity: 0.38; }
.card-top { max-width: 52%; }
.card-title { font-size: clamp(18px, 2.6em, 42px); font-weight: 900; line-height: 0.95; text-transform: uppercase; margin-bottom: 0.6em; }
.card-desc { font-size: 0.86em; line-height: 1.6; opacity: 0.65; max-width: 44ch; }
.card-bottom { display: flex; justify-content: space-between; align-items: flex-end; gap: 2em; }
.card-quote { font-size: 0.78em; font-style: italic; line-height: 1.5; opacity: 0.72; max-width: 30%; margin: 0; border: none; }
.card-quote cite { display: block; margin-top: 0.6em; font-style: normal; font-weight: 700; opacity: 0.65; font-size: 0.88em; }
.card-tags { display: flex; flex-wrap: wrap; gap: 0.4em; justify-content: flex-end; max-width: 46%; }
.tag { font-size: 0.68em; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 0.38em 0.8em; border-radius: 99px; background: rgba(255,255,255,0.15); white-space: nowrap; }
.sticky-card--light .tag { background: rgba(0,0,0,0.12); }

/* ── Tablet ≤900px — GSAP active, tighten spacing ── */
@media (max-width: 900px) {
  .system-heading { padding: 64px 0 8px; }
  .system-cards   { padding: 0; margin-top: -60px; }
}

/* ── Mobile ≤600px — GSAP active, narrow card layout ── */
@media (max-width: 600px) {
  .system-heading { padding: 48px 0 0; }
  .system-cards   { padding: 0; margin-top: -16px; }
  /* Remove horizontal padding from container; cards handle their own inset */
  .sticky-cards   { padding: 0; }
  /* Narrow inset + auto aspect-ratio so card doesn't flatten at 350px width */
  .sticky-card    { left: 12px; right: 12px; aspect-ratio: auto; min-height: 360px;
                    padding: 1.5em 1.4em; border-radius: 12px; font-size: 14px; }
  .card-top       { max-width: 100%; }
  .card-bottom    { flex-direction: column; align-items: flex-start; gap: 1em; }
  .card-quote     { max-width: 100%; font-size: 12px; }
  .card-tags      { max-width: 100%; justify-content: flex-start; }
  .card-title     { font-size: clamp(17px, 5.2vw, 22px); }
  .card-desc      { font-size: 13px; }
  .card-num       { font-size: 12px; }
}
```

---

## JavaScript (GSAP + ScrollTrigger)

**⚠️ CRITICAL — place this block at the very top of your script, before any other code:**

```js
// Must run before ANY ScrollTrigger instance is created.
// pinType:'transform' makes mobile pinning reliable on real Chrome/Safari.
if (typeof ScrollTrigger !== 'undefined' && window.innerWidth <= 600) {
  ScrollTrigger.config({ pinType: 'transform' });
}

// Stale-state fix: when a tab regains focus or page restores from bfcache,
// GSAP pin measurements are stale and the scrub tween may have missed frames.
// - lagSmoothing(0) prevents GSAP catching up on hidden time
// - double rAF waits for the browser to settle layout before measuring
if (typeof ScrollTrigger !== 'undefined') {
  function gsapTabRefresh() {
    gsap.ticker.lagSmoothing(0);
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        ScrollTrigger.refresh();
        gsap.ticker.lagSmoothing(500, 33); // restore default
      });
    });
  }
  window.addEventListener('pageshow', function(e) {
    if (e.persisted) gsapTabRefresh();
  });
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) gsapTabRefresh();
  });
}
```

**Then the carousel function:**

```js
(function initSvcCarousel() {
  // Runs on ALL screen sizes — CSS adjusts card size/inset per breakpoint
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  var container = document.querySelector('.sticky-cards');
  if (!container) return;
  var cards = Array.from(container.querySelectorAll('[data-stack-card]'));
  if (!cards.length) return;

  var totalCards    = cards.length;
  var segmentSize   = 1 / totalCards;
  var cardYOffset   = 9;    // yPercent peek gap between waiting cards
  var cardScaleStep = 0.05; // scale shrink per depth level

  // Desktop gets the full 3D tilt exit; mobile skips it to avoid the
  // "flat card lying on its side" rendering bug caused by perspective + rotationX
  // on small viewports.
  var useTilt = window.innerWidth > 600;

  // ── CRITICAL: Set initial positions before ScrollTrigger fires ──
  cards.forEach(function(card, i) {
    if (i === 0) {
      gsap.set(card, { yPercent: -50, rotationX: 0, scale: 1, zIndex: totalCards });
    } else {
      gsap.set(card, {
        yPercent : -50 + i * cardYOffset,
        rotationX: 0,
        scale    : 1 - i * cardScaleStep,
        zIndex   : totalCards - i,
      });
    }
  });

  ScrollTrigger.create({
    trigger          : container,
    start            : 'top top',
    end              : () => '+=' + (window.innerHeight * totalCards * 0.6) + 'px',
    pin              : true,
    pinSpacing       : true,
    scrub            : 0.5,
    invalidateOnRefresh: true,

    onRefresh: function() {
      // Re-evaluate tilt flag on resize/zoom
      useTilt = window.innerWidth > 600;
    },

    onUpdate: function (self) {
      var progress    = self.progress;
      var activeIndex = Math.min(Math.floor(progress / segmentSize), totalCards - 1);
      var segProgress = (progress - activeIndex * segmentSize) / segmentSize;

      cards.forEach(function (card, i) {

        if (i < activeIndex) {
          // PAST — out of view above.
          // Desktop: -250 ensures the rotationX-tilted card is fully off-screen.
          // Mobile:  -200 matches the active-exit endpoint so there is zero yPercent
          //          jump when scrolling back up (reverse-scroll safety).
          gsap.set(card, {
            yPercent : useTilt ? -250 : -200,
            rotationX: useTilt ? 35 : 0,
            zIndex   : 0,
          });

        } else if (i === activeIndex) {
          // ACTIVE — on top; exits upward as next card rises.
          // Last card never exits — stays visible at end of scroll.
          var isLast = (i === totalCards - 1);
          gsap.set(card, {
            yPercent : gsap.utils.interpolate(-50, isLast ? -50 : -200, segProgress),
            rotationX: useTilt ? gsap.utils.interpolate(0, isLast ? 0 : 35, segProgress) : 0,
            scale    : 1,
            zIndex   : totalCards,
          });

        } else {
          // WAITING — stacked below active card, peeking with depth offset
          var behindIndex    = i - activeIndex;
          var currentYOffset = (behindIndex - segProgress) * cardYOffset;
          var currentScale   = 1 - (behindIndex - segProgress) * cardScaleStep;
          gsap.set(card, {
            yPercent : -50 + currentYOffset,
            rotationX: 0,
            scale    : currentScale,
            zIndex   : totalCards - behindIndex,
          });
        }
      });
    },
  });
}());
```

---

## GSAP Logic Reference

```
progress 0 ──────────────────────────────── 1
         |  card 1  |  card 2  |  card 3  |  card 4  |
              seg 0      seg 1      seg 2      seg 3
```

| Variable | Formula | Controls |
|---|---|---|
| `segmentSize` | `1 / totalCards` | Each card's scroll slot width |
| `activeIndex` | `floor(progress / segmentSize)` | Which card is on screen |
| `segProgress` | `(progress − activeIndex × segmentSize) / segmentSize` | 0→1 within this card's slot |
| `behindIndex` | `i − activeIndex` | How many positions below active |
| `currentScale` | `1 − behindIndex × cardScaleStep` | Depth scaling |
| `currentYOffset` | `behindIndex × cardYOffset` | Vertical peek gap |

### Card States

| State | `yPercent` | `rotationX` | `scale` | `zIndex` |
|---|---|---|---|---|
| Past — desktop | `-250` | `35°` | — | `0` |
| Past — mobile | `-200` | `0°` | — | `0` |
| Active | `-50` → `-200` | `0°` → `35°` (desktop) / `0°` (mobile) | `1` | `totalCards` |
| Active (last card) | stays `-50` | stays `0°` | `1` | `totalCards` |
| Waiting (below) | `-50 + offset` | `0°` | `1 − depth × 0.05` | `totalCards − behindIndex` |

---

## Tuning Guide

| Goal | Change |
|---|---|
| More visible depth peek | Increase `cardYOffset` (try `12–15`) |
| More dramatic scale difference | Increase `cardScaleStep` (try `0.06–0.08`) |
| Slower scroll per card | Increase end multiplier: `totalCards * 0.9` |
| Snappier feel | Lower `scrub` to `0.3` |
| Move heading closer to cards | Increase negative `margin-top` on `.system-cards` |
| Gap still too large | Reduce `80px 0 0` top padding on `.system-heading` |

---

## Common Bugs & Fixes

| Bug | Cause | Fix |
|---|---|---|
| Cards invisible on load | No initial positions set | Add `gsap.set()` loop before `ScrollTrigger.create()` |
| Cards invisible after zoom | `end` hardcoded at init time | Use `end: () => '...'` + `invalidateOnRefresh: true` |
| Animation starts with last card on top | Static z-index in HTML | Remove all z-index from HTML; let GSAP manage via `onUpdate` |
| Large empty gap after last card | Last card exits like others | Add `isLast` check — last card stays at `yPercent: -50` |
| Header overlaps cards | Header absolute inside sticky-cards | Keep header in its own section above; use negative margin-top to close gap |
| Cards double-shifted (off screen above) | CSS `transform: translateY(-50%)` + GSAP `yPercent: -50` | Remove CSS transform entirely; GSAP handles all positioning |
| Cards too flat on mobile | Default `aspect-ratio: 1000/540` at 350px width = 189px tall | Override to `aspect-ratio: auto; min-height: 360px` at ≤600px |
| Cards too narrow on mobile | Default `left: 48px; right: 48px` at 375px = 279px card | Override to `left: 12px; right: 12px; sticky-cards padding: 0` on mobile |
| Cards don't pin on real mobile Chrome | `position: fixed` mis-fires inside mobile scroll containers | Add `ScrollTrigger.config({ pinType: 'transform' })` at the **very top** of the script before any ScrollTrigger instance is created |
| Card appears as flat horizontal strip on mobile | `perspective: 1200px` + `rotationX: 35` on small viewport makes rotated card render as flat strip | Use `useTilt = window.innerWidth > 600` flag; skip `rotationX` on mobile entirely |
| Cards snap/jump when scrolling back up | Past cards at `yPercent: -250` jump to active-exit at `yPercent: -200` on reverse scroll | On mobile, set past cards to `yPercent: -200` (matches active exit). Desktop can use `-250` — `rotationX` hides the jump |
| `pinType: 'transform'` only applies to some ScrollTriggers | Config set mid-script after some instances already created | Always set `ScrollTrigger.config()` at the absolute top of the script |
| Stacking breaks after switching tabs or navigating back | Browser restores page from bfcache; GSAP measurements stale + scrub tween missed frames | Call `gsap.ticker.lagSmoothing(0)` then `ScrollTrigger.refresh()` inside double `requestAnimationFrame` on both `pageshow` (`e.persisted`) and `visibilitychange`. Plain `ScrollTrigger.refresh()` without the delay runs before the browser settles and measures wrong values |
