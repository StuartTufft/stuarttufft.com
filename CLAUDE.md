# CLAUDE.md

Guidance for Claude Code working on stuarttufft.com.

---

## Who this is for

**Stuart Tufft** — M365 and Power Platform consultant at Bytes Software Services,
specialising in Copilot Studio agent delivery and agentic AI.

- Domain: stuarttufft.com
- Tagline: No nonsense AI.
- Purpose: Build personal credibility as the go-to Copilot Studio person.
  Learning in public. Not a portfolio. Not a CV site.
- Audience: Microsoft / Power Platform community, peers, people following
  the agentic AI space.

---

## Site structure

Multi-page static site. Separate HTML files per section. Bootstrap 5 for layout
and components. Custom CSS on top for design tokens and brand overrides.

```
stuarttufft.com/
├── index.html
├── about.html
├── writing.html
├── projects.html
├── cv/                       # CV documents
│   ├── index.html            # stuarttufft.com/cv/
│   └── variant-blue.html
├── writing/
│   └── .gitkeep
├── posts/
│   └── hello-world.md
├── assets/
│   ├── css/
│   │   └── style.css         # Brand tokens + Bootstrap overrides only
│   ├── js/
│   │   └── main.js           # Dark mode, nav, scroll reveal
│   └── img/
│       └── .gitkeep          # Stuart adds stuart.jpg manually
├── templates/
│   └── post.html             # Post template used by build.js
├── _source/                  # Working/reference files, not published (.gitignored)
│   └── workiq-cheatsheet.html
├── _prompts/                 # Working documents, not site content
├── build.js                  # Markdown to HTML build script
├── package.json              # npm metadata, marked dependency
├── .gitignore
├── _redirects                # GitHub Pages SPA routing fix
├── README.md
├── CLAUDE.md
└── BUILD.md
```

Nav on every page: Home · About · Writing · Projects · Watch (external link)
Watch links to https://www.youtube.com/@StuartTufft — no Watch page exists.

Newsletter signup lives in the footer sitewide and inline on writing.html.
No newsletter provider wired yet — form is UI-only for now.

---

## CDN dependencies (load order matters)

In every page `<head>`:
```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&family=Inter:wght@300;400;500&display=swap" rel="stylesheet" />

<!-- Bootstrap 5.3.8 CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous" />

<!-- Bootstrap Icons 1.11.3 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />

<!-- Site styles (brand tokens + overrides) -->
<link rel="stylesheet" href="assets/css/style.css" />
```

Before closing `</body>`:
```html
<!-- Bootstrap JS bundle (includes Popper) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>

<!-- Site JS -->
<script src="assets/js/main.js"></script>
```

For pages inside subdirectories (writing/[slug].html), use `../assets/` paths.

---

## Design system

Bootstrap handles: grid, responsive breakpoints, nav collapse, cards, badges,
forms, buttons, utilities. The custom style.css adds brand tokens on top and
overrides Bootstrap defaults where needed.

### CSS custom properties (add to :root in style.css)

```css
:root {
  --st-bg:           #F7F5F0;
  --st-surface:      #FDFCF9;
  --st-surface-alt:  #F2F0EB;
  --st-text:         #1A1A17;
  --st-text-mid:     #5A5A52;
  --st-text-light:   #8C8B82;
  --st-accent:       #A8E63D;
  --st-accent-dark:  #7CB82C;
  --st-accent-tint:  rgba(168,230,61,0.12);
  --st-border:       #E6E4DB;
}

[data-bs-theme="dark"] {
  --st-bg:           #1E1D19;
  --st-surface:      #28271F;
  --st-surface-alt:  #232219;
  --st-text:         #F0EDE6;
  --st-text-mid:     #AEADA4;
  --st-text-light:   #6A6960;
  --st-accent:       #A8E63D;
  --st-accent-dark:  #C2EF6A;
  --st-accent-tint:  rgba(168,230,61,0.15);
  --st-border:       #353429;
}
```

Prefix all custom tokens with `--st-` to avoid clashing with Bootstrap's `--bs-` tokens.

### Dark mode

Bootstrap 5.3 uses `data-bs-theme="dark"` on `<html>`. Set this attribute (not
`data-theme`). Persist to localStorage under the key `st-theme`. Wire the toggle
button to a `toggleTheme()` function in main.js. Both desktop and mobile toggles
share this function.

### Typography

- Display / headings: Roboto (weights 300, 400, 700)
- Body: Inter (weights 300, 400, 500)
- Set these as Bootstrap overrides in style.css:
  `--bs-body-font-family: 'Inter', sans-serif;`
  `--bs-font-sans-serif: 'Roboto', sans-serif;`

### Accent

The lime accent (`--st-accent`) is used only for: nav logo dot, CTA button
backgrounds, `<em>` highlights in headings, tag hover states, footer dot separator.
Do not use it as a general colour.

### Icons

Use Bootstrap Icons (`bi` classes) for all icons. No custom SVGs.
Examples: `<i class="bi bi-linkedin"></i>`, `<i class="bi bi-youtube"></i>`,
`<i class="bi bi-arrow-right"></i>`, `<i class="bi bi-search"></i>`

---

## Open Graph meta tags

Every page must include these in `<head>` for LinkedIn share previews:

