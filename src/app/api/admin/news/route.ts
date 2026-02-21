// src/app/api/admin/news/route.ts
import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'news');
const COVER_WIDTH = 1200;
const COVER_HEIGHT = 630; // OG image ratio
const WEBP_QUALITY = 85;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function requireSession() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Nicht autorisiert' }, { status: 401 });
  return null;
}

// GET — list all articles (admin)
export async function GET() {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  try {
    const articles = await prisma.newsArticle.findMany({
      orderBy: { publishedAt: 'desc' },
    });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json({ error: 'Fehler beim Laden' }, { status: 500 });
  }
}

// POST — create article (with optional cover image)
export async function POST(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const title = (formData.get('title') as string)?.trim() || '';
    const titleRu = (formData.get('titleRu') as string)?.trim() || '';
    const excerpt = (formData.get('excerpt') as string)?.trim() || '';
    const excerptRu = (formData.get('excerptRu') as string)?.trim() || '';
    const content = (formData.get('content') as string) || '';
    const contentRu = (formData.get('contentRu') as string) || '';
    const metaTitle = (formData.get('metaTitle') as string)?.trim() || null;
    const metaTitleRu = (formData.get('metaTitleRu') as string)?.trim() || null;
    const metaDesc = (formData.get('metaDesc') as string)?.trim() || null;
    const metaDescRu = (formData.get('metaDescRu') as string)?.trim() || null;
    const published = formData.get('published') === 'true';
    const publishedAt = formData.get('publishedAt')
      ? new Date(formData.get('publishedAt') as string)
      : new Date();
    const coverFile = formData.get('cover') as File | null;

    if (!title) {
      return NextResponse.json({ error: 'Titel ist erforderlich' }, { status: 400 });
    }

    // Generate unique slug
    let baseSlug = slugify(title);
    if (!baseSlug) baseSlug = 'artikel';
    let slug = baseSlug;
    let attempt = 0;
    while (await prisma.newsArticle.findUnique({ where: { slug } })) {
      attempt++;
      slug = `${baseSlug}-${attempt}`;
    }

    // Process cover image
    let coverUrl: string | null = null;
    let coverWidth = 0;
    let coverHeight = 0;

    if (coverFile && coverFile.size > 0) {
      if (coverFile.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'Datei zu groß (max 10 MB)' }, { status: 400 });
      }

      await mkdir(UPLOAD_DIR, { recursive: true });
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      const image = sharp(buffer, { failOn: 'none' });
      const meta = await image.metadata();

      if (!meta.width || !meta.height) {
        return NextResponse.json({ error: 'Ungültige Bilddatei' }, { status: 400 });
      }

      // Resize to cover dimensions (crop to fill)
      const webpBuffer = await image
        .resize(COVER_WIDTH, COVER_HEIGHT, { fit: 'cover', position: 'center' })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();

      const filename = `${slug}_${Date.now()}_${randomUUID().slice(0, 8)}.webp`;
      await writeFile(path.join(UPLOAD_DIR, filename), webpBuffer);

      coverUrl = `/uploads/news/${filename}`;
      coverWidth = COVER_WIDTH;
      coverHeight = COVER_HEIGHT;
    }

    const article = await prisma.newsArticle.create({
      data: {
        slug,
        title,
        titleRu,
        excerpt,
        excerptRu,
        content,
        contentRu,
        metaTitle,
        metaTitleRu,
        metaDesc,
        metaDescRu,
        coverUrl,
        coverWidth,
        coverHeight,
        published,
        publishedAt,
      },
    });

    return NextResponse.json({ success: true, article });
  } catch (error) {
    console.error('News create error:', error);
    return NextResponse.json({ error: 'Fehler beim Erstellen' }, { status: 500 });
  }
}

// PATCH — update article
export async function PATCH(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  try {
    const formData = await request.formData();
    const id = (formData.get('id') as string)?.trim();
    if (!id) return NextResponse.json({ error: 'ID fehlt' }, { status: 400 });

    const existing = await prisma.newsArticle.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: 'Artikel nicht gefunden' }, { status: 404 });

    const data: Record<string, unknown> = {};

    // Text fields
    for (const field of ['title', 'titleRu', 'excerpt', 'excerptRu', 'content', 'contentRu', 'metaTitle', 'metaTitleRu', 'metaDesc', 'metaDescRu']) {
      const val = formData.get(field);
      if (val !== null) {
        data[field] = typeof val === 'string' ? val.trim() : val;
      }
    }

    // Published
    const pub = formData.get('published');
    if (pub !== null) data.published = pub === 'true';

    // PublishedAt
    const pubAt = formData.get('publishedAt');
    if (pubAt && typeof pubAt === 'string') data.publishedAt = new Date(pubAt);

    // Slug update (if title changed)
    const newSlug = formData.get('slug');
    if (newSlug && typeof newSlug === 'string') {
      const s = slugify(newSlug);
      if (s && s !== existing.slug) {
        const conflict = await prisma.newsArticle.findUnique({ where: { slug: s } });
        if (!conflict) data.slug = s;
      }
    }

    // Cover image
    const coverFile = formData.get('cover') as File | null;
    if (coverFile && coverFile.size > 0) {
      if (coverFile.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'Datei zu groß (max 10 MB)' }, { status: 400 });
      }

      await mkdir(UPLOAD_DIR, { recursive: true });
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      const webpBuffer = await sharp(buffer, { failOn: 'none' })
        .resize(COVER_WIDTH, COVER_HEIGHT, { fit: 'cover', position: 'center' })
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();

      const filename = `${existing.slug}_${Date.now()}_${randomUUID().slice(0, 8)}.webp`;
      await writeFile(path.join(UPLOAD_DIR, filename), webpBuffer);

      // Delete old cover
      if (existing.coverUrl) {
        try {
          await unlink(path.join(process.cwd(), 'public', existing.coverUrl.replace(/^\/+/, '')));
        } catch { /* ignore */ }
      }

      data.coverUrl = `/uploads/news/${filename}`;
      data.coverWidth = COVER_WIDTH;
      data.coverHeight = COVER_HEIGHT;
    }

    // Remove cover
    if (formData.get('removeCover') === 'true' && existing.coverUrl) {
      try {
        await unlink(path.join(process.cwd(), 'public', existing.coverUrl.replace(/^\/+/, '')));
      } catch { /* ignore */ }
      data.coverUrl = null;
      data.coverWidth = 0;
      data.coverHeight = 0;
    }

    const updated = await prisma.newsArticle.update({ where: { id }, data });
    return NextResponse.json({ success: true, article: updated });
  } catch (error) {
    console.error('News update error:', error);
    return NextResponse.json({ error: 'Fehler beim Aktualisieren' }, { status: 500 });
  }
}

// DELETE — remove article
export async function DELETE(request: NextRequest) {
  const unauthorized = await requireSession();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID fehlt' }, { status: 400 });

    const article = await prisma.newsArticle.findUnique({ where: { id } });
    if (!article) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 });

    // Delete cover file
    if (article.coverUrl) {
      try {
        await unlink(path.join(process.cwd(), 'public', article.coverUrl.replace(/^\/+/, '')));
      } catch { /* ignore */ }
    }

    await prisma.newsArticle.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Fehler beim Löschen' }, { status: 500 });
  }
}