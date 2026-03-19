// scripts/new-post.js
const fs = require('fs');
const path = require('path');

const title = process.argv[2];

if (!title || !title.trim()) {
  console.error('\nUsage: npm run new -- "Your Post Title Here"\n');
  process.exit(1);
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function todayISO() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return yyyy + '-' + mm + '-' + dd;
}

const slug = slugify(title.trim());
if (!slug) {
  console.error('\nCould not generate a slug from that title. Try using more words.\n');
  process.exit(1);
}

const filePath = path.resolve(__dirname, '..', 'posts', slug + '.md');
if (fs.existsSync(filePath)) {
  console.error('\nFile already exists: posts/' + slug + '.md');
  console.error('Edit that file, or choose a different title.\n');
  process.exit(1);
}

const content = [
  '---',
  'title: ' + title.trim(),
  'date: ' + todayISO(),
  'tags: []',
  'excerpt: ',
  '---',
  '',
  ''
].join('\n');

fs.writeFileSync(filePath, content, 'utf8');

console.log('\nCreated: posts/' + slug + '.md');
console.log('\nOpen that file and:');
console.log('  - Fill in tags and excerpt');
console.log('  - Write your post below the second ---');
console.log('\nWhen ready: npm run publish\n');