```html
<meta property="og:title" content="PAGE TITLE — Stuart Tufft" />
<meta property="og:description" content="PAGE DESCRIPTION" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://stuarttufft.com/PAGE_PATH" />
<meta property="og:image" content="https://stuarttufft.com/assets/img/og-default.jpg" />
<meta name="twitter:card" content="summary_large_image" />
```

For post pages, the build script should populate these from frontmatter.
og-default.jpg is a placeholder — Stuart will add a real image later.
Add a TODO comment on each page noting this.

---

## Pages: content spec

### index.html

Above the fold only. Hero section, nothing below.

- H1: "The tech is easy to sell. Making it <em>stick for people</em> isn't."
- Eyebrow above H1: "Copilot Studio · Agentic AI · Bytes Software Services · United Kingdom"
- Sub: "I design and deploy AI agents and help organisations embrace Copilot
  sustainably — from C-suite strategy to hands-on delivery. No shortcuts. No hype."
- Primary CTA: "Read the writing" → writing.html (btn-dark rounded-pill)
- Ghost link: "About Stuart" → about.html
- Social row: LinkedIn icon, YouTube icon (real URLs from this file)

### about.html

- Circular headshot: assets/img/stuart.jpg, 120px
- Bio: two short paragraphs (see BUILD.md for exact text)
- Meta row: location, employer
- Stat cards 2x2: 10+, 1000+, 6+, Zero shortcuts
- Certifications section: grouped by tier, exact list below
- Footer with newsletter

### writing.html

- Search input filters post cards client-side
- Post cards rendered from writing-index.json (fetch), with static placeholders as fallback
- Newsletter section below posts

### writing/[slug].html

Generated by build.js. Narrow reading column (max 680px). Optional YouTube embed
at top if frontmatter includes youtube_id. Back link to writing.html. Newsletter
at bottom.

### projects.html

2-column card grid (1 on mobile). 4 placeholder cards. See BUILD.md for content.

---

## Certifications

Exact list. Do not invent or modify.

Expert:
- SC-100 — Cybersecurity Architect Expert
- MS-102 — Microsoft 365 Administrator Expert

Associate:
- SC-200 — Security Operations Analyst Associate
- SC-300 — Identity and Access Administrator Associate

Fundamentals / Professional:
- MB-901 — AI Business Professional
- PL-900 — Power Platform Fundamentals
- AI-900 — Azure AI Fundamentals
- MS-900 — Microsoft 365 Fundamentals
- SC-900 — Security, Compliance and Identity Fundamentals
- AZ-900 — Azure Fundamentals

Microsoft Learn: https://learn.microsoft.com/en-gb/users/stuarttufft/

Colour-code cert cards by category using Bootstrap border utilities:
- Security (SC-*): border-top border-3 border-purple (use custom colour)
- M365 (MS-*): border-top border-3, blue
- Azure (AZ-*, AI-*): border-top border-3, cyan
- Power Platform (PL-*): border-top border-3, indigo
- AI Professional (MB-*): border-top border-3, teal

---

## Social and external links

- LinkedIn: https://www.linkedin.com/in/stuarttufft/
- YouTube: https://www.youtube.com/@StuartTufft
- Microsoft Learn: https://learn.microsoft.com/en-gb/users/stuarttufft/
- GitHub: https://github.com/stuarttufft

Do not use href="#" as a placeholder. Use the real URL or omit the link.

---

## build.js

Node.js. Single dependency: `marked`. Run with `node build.js` or `npm run build`.

`posts/` supports two source formats:
- `.md` files   — converted via marked + templates/post.html
- `.html` files — copied as-is, metadata from frontmatter comment block at top

Both types end up in `writing/` and in `writing-index.json`.

Markdown frontmatter format:
```
---
title: Post title here
date: 2026-03-18
tags: [Copilot Studio, Power Automate]
excerpt: One line summary shown in post cards.
youtube_id: OPTIONAL_11_CHAR_ID
---
```

HTML post frontmatter (comment block at the very top of the file, before `<!DOCTYPE html>`):
```html
<!--
---
title: Post title here
date: 2026-03-18
tags: [Tag1, Tag2]
excerpt: One line summary shown in post cards.
readtime: 8
---
-->
```

`readtime` is optional in HTML posts — omit to auto-calculate from word count.
Add it as an override when the auto-calculated value is inflated by nav/script content.

Local preview: run `npm run serve` and open `http://localhost:3000` so fetch() works
and `writing-index.json` is the source of truth. The `staticPlaceholders` fallback in
`writing.html` is for `file://` only — update it whenever a new post is added.

Outputs:
- writing/[slug].html per post
- writing-index.json (array of post metadata, sorted by date descending)

---

## Conventions

- No em dashes anywhere. Commas, colons, or restructure.
- Bootstrap classes for layout and components. Custom CSS only for brand tokens,
  typography overrides, and things Bootstrap cannot do.
- Bootstrap Icons for all icons. No inline SVGs.
- BEM-like naming for any custom CSS classes not covered by Bootstrap.
- Scroll reveal: class `reveal` on elements, IntersectionObserver in main.js
  adds `visible`. Stagger via `d1`, `d2`, `d3` delay classes.
- When uncertain, make the simplest sensible call and leave a TODO comment.
- Mobile-first. Test at 375px, 768px, 1280px.
