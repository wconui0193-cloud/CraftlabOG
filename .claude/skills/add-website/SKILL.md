# Add Website to Portfolio

When this skill is invoked, add a new real website card to the Websites tab in `portfolio.html`. Execute every step below in order without asking for confirmation.

---

## What this skill does

Replaces the next available Coming Soon placeholder in the `#section-websites` grid with a real portfolio card that has:
- A video preview (looping, muted, autoplay)
- An iframe modal trigger on "View Website"

---

## Step 1 — Gather inputs

Read the args the user passed. You need:
- **Name** — display name for the card (e.g. "Roofing Site")
- **Category** — label under the name (e.g. "Lead Gen Website")
- **Year** — e.g. "2025"
- **Video path** — relative path from portfolio root to the `.mp4` file inside `Website for portfolio works/`
- **Site folder** — relative path from portfolio root to the site's `index.html` inside `Website for portfolio works/`

If the user did not provide all five values in their message, ask for the missing ones before proceeding.

---

## Step 2 — Verify the files exist

Before editing anything:
1. Check that the video file exists at the path given
2. Check that the site `index.html` exists at the path given

If either is missing, tell the user exactly which path is wrong and stop. Do not edit `portfolio.html` if the files aren't there.

---

## Step 3 — Read portfolio.html

Read `c:\ClaudeCodeProjects\porfolioweb\portfolio.html` fully.

---

## Step 4 — Find the next placeholder in #section-websites

Inside `<div class="port-section" id="section-websites">`, find the first `<article class="port-card port-card--placeholder">` and replace it with a real card.

The real card format is:

```html
<article class="port-card">
  <div class="port-card__img"><video autoplay loop muted playsinline src="ENCODED_VIDEO_PATH" style="object-position: top center;"></video></div>
  <div class="port-card__bar">
    <div class="port-card__bar-top">
      <h2 class="port-card__name">NAME</h2>
      <div class="port-card__bar-divider"></div>
      <div class="port-card__label"><span class="port-card__cat">CATEGORY</span><span class="port-card__year">YEAR</span></div>
    </div>
    <div class="port-card__bar-body"><div class="port-card__bar-body-inner"><a href="#" class="port-card__discover" data-iframe="ENCODED_SITE_PATH" data-title="NAME">View Website</a></div></div>
  </div>
</article>
```

Rules:
- URL-encode spaces as `%20` in both `src` and `data-iframe`
- `object-position: top center` is the default — mention to the user they can ask to adjust it if the brand is cut off
- Match the exact indentation of the placeholder being replaced

---

## Step 5 — Write the edit

Use the Edit tool to replace only the placeholder article with the new card. Do not touch any other part of the file.

---

## Step 6 — Report back

Tell the user:
- Which placeholder slot was filled (e.g. "slot 2 of 4")
- How many Coming Soon slots remain in the Websites tab
- Remind them: if the brand/logo looks cut off in the preview, tell you which direction (left/right/top/bottom) and you'll fix the `object-position`
