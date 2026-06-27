# Stacking Cards Animation — "What We Ship" Section

**Source:** brandappart.com — "What we ship / Our ways to move fast" section
**Effect:** Scroll-pinned stacking rectangles — each card slides up from below while the previous one scales back to reveal depth.
**Complexity:** Medium
**Libraries needed:** GSAP + ScrollTrigger

---

## How It Works

The container is **pinned to the viewport** for the total scroll distance of all cards combined. As the user scrolls, each card slides up from `y: 100%` to `y: 0`. When a new card arrives, the previous card subtly scales down (`scale: 0.95` per card behind) and shifts up slightly, creating the "stacked deck" illusion.

**Analogy:** Think of a deck of playing cards being lifted one by one from the bottom. The new card comes from below; the old cards stack upward.

---

## HTML Structure

```html
<section class="services-section">
  <div class="services-section__header">
    <h2 class="services-section__label"><!-- REPLACE: Section label --></h2>
    <h2 class="services-section__title"><!-- REPLACE: Section headline --></h2>
  </div>

  <div class="services-stack" data-stack>

    <!-- ============================================================
         CARD 1 — Replace all [PLACEHOLDER] values below
    ============================================================ -->
    <div class="services-card" data-stack-card style="--card-color: #3d2fa9;">
      <div class="services-card__number"><!-- REPLACE: (01) --></div>

      <div class="services-card__top">
        <h3 class="services-card__title"><!-- REPLACE: Card heading --></h3>
        <p class="services-card__desc"><!-- REPLACE: Card description paragraph --></p>
      </div>

      <div class="services-card__bottom">
        <div class="services-card__quote">
          <blockquote class="services-card__quote-text"><!-- REPLACE: Client testimonial --></blockquote>
          <div class="services-card__author">
            <img class="services-card__author-pic" src="PLACEHOLDER_AVATAR_1.jpg" alt="Author name" />
            <div>
              <div class="services-card__author-name"><!-- REPLACE: Author name --></div>
              <div class="services-card__author-role"><!-- REPLACE: Job title, Company --></div>
            </div>
          </div>
        </div>

        <div class="services-card__gallery">
          <img src="PLACEHOLDER_IMAGE_1A.jpg" alt="" class="services-card__gallery-img" />
          <img src="PLACEHOLDER_IMAGE_1B.jpg" alt="" class="services-card__gallery-img" />
          <img src="PLACEHOLDER_IMAGE_1C.jpg" alt="" class="services-card__gallery-img" />
        </div>
      </div>
    </div>

    <!-- ============================================================
         CARD 2 — Replace all [PLACEHOLDER] values below
    ============================================================ -->
    <div class="services-card" data-stack-card style="--card-color: #171412;">
      <div class="services-card__number"><!-- REPLACE: (02) --></div>

      <div class="services-card__top">
        <h3 class="services-card__title"><!-- REPLACE: Card heading --></h3>
        <p class="services-card__desc"><!-- REPLACE: Card description paragraph --></p>
      </div>

      <div class="services-card__bottom">
        <div class="services-card__quote">
          <blockquote class="services-card__quote-text"><!-- REPLACE: Client testimonial --></blockquote>
          <div class="services-card__author">
            <img class="services-card__author-pic" src="PLACEHOLDER_AVATAR_2.jpg" alt="Author name" />
            <div>
              <div class="services-card__author-name"><!-- REPLACE: Author name --></div>
              <div class="services-card__author-role"><!-- REPLACE: Job title, Company --></div>
            </div>
          </div>
        </div>

        <div class="services-card__gallery">
          <img src="PLACEHOLDER_IMAGE_2A.jpg" alt="" class="services-card__gallery-img" />
          <img src="PLACEHOLDER_IMAGE_2B.jpg" alt="" class="services-card__gallery-img" />
          <img src="PLACEHOLDER_IMAGE_2C.jpg" alt="" class="services-card__gallery-img" />
        </div>
      </div>
    </div>

    <!-- ============================================================
         CARD 3 — Replace all [PLACEHOLDER] values below
    ============================================================ -->
    <div class="services-card" data-stack-card style="--card-color: #f72;">
      <div class="services-card__number"><!-- REPLACE: (03) --></div>

      <div class="services-card__top">
        <h3 class="services-card__title"><!-- REPLACE: Card heading --></h3>
        <p class="services-card__desc"><!-- REPLACE: Card description paragraph --></p>
      </div>

      <div class="services-card__bottom">
        <div class="services-card__quote">
          <blockquote class="services-card__quote-text"><!-- REPLACE: Client testimonial --></blockquote>
          <div class="services-card__author">
            <img class="services-card__author-pic" src="PLACEHOLDER_AVATAR_3.jpg" alt="Author name" />
            <div>
              <div class="services-card__author-name"><!-- REPLACE: Author name --></div>
              <div class="services-card__author-role"><!-- REPLACE: Job title, Company --></div>
            </div>
          </div>
        </div>

        <div class="services-card__gallery">
          <img src="PLACEHOLDER_IMAGE_3A.jpg" alt="" class="services-card__gallery-img" />
          <img src="PLACEHOLDER_IMAGE_3B.jpg" alt="" class="services-card__gallery-img" />
          <img src="PLACEHOLDER_IMAGE_3C.jpg" alt="" class="services-card__gallery-img" />
        </div>
      </div>
    </div>

    <!-- ============================================================
         CARD 4 — Replace all [PLACEHOLDER] values below
    ============================================================ -->
    <div class="services-card" data-stack-card style="--card-color: #ffc765;">
      <div class="services-card__number"><!-- REPLACE: (04) --></div>

      <div class="services-card__top">
        <h3 class="services-card__title"><!-- REPLACE: Card heading --></h3>
        <p class="services-card__desc"><!-- REPLACE: Card description paragraph --></p>
      </div>

      <div class="services-card__bottom">
        <div class="services-card__quote">
          <blockquote class="services-card__quote-text"><!-- REPLACE: Client testimonial --></blockquote>
          <div class="services-card__author">
            <img class="services-card__author-pic" src="PLACEHOLDER_AVATAR_4.jpg" alt="Author name" />
            <div>
              <div class="services-card__author-name"><!-- REPLACE: Author name --></div>
              <div class="services-card__author-role"><!-- REPLACE: Job title, Company --></div>
            </div>
          </div>
        </div>

        <div class="services-card__gallery">
          <img src="PLACEHOLDER_IMAGE_4A.jpg" alt="" class="services-card__gallery-img" />
          <img src="PLACEHOLDER_IMAGE_4B.jpg" alt="" class="services-card__gallery-img" />
          <img src="PLACEHOLDER_IMAGE_4C.jpg" alt="" class="services-card__gallery-img" />
        </div>
      </div>
    </div>

  </div><!-- /services-stack -->
</section>
```

