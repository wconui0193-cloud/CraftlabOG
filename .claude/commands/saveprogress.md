---
name: saveprogress
description: Saves all progress from the current session to persistent memory inside the project folder. Creates a dated log covering every section changed, feature built, design decision made, component added or removed, brand decisions, master preferences, and the full current state of the site. Saves to .claude/progress/ inside the project — per-folder level only. Run this at the end of any working session.
---

# Save Session Progress

When this command is invoked, execute every step below in order. Do not skip any step. Do not ask for confirmation — just do it.

The save location is **project-local only**: `c:\ClaudeCodeProjects\porfolioweb\.claude\progress\`
Do NOT write to the global user memory directory. Everything stays inside this project folder.

---

## Step 1 — Read all source files

Read every source file fully to get an accurate and complete picture of the current project state:

- `c:\ClaudeCodeProjects\porfolioweb\index.html`
- `c:\ClaudeCodeProjects\porfolioweb\style.css`
- `c:\ClaudeCodeProjects\porfolioweb\script.js`
- `c:\ClaudeCodeProjects\porfolioweb\CLAUDE.md` (brand identity + instructions)

Also check what progress files already exist:
- `c:\ClaudeCodeProjects\porfolioweb\.claude\progress\` — list files present

---

## Step 2 — Compile the full session log

Build a thorough log. Every section below is required — do not omit any.

---

### A. Session Summary
2–4 sentences: what the master asked for this session, what was built, what was removed or replaced.

---

### B. Changes This Session
Bullet list of every:
- Section or feature added (name it precisely)
- Section or feature removed or replaced and why
- Design change: font, color, spacing, layout tweak
- New CSS component created (class name + what it does)
- New JavaScript function/IIFE added (name + purpose)
- JS function/IIFE removed
- Any bug or visual issue fixed

---

### C. Master Preferences & Instructions
Any explicit instructions, corrections, or preferences the master expressed this session. Include:
- Things the master said to remove, stop doing, or change
- Things the master confirmed or approved
- Naming preferences (e.g. "don't call me the user, call me the master")
- Tone and communication style preferences
- Aesthetic preferences stated or implied

---

### D. Design Decisions Locked In
Any brand, typography, color, or layout choices that were confirmed, discussed, or solidified this session. These should be treated as permanent unless explicitly overridden.

---

### E. Brand Identity Snapshot
Capture the active brand state from CLAUDE.md and session context:
- **Brand name**: CraftLab. (always with trailing dot)
- **Tagline**: FUNNELS + AUTOMATION
- **Founder**: William Con-ui
- **Color palette**: list all 6 colors with hex values and roles
- **Typography**: headline font + body font + any special display fonts in use
- **Hero background**: note the gradient formula
- **Tone/voice**: bullet the brand personality traits active on the site

---

### F. Full Site Section Inventory
Complete ordered list of every section currently on the page:
- Section name / HTML ID
- Background color / style
- Key components inside it
- Interactive behavior (if any)
- CSS class names that drive it

---

### G. CSS Component Inventory
List every named component block currently in style.css:
- Class name
- What it does / renders
- Key properties (color, animation, layout type)

---

### H. JavaScript Feature Inventory
List every interactive function/IIFE currently in script.js:
- Function name
- What it does
- Trigger (scroll, click, auto, etc.)

---

### I. External Dependencies & Links
- Google Fonts loaded (names + weights)
- Icon libraries loaded
- Any CDN dependencies
- External URLs hardcoded in the site (booking links, social links, email)
- Any file paths for images or assets referenced

---

### J. File & Asset Structure
List all files in the project root and any subdirectories (images, fonts, etc.):
- File name + purpose

---

### K. Open Items & Planned Next Steps
Any features, improvements, or ideas mentioned this session that were NOT yet built:
- What was discussed but deferred
- Known issues or rough edges to revisit
- Ideas the master hinted at

---

### L. Technical Notes
Any patterns, conventions, CSS variables, or architectural decisions that future sessions must respect:
- CSS custom properties in use and their values
- Animation easing curves defined
- Responsive breakpoints
- Anything a new session would need to know to avoid breaking existing work

---

## Step 3 — Write the progress file

Determine today's date from the `currentDate` value in context (format: YYYY-MM-DD).

Save path: `c:\ClaudeCodeProjects\porfolioweb\.claude\progress\progress_[DATE].md`

Check if a file for today already exists:
- **Exists** → read it, append new session content under a new `## Session [N] — [short title]` heading
- **Does not exist** → create it fresh

Frontmatter:
```
---
date: [YYYY-MM-DD]
project: CraftLab. Portfolio Website
session: [N]
summary: [one-line summary of what was built this session]
---
```

Write every section from Step 2 into the file. Be complete — this file is the single source of truth for what the project looked like at this point in time.

---

## Step 4 — Update the progress index

Read or create: `c:\ClaudeCodeProjects\porfolioweb\.claude\progress\INDEX.md`

This file is an index of all saved progress files. Each entry is one line:
```
- [YYYY-MM-DD](progress_YYYY-MM-DD.md) — [one-line summary of main work done]
```

Add today's entry (or update it if already present). Keep entries in reverse-chronological order (newest first).

---

## Step 5 — Update the global MEMORY.md (reference pointer only)

Read `C:\Users\wconu\.claude\projects\c--ClaudeCodeProjects-porfolioweb\memory\MEMORY.md`

Ensure there is a reference entry pointing to the local progress index:
```
- [Session Progress Logs](.claude/progress/INDEX.md) — full per-session build history, design decisions, and site inventory
```

Add it if missing. Do not write actual progress content into MEMORY.md — it stays a pointer only.

Write back if changed.

---

## Step 6 — Report to the master

Reply with:
- The file path written
- A 5–7 bullet summary of what was logged
- Whether any new preferences or design decisions were captured
- Any open items or next-step suggestions pulled from the session

Keep it concise — one short paragraph + bullets.
