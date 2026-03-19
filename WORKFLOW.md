# stuarttufft.com — How to use this site

---

## First time on a new machine

Install Node.js, then open a terminal in this folder and run:

    npm install

Do this once. You do not need to do it again unless you clone the repo to a new machine.

---

## Writing and publishing a post

### 1. Create the file

    npm run new -- "Your Post Title Here"

This creates the post file with the slug and date filled in automatically.
It will tell you where the file is. Open it and fill in:

- `tags: [Tag1, Tag2]` — what topics does this cover?
- `excerpt: ` — one sentence shown on the writing page
- Then write your post below the second `---`

### 2. Preview locally (optional)

    npm run serve

Opens http://localhost:3000 — use this to check how things look before publishing.
Open the writing page at http://localhost:3000/writing.html to see your post card.
Press Ctrl+C to stop.

### 3. Publish

    npm run publish

Builds the site, commits, and pushes to GitHub.
Your post will be live on stuarttufft.com within a minute or two.

---

## Editing an existing post

Edit the file in `posts/`, then run `npm run publish`.

---

## Command reference

| Command | What it does |
|---------|--------------|
| `npm run new -- "Title"` | Creates a new post file ready to write |
| `npm run serve` | Local preview at http://localhost:3000 |
| `npm run build` | Builds the site without publishing |
| `npm run publish` | Builds, commits, and pushes to GitHub |
| `npm run pdf` | Generates `cv/stuart-tufft-cv.pdf` as a single-page PDF |

---

## Exporting the CV to PDF

    npm run pdf

Generates `cv/stuart-tufft-cv.pdf` — a single-page PDF sized exactly to the CV content.
Run this before attaching to job applications.

The file is not committed to git — regenerate it any time you need a fresh copy.

---

## If something looks wrong

**Posts not showing on writing.html?**
Use `npm run serve`. Opening files directly won't work for the writing page.

**Error during publish?**
Run `npm run build` to see what's wrong. Fix the issue, then run `npm run publish` again.

**Git error?**
Check you're online, then try `git push` manually from this folder.

**Not sure what state things are in?**
Run `git status` to see what has changed but not been committed.

**Anything else?**
Open this project with Claude Code — it has full context of how everything works.

---

## Rich HTML posts (advanced, rare)

Most posts should be Markdown. For posts with custom layouts, you can write a full HTML file
instead. See CLAUDE.md for the format — specifically the frontmatter comment block required at
the top of the file. Run `npm run build` to process it.
