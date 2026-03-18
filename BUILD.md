# BUILD.md

One-shot build instruction for Claude Code. Read CLAUDE.md first — it contains
the full design system, conventions, cert list, and social URLs. Everything in
CLAUDE.md takes precedence. Execute all steps in order. Do not ask for
clarification — make the simplest sensible call and leave a TODO comment.

---

## Step 1: Create folder structure

Create these files and folders (empty unless content is specified below):

```
index.html
about.html
writing.html
projects.html
writing/.gitkeep
posts/hello-world.md
assets/css/style.css
assets/js/main.js
assets/img/.gitkeep
templates/post.html
build.js
package.json
.gitignore
_redirects
README.md
```

Do not touch CLAUDE.md or BUILD.md.

---

## Step 2: package.json

```json
{
  "name": "stuarttufft-com",
  "version": "1.0.0",
  "description": "Personal website for Stuart Tufft — stuarttufft.com",
  "scripts": {
    "build": "node build.js",
    "dev": "npx serve ."
  },
  "dependencies": {
    "marked": "^12.0.0"
  }
}
```

---

## Step 3: .gitignore

```
node_modules/
.DS_Store
Thumbs.db
*.log
.env
```

---

## Step 4: _redirects

This file fixes GitHub Pages routing for clean URLs:

```
/*    /index.html    200
```

---

## Step 5: README.md

```markdown
# stuarttufft.com

Personal website for Stuart Tufft. Built with plain HTML, Bootstrap 5, and a
Node.js build script for markdown-based blog posts.

## Getting started

Install dependencies:
    npm install

Build blog posts from markdown:
    npm run build

Preview locally:
    npm run dev

## Adding a blog post

1. Create a new file in posts/ with a .md extension, e.g. posts/my-post.md
2. Add frontmatter at the top (see posts/hello-world.md for an example)
3. Write your post in markdown below the frontmatter
4. Run npm run build
5. The post appears at writing/my-post.html and in the writing index

## Deploying

Push to the main branch of your GitHub repository. GitHub Pages will
serve the site automatically. Point your custom domain stuarttufft.com
to the repository in GitHub Pages settings.

## Assets

- Headshot: replace assets/img/stuart.jpg with your photo (any jpeg, min 400px wide)
- OG image: add assets/img/og-default.jpg for LinkedIn share previews (1200x630px recommended)
```

---

## Step 6: assets/css/style.css

This file only handles what Bootstrap cannot: brand tokens, typography overrides,
custom components, and the lime accent. Keep it lean.

Include:

- CSS custom properties (--st-* tokens from CLAUDE.md, both light and dark)
- Bootstrap font family overrides:
  `--bs-body-font-family: 'Inter', 'Helvetica Neue', sans-serif;`
  `--bs-body-font-weight: 300;`
  `--bs-heading-font-family: 'Roboto', 'Helvetica Neue', sans-serif;`
- Body background and text colour wired to --st-bg and --st-text
- `.nav-logo-dot` — 6px lime circle beside the logo text
- `.btn-accent` — pill button with --st-accent background, --st-text colour,
  hover darkens to --st-accent-dark
- `.section-eyebrow` — 0.72rem, font-weight 600, letter-spacing 0.05em,
  text-transform uppercase, color --st-text-light
- `em` inside headings — font-style normal, color --st-accent-dark
- `.reveal` / `.reveal.visible` — opacity 0 to 1, translateY 18px to 0,
  transition 0.65s. `.d1` delay 80ms, `.d2` 160ms, `.d3` 240ms.
- `.cert-card` — Bootstrap card with 3px top border, colour per category:
  Security (purple), M365 (blue), Azure (cyan), Power Platform (indigo), AI (teal)
- `.post-card` — card with hover lift (translateY -4px, shadow increase)
- `.video-wrap` — 16:9 aspect ratio wrapper for YouTube iframes
- `.reading-col` — max-width 680px, margin auto, for post pages
- Newsletter card: dark background (--st-text), light text, lime CTA button.
  Override in dark mode so it does not double-invert.
- Scroll reveal IntersectionObserver styles
- Any other custom styles not covered by Bootstrap utilities

---

## Step 7: assets/js/main.js

Handle these concerns:

