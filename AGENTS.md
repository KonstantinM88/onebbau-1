# AGENTS.md

Project guidance for Codex and other coding agents working in this repository.

## Required Agent Workflow

- Read this file before making non-trivial changes.
- After important changes, update this file with any new project knowledge, conventions, commands, or gotchas that would speed up future work.
- Keep this file practical and current. Do not turn it into a full changelog.
- Never write secrets, passwords, tokens, API keys, or private `.env` values into this file.
- Preserve user changes in the working tree. Do not revert unrelated edits.

## Project Overview

- Project: `onebbau`, a bilingual OneB Bau website.
- Framework: Next.js App Router.
- Languages/locales: German (`de`) and Russian (`ru`).
- Main public sections: home, about, services, why-us, gallery, news, contact, impressum, datenschutz.
- Admin area: `/admin`, with protected dashboard pages for news and gallery management.
- Database: Prisma with `NewsArticle` and related site data.
- Uploaded media is stored under `public/uploads`.

## Tech Stack

- Next.js `16.3.0`
- React `19.2.7`
- TypeScript
- Tailwind CSS
- Prisma `6.19.3`
- `sharp` for image processing
- `next-intl` for i18n
- `framer-motion` for UI animations
- `lucide-react` for icons
- `react-markdown` and `remark-gfm` for Markdown article rendering

## Useful Commands

The current PowerShell session may not include Node in `PATH`. If `npm` or `node` is not found, temporarily prepend:

```powershell
$env:Path = 'C:\Program Files\nodejs;' + $env:Path
```

