# Java Interview Notes ☕

Java interview questions answered in my own words, with runnable code and real output.
Built with [Docusaurus](https://docusaurus.io), written in plain Markdown so the same content can be published on Medium, Dev.to or Hashnode.

---

## 1. Run it on your computer

You need **Node.js 20+** (and **Java 17+** to run the examples).

```bash
npm install
npm start
```

Open http://localhost:3000/java-interview-notes/. The page reloads automatically whenever you save a file.

## 2. Project structure

```
docs/                     ← all your questions live here
  intro.md                ← "Start Here" page
  core-java/
    _category_.json       ← folder label + order in the sidebar
    equals-vs-double-equals.md
  collections/
  multithreading/
  java8-features/
examples/                 ← runnable .java file for every question
  core-java/EqualsVsDoubleEquals.java
templates/
  question-template.md    ← copy this for every new question
src/pages/index.tsx       ← homepage (topic cards)
docusaurus.config.ts      ← site settings (title, GitHub username…)
```

## 3. Add a new question

1. Copy `templates/question-template.md` into the right folder, e.g. `docs/collections/how-treemap-works.md`.
2. Write the runnable code in `examples/collections/TreeMapDemo.java`.
3. Run it and paste the **real** output into the page:
   ```bash
   java examples/collections/TreeMapDemo.java
   ```
4. Set `sidebar_position` in the front matter to control its order.

## 4. Add a new topic

1. Create a folder, e.g. `docs/spring/`.
2. Add `docs/spring/_category_.json`:
   ```json
   {
     "label": "Spring & Spring Boot",
     "position": 5,
     "link": { "type": "generated-index", "slug": "/spring", "description": "Spring core, Boot, JPA and REST." }
   }
   ```
3. Add at least one question inside it.
4. *(Optional)* Add a card for it in `src/pages/index.tsx` and a link in the footer of `docusaurus.config.ts`.

## 5. Deploy on Netlify

The site is deployed by Netlify; build settings live in `netlify.toml`
(`npm run build`, publish directory `build`, Node 20).

1. In `docusaurus.config.ts`, set `SITE_URL` to your Netlify address (or custom domain).
2. Push to `main`. Netlify builds and publishes the site automatically.

A GitHub Actions workflow (`.github/workflows/ci.yml`) also runs every Java example on each push and pull request.

## 6. Reuse a question as a blog post

The pages use plain Markdown on purpose, so they move cleanly to other platforms.

- **Dev.to / Hashnode:** paste the Markdown directly. Delete the `---` front-matter block at the top (or convert it to the platform's own front matter).
- **Medium:** Medium doesn't accept raw Markdown. Open the page on your live site, select the content, and paste it into the Medium editor. Headings, bold text and lists come through; re-insert code blocks with Medium's code-block button (or embed a GitHub Gist).
- **Combine questions:** group 5–8 related questions into one article, e.g. *"7 HashMap Interview Questions Explained with Code."*
- **Canonical link:** in Medium go to *Story settings → Advanced settings → Customize canonical link* and paste your site's URL, so search engines credit your site as the original.

## Useful commands

| Command | What it does |
| --- | --- |
| `npm start` | Local dev server with live reload |
| `npm run build` | Production build into `build/` (fails on broken links) |
| `npm run serve` | Preview the production build locally |