```js
// 1. Dark mode
// Read localStorage key 'st-theme' and system prefers-color-scheme on page load
// Set data-bs-theme attribute on document.documentElement
// toggleTheme() flips between light/dark, saves to localStorage
// Wire all elements with id="themeToggle" or id="themeToggleMobile" to toggleTheme()

// 2. Nav scroll state
// Add class 'scrolled' to element with id="mainNav" after 10px scroll
// Use passive scroll listener

// 3. Scroll reveal
// IntersectionObserver on all .reveal elements
// Add .visible when 10% in view, then unobserve

// 4. Active nav link
// Add 'active' class to the nav link matching the current page URL
```

---

## Step 8: Shared nav HTML snippet

Use this nav on every page. Adjust `../assets/` paths for pages in subdirectories.
The active link class must be set per page (or handled by the JS in main.js).

```html
<nav class="navbar navbar-expand-lg sticky-top" id="mainNav">
  <div class="container">
    <a class="navbar-brand d-flex align-items-center gap-2" href="/index.html">
      Stuart Tufft<span class="nav-logo-dot"></span>
    </a>
    <button class="navbar-toggler border-0" type="button"
      data-bs-toggle="collapse" data-bs-target="#navMenu"
      aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navMenu">
      <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-1">
        <li class="nav-item"><a class="nav-link" href="/index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="/about.html">About</a></li>
        <li class="nav-item"><a class="nav-link" href="/writing.html">Writing</a></li>
        <li class="nav-item"><a class="nav-link" href="/projects.html">Projects</a></li>
        <li class="nav-item">
          <a class="nav-link" href="https://www.youtube.com/@StuartTufft"
            target="_blank" rel="noopener">
            Watch <i class="bi bi-box-arrow-up-right small"></i>
          </a>
        </li>
        <li class="nav-item ms-lg-2">
          <a class="nav-link btn btn-accent px-3 py-1 rounded-pill"
            href="/writing.html#newsletter">Follow</a>
        </li>
        <li class="nav-item ms-1">
          <button class="btn btn-sm border rounded" id="themeToggle"
            aria-label="Toggle dark mode">
            <i class="bi bi-sun-fill icon-sun d-none"></i>
            <i class="bi bi-moon-fill icon-moon"></i>
          </button>
        </li>
      </ul>
    </div>
  </div>
</nav>
```

---

## Step 9: Shared footer HTML snippet

Use this footer on every page. Include the newsletter form here.

```html
<footer class="pt-5 pb-4 mt-5 border-top">
  <div class="container">
    <!-- Newsletter -->
    <div class="row mb-5" id="newsletter">
      <div class="col-lg-8 mx-auto text-center">
        <p class="section-eyebrow">Community</p>
        <h2 class="h4 mb-2">No noise, just signal.</h2>
        <p class="text-body-secondary mb-4">
          Fortnightly thoughts on Copilot Studio, agentic AI, and real-world
          delivery — from someone in the field, not the sidelines.
        </p>
        <form class="d-flex gap-2 justify-content-center flex-wrap"
          onsubmit="return false;">
          <!-- TODO: wire to newsletter provider (e.g. Beehiiv or ConvertKit) -->
          <input type="email" class="form-control w-auto flex-grow-1"
            placeholder="your@email.com" aria-label="Email address"
            style="max-width:280px;" />
          <button type="submit" class="btn btn-accent rounded-pill px-4">
            Subscribe
          </button>
        </form>
      </div>
    </div>

    <!-- Footer grid -->
    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <div class="fw-semibold mb-2">Stuart Tufft</div>
        <p class="small text-body-secondary">
          AI and Copilot consultant at Bytes Software Services.
          Writing about what actually works.
        </p>
        <div class="d-flex gap-2 mt-3">
          <a href="https://www.linkedin.com/in/stuarttufft/"
            target="_blank" rel="noopener"
            class="btn btn-sm btn-outline-secondary rounded"
            aria-label="LinkedIn">
            <i class="bi bi-linkedin"></i>
          </a>
          <a href="https://www.youtube.com/@StuartTufft"
            target="_blank" rel="noopener"
            class="btn btn-sm btn-outline-secondary rounded"
            aria-label="YouTube">
            <i class="bi bi-youtube"></i>
          </a>
          <a href="https://github.com/stuarttufft"
            target="_blank" rel="noopener"
            class="btn btn-sm btn-outline-secondary rounded"
            aria-label="GitHub">
            <i class="bi bi-github"></i>
          </a>
        </div>
      </div>
      <div class="col-6 col-md-2 offset-md-2">
        <div class="section-eyebrow mb-3">Content</div>
        <ul class="list-unstyled small">
          <li class="mb-2"><a href="/writing.html" class="text-body-secondary text-decoration-none">Writing</a></li>
          <li class="mb-2"><a href="/projects.html" class="text-body-secondary text-decoration-none">Projects</a></li>
          <li class="mb-2">
            <a href="https://www.youtube.com/@StuartTufft"
              target="_blank" rel="noopener"
              class="text-body-secondary text-decoration-none">Watch</a>
          </li>
        </ul>
      </div>
      <div class="col-6 col-md-2">
        <div class="section-eyebrow mb-3">Credentials</div>
        <ul class="list-unstyled small">
          <li class="mb-2"><a href="/about.html#certs" class="text-body-secondary text-decoration-none">Certifications</a></li>
          <li class="mb-2">
            <a href="https://learn.microsoft.com/en-gb/users/stuarttufft/"
              target="_blank" rel="noopener"
              class="text-body-secondary text-decoration-none">Microsoft Learn</a>
          </li>
        </ul>
      </div>
      <div class="col-6 col-md-2">
        <div class="section-eyebrow mb-3">Connect</div>
        <ul class="list-unstyled small">
          <li class="mb-2">
            <a href="https://www.linkedin.com/in/stuarttufft/"
              target="_blank" rel="noopener"
              class="text-body-secondary text-decoration-none">LinkedIn</a>
          </li>
          <li class="mb-2">
            <a href="/writing.html#newsletter"
              class="text-body-secondary text-decoration-none">Newsletter</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center
      border-top pt-3 flex-wrap gap-2">
      <small class="text-body-secondary">
        &copy; 2026 Stuart Tufft<span class="nav-logo-dot mx-2"></span>All rights reserved.
      </small>
      <small class="text-body-secondary">stuarttufft.com</small>
    </div>
  </div>
</footer>
```

