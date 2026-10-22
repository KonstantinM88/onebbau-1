// Local media preparation; add --create-draft to insert an unpublished article.
// node --env-file=.env scripts/prepare-renovation-draft.mjs --create-draft
// Existing articles and media are never overwritten.
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../', import.meta.url));
const contentDir = path.join(root, 'content/news/wohnungsrenovierung-halle-95m2');
const urlDir = '/uploads/news/wohnungsrenovierung-halle-95m2';
const outputDir = path.join(root, 'public', urlDir);
const selection = [
  ['21-29-08', 'flur-vorher'],
  ['21-28-40', 'boden-demontage'],
  ['21-28-31', 'laminat-verlegung'],
  ['21-27-48', 'flur-nachher'],
  ['21-27-52', 'zimmer-fertig'],
  ['21-27-57', 'laminat-detail'],
];

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  for (const [time, name] of selection) {
    const destination = path.join(outputDir, `${name}.webp`);
    try {
      await fs.access(destination);
      console.log(`Existing media: ${name}.webp`);
      continue;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    const source = path.join(root, 'public/temp', `photo_2026-10-22_${time}.jpg`);
    const buffer = await sharp(source).rotate()
      .resize(1600, name === 'flur-nachher' ? 900 : 1280, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 88 }).toBuffer();
    await fs.writeFile(destination, buffer, { flag: 'wx' });
    console.log(`Prepared: ${name}.webp (${buffer.length} bytes)`);
  }

  const article = JSON.parse(await fs.readFile(path.join(contentDir, 'article.json'), 'utf8'));
  article.content = await fs.readFile(path.join(contentDir, 'de.md'), 'utf8');
  article.contentRu = await fs.readFile(path.join(contentDir, 'ru.md'), 'utf8');
  for (const markdown of [article.content, article.contentRu]) {
    const images = [...markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)];
    if (images.length !== selection.length) throw new Error('Unexpected article image count');
    for (const [, url] of images) await fs.access(path.join(root, 'public', url));
  }
  article.coverUrl = `${urlDir}/flur-nachher.webp`;
  const cover = await sharp(path.join(outputDir, 'flur-nachher.webp')).metadata();
  article.coverWidth = cover.width;
  article.coverHeight = cover.height;

  if (!process.argv.includes('--create-draft')) {
    console.log(`Validated bilingual content and media for ${article.slug}. No database changes.`);
    return;
  }
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  try {
    const existing = await prisma.newsArticle.findUnique({ where: { slug: article.slug }, select: { id: true, published: true } });
    if (existing) {
      console.log(`Article already exists (${existing.id}, published=${existing.published}); left unchanged.`);
      return;
    }
    const created = await prisma.newsArticle.create({ data: { ...article, published: false }, select: { id: true, slug: true, published: true } });
    console.log(JSON.stringify(created, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(() => {
  console.error('Draft preparation failed. Check source media, file permissions and database connectivity; no existing article was overwritten.');
  process.exitCode = 1;
});