---

## CSS

```css
/* -----------------------------------------------
   Section wrapper
----------------------------------------------- */
.services-section {
  padding: 10em 1.25em;
}

.services-section__header {
  text-align: center;
  margin-bottom: 3em;
}

.services-section__label {
  /* Muted version of the heading — same font, lower opacity */
  font-family: 'Youth', Arial, sans-serif;
  font-size: 7em;
  font-weight: 700;
  line-height: 0.8;
  letter-spacing: -0.05em;
  opacity: 0.25;           /* REPLACE: adjust to taste */
  color: #171412;
  margin: 0;
}

.services-section__title {
  font-family: 'Youth', Arial, sans-serif;
  font-size: 7em;
  font-weight: 700;
  line-height: 0.8;
  letter-spacing: -0.05em;
  color: #171412;
  margin: 0;
}

/* -----------------------------------------------
   Stack container — height creates the scroll room
----------------------------------------------- */
.services-stack {
  /* JS will set --card-count from number of [data-stack-card] children */
  height: calc(var(--card-count, 4) * 100vh);
  position: relative;
  max-width: 63em;
  margin: 0 auto;
}

/* -----------------------------------------------
   Individual card
----------------------------------------------- */
.services-card {
  aspect-ratio: 1000 / 540;        /* Confirmed from source CSS */
  border-radius: 0.75em;            /* --border-radius */
  background-color: var(--card-color, #3d2fa9);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.5em;
  position: sticky;
  top: 5vh;                         /* offset from top so cards don't sit flush */
  overflow: hidden;

  /* Cards stack using z-index driven by JS */
  will-change: transform;
}

/* Card number — top right */
.services-card__number {
  position: absolute;
  top: 2.5em;
  right: 2.5em;
  font-size: 1.2em;
  opacity: 0.5;
}

/* Top content block */
.services-card__top {
  max-width: 55%;
}

.services-card__title {
  font-family: 'Youth', Arial, sans-serif;
  font-size: 2.8em;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.05em;
  margin: 0 0 0.75em 0;
}

.services-card__desc {
  font-size: 1em;
  line-height: 1.4;
  opacity: 0.6;
  max-width: 40em;
}

/* Bottom content — quote + gallery */
.services-card__bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2em;
}

.services-card__quote {
  max-width: 30%;
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.services-card__quote-text {
  font-size: 0.875em;
  line-height: 1.4;
  opacity: 0.75;
  margin: 0;
  padding: 0;
  border: none;
}

.services-card__author {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 0.8em;
}

.services-card__author-pic {
  width: 2.25em;
  height: 2.25em;
  border-radius: 50%;
  object-fit: cover;
}

.services-card__author-name {
  font-weight: 600;
  line-height: 1.2;
}

.services-card__author-role {
  opacity: 0.5;
  font-size: 0.875em;
  line-height: 1.2;
}

/* Gallery strip */
.services-card__gallery {
  display: flex;
  gap: 0.8em;
  align-items: flex-end;
  max-width: 65%;
}

.services-card__gallery-img {
  /* REPLACE: adjust sizing to match your images */
  height: 11em;
  width: auto;
  border-radius: 0.5em;
  object-fit: cover;
}

/* -----------------------------------------------
   Mobile: disable sticky stack, show linearly
----------------------------------------------- */
@media (max-width: 767px) {
  .services-stack {
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 1em;
  }

  .services-card {
    position: relative;
    top: auto;
    aspect-ratio: auto;
  }

  .services-card__top {
    max-width: 100%;
  }

  .services-card__bottom {
    flex-direction: column;
    align-items: flex-start;
  }

  .services-card__quote {
    max-width: 100%;
  }

  .services-card__gallery {
    max-width: 100%;
    overflow-x: auto;
  }
}
```