---

## Step 10: index.html

Page title: "Stuart Tufft — No nonsense AI."

OG tags (see CLAUDE.md for format):
- og:title: "Stuart Tufft — No nonsense AI."
- og:description: "Copilot Studio and agentic AI consultant. Learning in public."
- og:url: https://stuarttufft.com/

Hero section only — nothing else below it. Use Bootstrap container and row.

```html
<section class="py-5 py-lg-6 min-vh-100 d-flex align-items-center">
  <div class="container">
    <div class="row">
      <div class="col-lg-8">
        <p class="section-eyebrow mb-4 reveal" data-hero="1">
          Copilot Studio &nbsp;·&nbsp; Agentic AI &nbsp;·&nbsp;
          Bytes Software Services &nbsp;·&nbsp; United Kingdom
        </p>
        <h1 class="display-4 fw-light lh-sm mb-4 reveal" data-hero="2">
          The tech is easy to sell.<br />
          Making it <em>stick for people</em> isn't.
        </h1>
        <p class="lead fw-light text-body-secondary mb-5 reveal" data-hero="3">
          I design and deploy AI agents and help organisations embrace Copilot
          sustainably — from C-suite strategy to hands-on delivery.
          No shortcuts. No hype.
        </p>
        <div class="d-flex align-items-center gap-3 flex-wrap reveal" data-hero="4">
          <a href="writing.html" class="btn btn-accent rounded-pill px-4 py-2">
            Read the writing <i class="bi bi-arrow-right ms-1"></i>
          </a>
          <a href="about.html" class="btn btn-link text-body-secondary px-0">
            About Stuart <i class="bi bi-arrow-right ms-1"></i>
          </a>
        </div>
        <div class="d-flex align-items-center gap-2 mt-5 reveal" data-hero="5">
          <small class="text-body-secondary me-1">Find me on</small>
          <a href="https://www.linkedin.com/in/stuarttufft/"
            target="_blank" rel="noopener"
            class="btn btn-sm btn-outline-secondary rounded" aria-label="LinkedIn">
            <i class="bi bi-linkedin"></i>
          </a>
          <a href="https://www.youtube.com/@StuartTufft"
            target="_blank" rel="noopener"
            class="btn btn-sm btn-outline-secondary rounded" aria-label="YouTube">
            <i class="bi bi-youtube"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## Step 11: about.html

Page title: "About — Stuart Tufft"

Sections in order:
1. Hero row: headshot (assets/img/stuart.jpg, 120px circular) + eyebrow + H1
2. Bio: two paragraphs (text below)
3. Meta row: location icon + "United Kingdom", briefcase icon + "Bytes Software Services"
4. Stat cards: Bootstrap card grid 2x2
5. Divider
6. Certifications section: H2 "Microsoft Certified", cert card grid grouped by tier

Bio paragraph 1:
"I'm a Lead AI Consultant at Bytes Software Services with 10+ years in the Microsoft
ecosystem. My focus is Copilot Studio, agentic AI, and data security — but the thing
that makes it work is people. I've helped over a thousand users — from NHS teams to
global enterprises — move from curious to genuinely confident with Copilot."

Bio paragraph 2:
"I design custom Copilot Studio agents, run hands-on workshops, lead data security
and compliance reviews with Purview and Entra ID, and work directly with C-suite to
align AI strategy with real business outcomes. Clear communication, no shortcuts,
outcomes built to last."

Stat card values:
- "10+" / "Years in the Microsoft ecosystem"
- "1,000+" / "Users helped successfully adopt Copilot"
- "6+" / "Sectors: NHS, Legal, Finance, Aerospace, Gov and more"
- "Zero shortcuts" / "Value-driven delivery, built for lasting impact"

Certifications: use exact list from CLAUDE.md. Group into three Bootstrap rows:
Expert, Associate, Fundamentals / Professional. Each cert is a card with:
- Exam code (small, uppercase, muted)
- Cert name (fw-semibold)
- Badge pill (category label)
- Coloured top border (3px, category colour — see CLAUDE.md)

---

## Step 12: writing.html

Page title: "Writing — Stuart Tufft"

Sections:
1. Page header: eyebrow "From the field", H2 "Latest writing"
2. Search input: id="post-search", Bootstrap form-control,
   placeholder "Search by title or topic...", bi-search icon
3. Post list container: id="post-list"
4. Inline newsletter section (same form as footer but with different heading copy)

Post card structure (render this for each post from writing-index.json):
```html
<article class="post-card card border-0 mb-3 reveal">
  <div class="card-body p-4">
    <div class="d-flex justify-content-between align-items-start mb-2">
      <div class="d-flex gap-2 flex-wrap">
        <!-- tags rendered as <span class="badge rounded-pill ...">Tag</span> -->
      </div>
      <small class="text-body-secondary text-nowrap ms-2">DATE · READ_TIME min read</small>
    </div>
    <h3 class="h5 mb-2"><a href="writing/SLUG.html" class="text-body text-decoration-none stretched-link">TITLE</a></h3>
    <p class="text-body-secondary small mb-0">EXCERPT</p>
  </div>
