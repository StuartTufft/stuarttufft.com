// scripts/publish.js
const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

function run(cmd) {
  execSync(cmd, { stdio: 'inherit', cwd: ROOT });
}

function capture(cmd) {
  try { return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }); }
  catch (e) { return e.stdout || ''; }
}

try {
  console.log('\n--- Building ---');
  run('node build.js');

  var indexData = JSON.parse(fs.readFileSync(path.join(ROOT, 'writing-index.json'), 'utf8'));
  var slugToTitle = {};
  indexData.forEach(function (p) { slugToTitle[p.slug] = p.title; });

  // Detect brand-new (untracked) post files before staging
  var statusOut = capture('git status --porcelain -- posts/');
  var newSlugs = statusOut
    .split('\n')
    .filter(function (l) { return l.startsWith('??'); })
    .map(function (l) {
      return path.basename(l.slice(3).trim()).replace(/\.(md|html)$/, '');
    });
  var newTitles = newSlugs.map(function (s) { return slugToTitle[s]; }).filter(Boolean);

  console.log('\n--- Staging ---');
  run('git add posts/ writing/ writing-index.json writing.html');

  var hasStagedChanges = false;
  try { execSync('git diff --cached --quiet', { cwd: ROOT }); }
  catch (e) { hasStagedChanges = true; }

  if (!hasStagedChanges) {
    console.log('\nNothing to publish — site is already up to date.\n');
    process.exit(0);
  }

  var message;
  if (newTitles.length === 1)    { message = 'Publish: ' + newTitles[0]; }
  else if (newTitles.length > 1) { message = 'Publish ' + newTitles.length + ' posts'; }
  else                            { message = 'Update site'; }

  console.log('\n--- Committing: "' + message + '" ---');
  run('git commit -m ' + JSON.stringify(message));

  console.log('\n--- Pushing to GitHub ---');
  run('git push');

  console.log('\nDone. stuarttufft.com will update in a minute or two.\n');

} catch (e) {
  console.error('\nSomething went wrong. See the error above.');
  console.error('If you\'re not sure, run: npm run build\n');
  process.exit(1);
}