---

## JavaScript (GSAP ScrollTrigger)

```js
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function initStackingCards() {
  const stack = document.querySelector('[data-stack]')
  if (!stack) return

  const cards = [...stack.querySelectorAll('[data-stack-card]')]
  if (!cards.length) return

  // Tell CSS how many cards we have (drives the container height)
  stack.style.setProperty('--card-count', cards.length)

  // Each card gets its own scroll segment
  // Total scroll = cards.length × 100vh
  // Card N is active during scroll segment N

  cards.forEach((card, i) => {
    const isLast = i === cards.length - 1

    // --- Entrance: slide up from below ---
    gsap.fromTo(card,
      { yPercent: 100 },
      {
        yPercent: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: stack,
          start: `${i * (100 / cards.length)}% top`,   // start of this card's segment
          end: `${(i + 1) * (100 / cards.length)}% top`, // end of this card's segment
          scrub: true,
        }
      }
    )

    // --- Exit: scale down when next card arrives (all cards except last) ---
    if (!isLast) {
      // How much to scale: 0.97 for card above, then each one behind scales down further
      const scaleFactor = 1 - (0.03 * (i + 1))
      const yShift = -(i + 1) * 1.5  // shift up slightly in % to peek above

      gsap.to(card, {
        scale: scaleFactor,
        yPercent: yShift,
        ease: 'none',
        scrollTrigger: {
          trigger: stack,
          // This card starts receding when the NEXT card begins entering
          start: `${(i + 1) * (100 / cards.length)}% top`,
          end: `${(i + 2) * (100 / cards.length)}% top`,
          scrub: true,
        }
      })
    }

    // Set z-index so later cards appear on top
    card.style.zIndex = i + 1
  })
}

// Run on page load
document.addEventListener('DOMContentLoaded', initStackingCards)
```

---

## Simpler Alternative: CSS-Only (No GSAP)

If you want a no-JS version using only CSS scroll-driven animations (Chrome 115+):

```css
@supports (animation-timeline: scroll()) {

  .services-stack {
    height: auto;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .services-card {
    position: sticky;
    top: 5vh;

    animation: card-scale linear both;
    animation-timeline: view();
    animation-range: exit-crossing 0% exit-crossing 30%;
  }

  @keyframes card-scale {
    to {
      scale: 0.95;
    }
  }
}
```

**Note:** CSS scroll-driven animations don't support the full stacking entrance effect — only the scale-back on exit. Use the GSAP version for the full effect.

---

## Placeholder Replacement Checklist

When you're ready to fill in real content, replace every instance of:

| Placeholder | Replace with |
|---|---|
| `<!-- REPLACE: Section label -->` | First headline line ("What we ship.") |
| `<!-- REPLACE: Section headline -->` | Second headline line ("Our ways to move fast") |
| `<!-- REPLACE: (01) -->` | Card number, e.g. `(01)` |
| `<!-- REPLACE: Card heading -->` | Service name headline |
| `<!-- REPLACE: Card description paragraph -->` | 2–3 sentence service description |
| `<!-- REPLACE: Client testimonial -->` | Quote from a client |
| `<!-- REPLACE: Author name -->` | Client's name |
| `<!-- REPLACE: Job title, Company -->` | Client's role and company |
| `PLACEHOLDER_AVATAR_X.jpg` | Headshot photo of the quoted person |
| `PLACEHOLDER_IMAGE_XA/B/C.jpg` | 3 project preview images for this service |
| `--card-color: #3d2fa9` | Background color per card (one color per service) |

### Suggested card colors (from Brand Appart palette)

| Card | Color | Hex |
|---|---|---|
| 01 | Purple | `#3d2fa9` |
| 02 | Dark | `#171412` |
| 03 | Orange | `#ff7722` |
| 04 | Yellow | `#ffc765` |

---

## Notes

- The `aspect-ratio: 1000/540` on cards means they are widescreen rectangles (~16:9). On narrow viewports this becomes too short — drop `aspect-ratio` on mobile and let content define height.
- The sticky positioning is what makes the card "wait" at the top while the scroll continues. The parent height creates the scroll room.
- Cards must have `will-change: transform` for smooth GPU compositing during the scroll animation.
- The scale values (`0.97`, `0.94`, etc.) create the depth illusion. Start with `0.03` per card and adjust to taste.