</article>
```

Page-specific JS (inline script at bottom of page):
- fetch('writing-index.json') on DOMContentLoaded
- If fetch fails, show 3 static placeholder cards with TODO comment
- On #post-search input: filter rendered cards, case-insensitive match on
  title + tags joined as a string. Show/hide articles based on match.

---

## Step 13: projects.html

Page title: "Projects — Stuart Tufft"

Header: eyebrow "Delivery", H2 "Real-world projects",
blurb "Hands-on delivery across public and private sector.
Anonymised where the client is not named."

2-column Bootstrap card grid (col-md-6). 4 placeholder cards:

1. Energy sector / Near Miss Reporting Agent
   Built: Copilot Studio agent with SharePoint knowledge sources and Power Automate
   Word document generation.
   Outcome: Replaced a manual paper-based process across field teams.

2. Construction / Governance and ALM framework
   Built: Four-phase delivery plan covering DLP hardening, Copilot Studio pilot,
   and production readiness.
   Outcome: Client moved from ungoverned experimentation to structured delivery.

3. Legal / Power Platform governance assessment
   Built: Framework gap analysis across Power Platform and Copilot Studio
   for a mid-size law firm.
   Outcome: Clear remediation roadmap with prioritised actions.

4. Housing / Land acquisition due diligence agent
   Built: Copilot Studio agent integrating UK Land Registry API with
   structured data inputs.
   Outcome: Reduced manual research time per site from hours to minutes.

Each card includes an "Anonymised" badge and a TODO comment to replace with real details.

---

## Step 14: templates/post.html

HTML template file used by build.js. Tokens in double curly braces.

Must include:
- Full HTML document structure with CDN links (../assets/ paths)
- OG meta tags populated from {{title}}, {{excerpt}}, {{slug}}
- Nav (shared, with ../assets/ paths)
- Back link to ../writing.html
- Article header: {{title}}, {{date}}, {{readtime}} min read, {{tags}}
- Optional YouTube embed: {{youtube}} (empty string if no youtube_id)
- Reading column: max-width 680px, {{content}} (rendered HTML)
- Newsletter section
- Footer (shared, with ../assets/ paths)
- Bootstrap JS and ../assets/js/main.js

---

## Step 15: build.js

```js
// build.js
// Converts posts/*.md to writing/[slug].html
// Generates writing-index.json
// Run: node build.js
//
// Requires: npm install marked

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// --- helpers ---

