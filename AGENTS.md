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

- Next.js `16.1.6`
- React `19.2.4`
- TypeScript
- Tailwind CSS
- Prisma `6.19.2`
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

Service landing pages:

- Content for the six bilingual SEO service landings lives in `src/lib/landings.ts`.
- The dynamic route is `src/app/[locale]/leistungen/[slug]/page.tsx`; it generates metadata and JSON-LD from the shared landing data.
- Localized landing artwork lives in `public/images/landings`; use `image`, `imageAspect`, and a descriptive localized `imageAlt` in the landing data so DE/RU graphics remain accessible, uncropped, and responsive.
- Keep landing links visible on `/[locale]/services` and in `src/components/Footer.tsx` so new pages remain internally linked.
- `src/app/sitemap.ts` creates DE and RU entries from the same `landings` array.
- Prices, timelines, and statistics in landing content are business claims and must be confirmed before production deployment.

## Styling Notes

- Tailwind CSS is used throughout.
- Icons should use `lucide-react` when available.
- Public pages use `Header` and `Footer`.
- Admin UI uses compact dashboard-style cards and Tailwind utility classes.
- Avoid introducing unrelated broad redesigns when making focused fixes.

## Environment Notes

- `.env` is present and used by Next/Prisma.
- Do not expose or document `.env` secrets.
- The local dev server commonly runs on `http://localhost:3000`.

## Recent Important Changes

- Added Markdown rendering for news articles with `react-markdown` and `remark-gfm`.
- Added reusable `MarkdownContent` component.
- Added Markdown preview mode to the admin news editor.
- Changed news cover image processing to avoid forced crop and preserve useful image area.
- Updated article OpenGraph metadata to use actual stored cover dimensions.
- Documented that production uploads on Vercel need persistent object storage such as Vercel Blob, not runtime writes to `public/uploads`.
