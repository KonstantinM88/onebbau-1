# Renovation project: Halle (Saale), 95 m²

Publication approved by the site owner. The database controls article visibility; Git contains the bilingual source, landing code and selected publication assets.

- German copy: [de.md](de.md)
- Russian copy: [ru.md](ru.md)
- Titles, excerpts and SEO fields: [article.json](article.json)
- News slug: `wohnungsrenovierung-halle-95m2-zwei-wochen`
- Landing: `/de/leistungen/bodenverlegung-halle` and `/ru/leistungen/bodenverlegung-halle`

All facts refer to one three-room apartment. The two weeks cover the whole renovation; 95 m² is the apartment area. The customer address and an unconfirmed completion date are omitted. The kitchen's PVC result photo is excluded from the final-result selection.

## Selected photographs

| Source in public/temp | Generated WebP filename | Use |
| --- | --- | --- |
| photo_2026-10-22_21-29-08.jpg | flur-vorher.webp | Corridor during demolition |
| photo_2026-10-22_21-28-40.jpg | boden-demontage.webp | Demolition detail |
| photo_2026-10-22_21-28-31.jpg | laminat-verlegung.webp | Installation in progress |
| photo_2026-10-22_21-27-48.jpg | flur-nachher.webp | Finished corridor and article cover |
| photo_2026-10-22_21-27-52.jpg | zimmer-fertig.webp | Finished room and landing photo |
| photo_2026-10-22_21-27-57.jpg | laminat-detail.webp | Floor, skirting and room transition |

Outputs are stored in `public/uploads/news/wohnungsrenovierung-halle-95m2/`. Original photographs are untouched. WebP conversion preserves full framing and does not enlarge images. The cover fits inside 1600 × 900; other images fit inside 1600 × 1280.

The landing also uses two additional supplied attachments for the interactive room comparison: `zimmer-vergleich-vorher.webp` (exposed floor) and `zimmer-vergleich-nachher.webp` (finished laminate). These preserve the original framing; the viewpoints differ slightly. They are independent of the six-photo import script and do not change the article cover or Markdown images. The original batch was subsequently moved from `public/temp` to the Windows Recycle Bin at the owner's request.

## Review and publication

Review the database draft in `/admin/news` using the Markdown preview and both language tabs. The import script creates only an absent draft; it intentionally does not overwrite subsequent admin edits.

Deploy the prepared media and landing code before publishing the news through the admin editor. Review the publication date there; it is not a confirmed project completion date. The landing's link to the news appears once the article is published. Sitemap, services overview and footer derive landing links from the shared landing registry; `llms.txt` also includes both new URLs.

## Search content

The service page covers local intent for Bodenverlegung, Laminat verlegen and PVC verlegen in Halle (Saale). The article documents the completed renovation rather than duplicating the service description. Both languages have localized titles, descriptions, image alternatives and internal links. The shared routes generate canonical/hreflang, OpenGraph and structured data (Service/FAQPage on the landing; BlogPosting on the article). No ranking or AI citation outcome is guaranteed by this implementation.