Common commands:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' run dev
& 'C:\Program Files\nodejs\npm.cmd' run build
& 'C:\Program Files\nodejs\npm.cmd' install <package>
```

Build script:

```text
prisma generate && next build
```

If `prisma generate` fails with `EPERM` on `node_modules\.prisma\client\query_engine-windows.dll.node`, a running Next dev server is probably holding the file. Stop only this project's Node processes, then retry the build.

When updating npm dependencies without a Prisma migration, keep both `prisma` and `@prisma/client` on the same existing version and verify them explicitly with `npm ls prisma @prisma/client` after installation.

## Key Directories

- `src/app/[locale]`: public localized routes.
- `src/app/[locale]/news`: public news listing and article pages.
- `src/app/admin/(dashboard)`: protected admin dashboard routes.
- `src/app/api/admin/news/route.ts`: admin CRUD API for news articles and cover uploads.
- `src/app/api/admin/gallery/route.ts`: admin API for gallery uploads and edits.
- `src/components`: shared public components.
- `src/components/news/MarkdownContent.tsx`: shared Markdown renderer for article content and admin preview.
- `src/lib`: shared utilities, auth, Prisma client, site/contact config.
- `src/i18n/dictionaries`: locale dictionaries.
- `prisma/schema.prisma`: Prisma schema.
- `public/uploads/news`: generated article cover images.
- `public/uploads/gallery`: generated gallery images.

## News Articles

Public article route:

- `src/app/[locale]/news/[slug]/page.tsx`
- `src/app/[locale]/news/[slug]/ArticleClient.tsx`

Admin editor:

- `src/app/admin/(dashboard)/news/editor/page.tsx`

News article content is stored as Markdown in `content` and `contentRu`.

Markdown rendering:

- Use `src/components/news/MarkdownContent.tsx`.
- It supports headings, bold/italic, links, lists, blockquotes, horizontal rules, tables, inline code, code blocks, and Markdown images via `react-markdown` + `remark-gfm`.
- The admin editor has a `Markdown / Vorschau` toggle for live preview.

## News Cover Images

News cover upload logic lives in `src/app/api/admin/news/route.ts`.

Current behavior:

- Max upload size: 10 MB.
- Images are converted to WebP.
- Images are auto-rotated with Sharp metadata handling.
- Covers are resized into a `1600x900` maximum frame with `fit: inside` and `withoutEnlargement: true`.
- This intentionally avoids cropping useful image content.
- Actual output dimensions are saved to `coverWidth` and `coverHeight`.

Important:

- Older cover files that were processed before this rule may already be cropped on disk. Re-upload the original source image to regenerate a non-cropped cover.
- Admin cover previews use `aspect-video` and `object-contain` to show the full useful image area.
- Public article cover display uses the stored image dimensions and `h-auto`.

## Gallery Images

Gallery upload logic is separate from news upload logic:

- `src/app/api/admin/gallery/route.ts`
- `scripts/gallery-rename-map.json` is the source map for the one-time SEO filename migration, and `scripts/rename-gallery.mjs --dry` safely audits disk and database state before an idempotent live run.
- Gallery filenames and `GalleryImage.url` records must always be migrated together. The rename script skips missing disk files, updates gallery/news references transactionally, and rolls back a just-renamed file if the database update fails.

Do not assume changes to news cover processing also apply to gallery images.

## Production File Uploads

Current local upload behavior writes generated files into `public/uploads/...` with `fs/promises`.

This is not suitable for production on Vercel:

- Vercel Functions have a read-only filesystem.
- Only temporary scratch space such as `/tmp` is writable.
- Files written at runtime are not persistent across deployments, cold starts, or function instance changes.

Target production architecture:

- Store uploaded images in object storage, preferably Vercel Blob for this Vercel-hosted project.
- Keep Neon/Postgres for structured data only.
- Store image metadata in the database: public URL, blob pathname/key, width, height, size, captions, category, and article/gallery relations.
- Do not store actual image binaries in Neon/Postgres unless there is a strong reason. It would bloat the database, make backups heavier, and serve media less efficiently than CDN-backed object storage.

Likely future implementation:

- Install `@vercel/blob`.
- Create a Vercel Blob store.
- Add `BLOB_READ_WRITE_TOKEN` in Vercel project environment variables and local env as needed.
- Replace `writeFile(...)` and `unlink(...)` in `src/app/api/admin/news/route.ts` and `src/app/api/admin/gallery/route.ts` with Blob `put(...)` and `del(...)`.
- Save full Blob URLs or stable Blob pathnames in Prisma records instead of `/uploads/news/...` or `/uploads/gallery/...`.
- Review upload size strategy: Vercel server uploads are best for smaller files; for larger files use direct/client uploads or reduce admin upload limits.

## Metadata And SEO

Article metadata is generated in `src/app/[locale]/news/[slug]/page.tsx`.

- Title/description fall back from localized fields to German fields.
- OpenGraph image dimensions should use stored `coverWidth` and `coverHeight` when available.
- Sitemap includes static pages and published articles.
- `src/app/sitemap.ts` calls `connection()` before database reads so news publication/unpublication is reflected without rebuilding. Do not let the metadata route become a build-time snapshot again.
- Crawler rules are generated by `src/app/robots.ts`; public crawlers may access the site, while `/api/` and `/admin/` are disallowed.
- `public/llms.txt` is the AI-facing Markdown index of canonical German and Russian pages. Keep it synchronized when public sections or SEO landing routes change.
- `next.config.mjs` serves `/llms.txt` as `text/markdown; charset=utf-8`.
- `src/proxy.ts` must exclude `llms.txt` from locale routing so the root-level static file remains reachable.

Service landing pages:

- Content for the seven bilingual SEO service landings is registered in `src/lib/landings.ts`; the flooring landing content lives in `src/lib/landings/bodenverlegung.ts`.
- The dynamic route is `src/app/[locale]/leistungen/[slug]/page.tsx`; it generates metadata and JSON-LD from the shared landing data.
- Localized landing artwork lives in `public/images/landings`; use `image`, `imageAspect`, and a descriptive localized `imageAlt` in the landing data so DE/RU graphics remain accessible, uncropped, and responsive.
- Landing hero and FAQ motion lives in `src/components/landing/LandingMotion.tsx`; keep the blueprint visible as a low-opacity mobile background, stack long statistics below `sm`, and use the accessible `FaqAccordion` instead of native unanimated `<details>` cards.
- Keep landing links visible on `/[locale]/services` and in `src/components/Footer.tsx` so new pages remain internally linked.
- `src/app/sitemap.ts` creates DE and RU entries from the same `landings` array.
- Prices, timelines, and statistics in landing content are business claims and must be confirmed before production deployment.
- Flooring project statistics (95 m², 3 rooms, 2 weeks) describe one confirmed renovation, not the measured laminate area or a general turnaround guarantee.
- `LandingProject` displays real before/process/after photos. Its news link appears only when the referenced article is published; the static project block remains available if the database lookup fails.
- Optional `project.comparison` adds `BeforeAfterSlider` with two photographs of the same room. It uses a native range input for keyboard/assistive technology, pointer capture for dragging, and `touch-action: pan-y` for vertical mobile scrolling. Keep the full-size layers fixed and reveal via `clip-path`; never resize the image itself as the slider moves.
- Comparison labels and instructions are localized DE/RU. The supplied room photos have slightly different viewpoints; the UI discloses this and preserves their full framing.

## Preparing The 95 m² Renovation Draft

- Bilingual source Markdown and SEO fields: `content/news/wohnungsrenovierung-halle-95m2/`.
- Run `node --env-file=.env scripts/prepare-renovation-draft.mjs` to prepare and validate six selected WebP copies from `public/temp`. The script preserves original photographs and existing output files.
- Add `--create-draft` to create the unpublished article if its slug is absent. It never updates an existing article; subsequent edits belong in the admin editor or must be explicitly synchronized.
- Generated images live in `public/uploads/news/wohnungsrenovierung-halle-95m2/` and must ship with the site before publishing the database draft. Runtime uploads remain a separate storage concern.
- The same directory also contains `zimmer-vergleich-vorher.webp` and `zimmer-vergleich-nachher.webp`, prepared from two separately supplied attachments for the room comparison; the six-photo import script does not regenerate these.
- `public/temp/` is ignored by Git so unselected customer originals are not deployed. Commit only the prepared publication assets.
- GitHub `origin/main` triggers the Vercel Production deployment. Confirm the landing and all six image URLs are live before publishing the related database article; verify both language URLs and sitemap afterwards.
- Source filenames dated 2026-10-22 are the supplied photo batch date; do not treat that as the renovation completion date.
- Public content uses Halle (Saale), without the customer's full street address. Kitchen material is PVC; rooms and corridor use laminate. Doors were sanded, primed and painted with hardware retained.
- Next.js 16.3 `next dev` appends the managed `nextjs-agent-rules` block below to this file.

## Styling Notes

- Tailwind CSS is used throughout.
- Icons should use `lucide-react` when available.
- Public pages use `Header` and `Footer`.
- Admin UI uses compact dashboard-style cards and Tailwind utility classes.
- On `bg-anthracite-900`, use at least `text-anthracite-300` for normal text and `text-brand-orange-light` for orange link text; lighter gray levels and regular brand orange do not meet WCAG AA contrast for small text.
- White text on orange buttons must use `bg-brand-orange-dark` or a darker background. Regular `bg-brand-orange` is below the 4.5:1 contrast threshold for normal-sized text.
- Keep heading levels sequential. On the home page, `TrustBadges` headings are `h2` because they immediately follow the hero `h1`; footer column headings are also `h2`.
- Avoid introducing unrelated broad redesigns when making focused fixes.
- The shared footer includes the owner's German credit `Werbung · Webentwicklung: SaaleWeb` on both locales. Its URL uses `utm_source=onebbau.de`, `utm_medium=referral`, `utm_campaign=footer`, and `utm_content=webentwicklung` for attribution on SaaleWeb; the external link has `rel="sponsored noopener"`.

## Environment Notes

- `.env` is present and used by Next/Prisma.
- Do not expose or document `.env` secrets.
- The local dev server commonly runs on `http://localhost:3000`.

## Recent Important Changes

- Updated Next.js to `16.3.0`, Prisma packages to `6.19.3`, and Sharp to `0.35.3`; refreshed vulnerable transitive dependencies. `npm audit` reports zero known vulnerabilities after the update.
- Added Markdown rendering for news articles with `react-markdown` and `remark-gfm`.
- Added reusable `MarkdownContent` component.
- Added Markdown preview mode to the admin news editor.
- Changed news cover image processing to avoid forced crop and preserve useful image area.
- Updated article OpenGraph metadata to use actual stored cover dimensions.
- Documented that production uploads on Vercel need persistent object storage such as Vercel Blob, not runtime writes to `public/uploads`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