function parseFrontmatter(raw) {
  // Split on first two --- delimiters
  // Return { meta: {}, body: '' }
}

function calculateReadTime(text) {
  // words / 200, rounded up, minimum 1
}

function slugify(filename) {
  // strip .md extension, return filename as slug
}

function renderTags(tags) {
  // return array of <span class="badge rounded-pill bg-secondary">Tag</span>
}

function renderYoutube(youtubeId) {
  // if youtubeId is present, return iframe embed in .video-wrap div
  // otherwise return empty string
}

// --- main ---

const POSTS_DIR = path.join(__dirname, 'posts');
const OUTPUT_DIR = path.join(__dirname, 'writing');
const TEMPLATE = fs.readFileSync(
  path.join(__dirname, 'templates', 'post.html'), 'utf8'
);

const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
const index = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
  const { meta, body } = parseFrontmatter(raw);
  const slug = slugify(file);
  const content = marked(body);
  const readtime = calculateReadTime(body);

  const html = TEMPLATE
    .replace(/{{title}}/g, meta.title || 'Untitled')
    .replace(/{{date}}/g, meta.date || '')
    .replace(/{{readtime}}/g, readtime)
    .replace(/{{tags}}/g, renderTags(meta.tags || []))
    .replace(/{{youtube}}/g, renderYoutube(meta.youtube_id))
    .replace(/{{content}}/g, content)
    .replace(/{{slug}}/g, slug)
    .replace(/{{excerpt}}/g, meta.excerpt || '');

  fs.writeFileSync(path.join(OUTPUT_DIR, `${slug}.html`), html);
  console.log(`Built: writing/${slug}.html`);

  index.push({
    slug,
    title: meta.title || 'Untitled',
    date: meta.date || '',
    tags: meta.tags || [],
    excerpt: meta.excerpt || '',
    readtime,
    youtube_id: meta.youtube_id || null,
  });
}

// Sort by date descending
index.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(
  path.join(__dirname, 'writing-index.json'),
  JSON.stringify(index, null, 2)
);

console.log(`Done. Built ${index.length} posts. Index written to writing-index.json`);
```

Implement all helper functions fully. Do not leave them as stubs.

---

## Step 16: posts/hello-world.md

```
---
title: Hello world. This is where I write about what I actually do.
date: 2026-03-18
tags: [Meta, Copilot Studio]
excerpt: First post. What this site is, why I built it, and what I plan to write about.
---

## Why I built this

I've been delivering Copilot Studio agents and AI governance frameworks for clients
across the NHS, legal, construction, and energy sectors. A lot of what I learn stays
inside client engagements and never gets shared.

This site changes that. Learning in public. Real delivery notes, real mistakes, real
patterns that actually work.

## What to expect

Posts about Copilot Studio, agentic AI delivery, Power Platform governance, and the
gap between demos that impress and systems that last.

No nonsense. No hype. Just what actually works.
```

---

## Step 17: Verify and summarise

1. Run `npm install` — confirm it installs marked with no errors
2. Run `node build.js` — confirm writing/hello-world.html is generated
3. Confirm writing-index.json is valid JSON with one entry
4. Check every page has correct relative paths for assets
5. Check every page has working nav links
6. Check dark mode toggle is present on every page
7. List all TODO comments left in the codebase as a final summary

---

## Hard rules

- No em dashes. No href="#". No invented certifications.
- Bootstrap Icons only — no inline SVGs.
- index.html hero section only — nothing else on the home page.
- Do not ask questions. Make a call, leave a TODO.
