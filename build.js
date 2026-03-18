// build.js
// Converts posts/*.md to writing/[slug].html
// Generates writing-index.json
// Run: node build.js
//
// Requires: npm install marked

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// ── Helpers ───────────────────────────────────────────────────────────

function parseFrontmatter(raw) {
  // Split on first two --- delimiters
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { meta: {}, body: raw };
  }
  const frontmatter = match[1];
  const body = match[2];
  const meta = {};

  frontmatter.split(/\r?\n/).forEach(function (line) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    // Handle YAML arrays: [item1, item2]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map(function (s) { return s.trim().replace(/^['"]|['"]$/g, ''); })
        .filter(Boolean);
    }

    meta[key] = value;
  });

  return { meta, body };
}

function calculateReadTime(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function slugify(filename) {
  // Strip .md extension, return filename as slug
  return path.basename(filename, '.md');
}

function renderTags(tags) {
  if (!tags || tags.length === 0) return '';
  return tags
    .map(function (tag) {
      return '<span class="badge rounded-pill bg-secondary me-1">' + tag + '</span>';
    })
    .join('');
}

function renderYoutube(youtubeId) {
  if (!youtubeId) return '';
  return (
    '<div class="video-wrap mb-4">' +
      '<iframe src="https://www.youtube.com/embed/' + youtubeId + '" ' +
        'title="YouTube video" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ' +
        'allowfullscreen></iframe>' +
    '</div>'
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── Main ──────────────────────────────────────────────────────────────

const POSTS_DIR = path.join(__dirname, 'posts');
const OUTPUT_DIR = path.join(__dirname, 'writing');
const TEMPLATE = fs.readFileSync(
  path.join(__dirname, 'templates', 'post.html'), 'utf8'
);

const files = fs.readdirSync(POSTS_DIR).filter(function (f) {
  return f.endsWith('.md');
});

const index = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
  const { meta, body } = parseFrontmatter(raw);
  const slug = slugify(file);
  const content = marked(body);
  const readtime = calculateReadTime(body);

  const html = TEMPLATE
    .replace(/{{title}}/g, meta.title || 'Untitled')
    .replace(/{{date}}/g, formatDate(meta.date) || meta.date || '')
    .replace(/{{readtime}}/g, readtime)
    .replace(/{{tags}}/g, renderTags(meta.tags || []))
    .replace(/{{youtube}}/g, renderYoutube(meta.youtube_id))
    .replace(/{{content}}/g, content)
    .replace(/{{slug}}/g, slug)
    .replace(/{{excerpt}}/g, meta.excerpt || '');

  fs.writeFileSync(path.join(OUTPUT_DIR, slug + '.html'), html);
  console.log('Built: writing/' + slug + '.html');

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
index.sort(function (a, b) {
  return new Date(b.date) - new Date(a.date);
});

fs.writeFileSync(
  path.join(__dirname, 'writing-index.json'),
  JSON.stringify(index, null, 2)
);

console.log('Done. Built ' + index.length + ' post(s). Index written to writing-index.json');
