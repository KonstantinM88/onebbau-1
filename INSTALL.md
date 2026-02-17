# Onebbau — Установка админ-панели и галереи

## 1. Установить новые пакеты

```bash
npm install sharp jose
```

## 2. Добавить переменные в `.env`

```env
# Admin Panel
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="ваш-надёжный-пароль"
ADMIN_JWT_SECRET="случайная-строка-минимум-32-символа"
```

Сгенерировать секрет: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

## 3. Обновить базу данных

```bash
npx prisma db push
```

Это создаст таблицу `GalleryImage` в PostgreSQL.

## 4. Создать папку для загрузок

```bash
mkdir -p public/uploads/gallery
```

## 5. Файлы для добавления/замены

### Новые файлы:
```
src/lib/auth.ts                              — JWT авторизация
src/middleware.ts                             — роутинг + защита /admin
src/app/admin/login/page.tsx                 — страница входа
src/app/admin/layout.tsx                     — лейаут админки (проверка сессии)
src/app/admin/AdminShell.tsx                 — сайдбар + навигация
src/app/admin/page.tsx                       — редирект на /admin/gallery
src/app/admin/gallery/page.tsx               — управление галереей
src/app/api/auth/login/route.ts              — API логина
src/app/api/auth/logout/route.ts             — API выхода
src/app/api/admin/gallery/route.ts           — API загрузки/удаления фото
src/app/[locale]/galerie/page.tsx            — публичная страница галереи
src/app/[locale]/galerie/GalerieClient.tsx   — клиентский компонент галереи
```

### Обновлённые файлы:
```
prisma/schema.prisma                         — добавлена модель GalleryImage
.env.example                                 — добавлены ADMIN_* переменные
messages/de.json                             — добавлен ключ gallery.viewAll
messages/ru.json                             — добавлен ключ gallery.viewAll
src/components/Header.tsx                    — галерея → ссылка на /galerie
src/components/sections/Gallery.tsx          — кнопка "Все проекты"
```

## 6. Сборка и запуск

```bash
npm run build
npm start
```

## Использование

### Вход в админку
Перейти на: `https://ваш-сайт.de/admin`

Логин и пароль берутся из `.env` (ADMIN_USERNAME / ADMIN_PASSWORD).

### Загрузка фото
1. Войти в админку
2. Нажать «Bilder hochladen»
3. Выбрать категорию
4. Перетащить фото или выбрать через проводник
5. Фото автоматически конвертируются в WebP (качество 82%, макс. ширина 1920px)

### Галерея на сайте
- Полная галерея: `/de/galerie` или `/ru/galerie`
- На главной странице — 6 статичных превью + кнопка «Все проекты»

## Структура загрузок

```
public/uploads/gallery/
├── bathroom_1739...webp
├── facade_1739...webp
└── ...
```

Все загруженные фото хранятся как WebP в `public/uploads/gallery/`.
Метаданные (категория, описание, размеры) — в таблице `GalleryImage` в PostgreSQL.

## Безопасность

- Пароль хранится в `.env` (не в БД)
- JWT токен в httpOnly cookie (7 дней)
- Все API-эндпоинты `/api/admin/*` проверяют сессию
- Middleware защищает `/admin/*` роуты
