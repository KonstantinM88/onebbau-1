// scripts/rename-gallery.mjs
// Переименовывает файлы галереи в SEO-имена И обновляет пути в базе данных
// за один запуск. Скрипт идемпотентный: уже переименованные файлы пропускает,
// его можно безопасно запускать повторно.
//
// Запуск (из корня проекта, там где package.json):
//   node scripts/rename-gallery.mjs --dry     ← репетиция, ничего не меняет
//   node scripts/rename-gallery.mjs           ← боевой запуск
//
// Требуется: DATABASE_URL в .env (как для обычной работы сайта).

import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const GALLERY_DIR = path.join(ROOT, 'public', 'uploads', 'gallery');
const MAP_FILE = path.join(__dirname, 'gallery-rename-map.json');

const dry = process.argv.includes('--dry');
const prisma = new PrismaClient();

async function main() {
  const mapping = JSON.parse(await fs.readFile(MAP_FILE, 'utf-8'));
  const entries = Object.entries(mapping);
  console.log(`Карта: ${entries.length} файлов. Режим: ${dry ? 'DRY-RUN (репетиция)' : 'БОЕВОЙ'}\n`);

  let renamed = 0, dbUpdated = 0, skipped = 0, missing = 0;

  for (const [oldName, newName] of entries) {
    const oldPath = path.join(GALLERY_DIR, oldName);
    const newPath = path.join(GALLERY_DIR, newName);
    const oldUrl = `/uploads/gallery/${oldName}`;
    const newUrl = `/uploads/gallery/${newName}`;

    const oldExists = await fs.stat(oldPath).then(() => true).catch(() => false);
    const newExists = await fs.stat(newPath).then(() => true).catch(() => false);

    // Не обновляем БД, если нет ни старого, ни уже переименованного файла.
    // Иначе запись начала бы ссылаться на несуществующий URL.
    if (!oldExists && !newExists) {
      missing++;
      console.log(`⚠ нет файла на диске: ${oldName}`);
      continue;
    }

    if (oldExists && newExists) {
      throw new Error(`Конфликт: одновременно существуют ${oldName} и ${newName}`);
    }

    // 1) файл на диске
    let fileRenamed = false;
    if (oldExists && !newExists) {
      if (!dry) {
        await fs.rename(oldPath, newPath);
        fileRenamed = true;
      }
      renamed++;
      console.log(`✓ файл  ${oldName.slice(0, 50)}… → ${newName}`);
    } else if (newExists) {
      skipped++; // уже переименован ранее
    }

    try {
      if (dry) {
        dbUpdated += await prisma.galleryImage.count({ where: { url: oldUrl } });
      } else {
        // Обновляем связанные записи одной транзакцией.
        const [gallery] = await prisma.$transaction([
          prisma.galleryImage.updateMany({
            where: { url: oldUrl },
            data: { url: newUrl },
          }),
          prisma.newsArticle.updateMany({
            where: { coverUrl: oldUrl },
            data: { coverUrl: newUrl },
          }),
        ]);
        dbUpdated += gallery.count;
      }
    } catch (error) {
      // Если БД не обновилась, возвращаем только что переименованный файл.
      if (fileRenamed) await fs.rename(newPath, oldPath);
      throw error;
    }
  }

  console.log(`\nИтог: файлов переименовано ${renamed}, записей БД обновлено ${dbUpdated},`);
  console.log(`пропущено (уже готово) ${skipped}, не найдено на диске ${missing}.`);
  if (dry) console.log('\nЭто была репетиция. Для боевого запуска: node scripts/rename-gallery.mjs');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
