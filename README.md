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
