# Onebbau – Bau- und Handwerksleistungen

Moderne, professionelle Website für Onebbau – Bau- und Handwerksunternehmen in Halle (Saale).

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Sprachen**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **Animationen**: Framer Motion
- **Icons**: Lucide React
- **i18n**: next-intl (DE / RU)
- **Datenbank**: Prisma ORM + PostgreSQL (Neon.tech)

## Installation

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Umgebungsvariablen konfigurieren
cp .env.example .env
# → DATABASE_URL, NEXT_PUBLIC_PHONE, NEXT_PUBLIC_EMAIL eintragen

# 3. Datenbank erstellen
npx prisma db push

# 4. Entwicklungsserver starten
npm run dev
```

## Bilder hinzufügen

Folgende Bilder werden benötigt:

```
public/images/
├── hero-bg.png          ← Baustelle / Gebäude (Hero-Hintergrund)
├── about.png            ← Team / Arbeiter
└── gallery/
    ├── bathroom.jpg     ← Badezimmer-Renovierung
    ├── drywall.jpg      ← Trockenbauarbeiten
    ├── facade.jpg       ← Fassadensanierung
    ├── flooring.jpg     ← Bodenverlegung
    ├── terrace.jpg      ← Terrassenbau
    └── room.jpg         ← Raumrenovierung
```

## Produktion

```bash
npm run build
npm start
```

## Struktur

```
src/
├── app/
│   ├── [locale]/         ← Sprachbasiertes Routing (de/ru)
│   │   ├── layout.tsx    ← Hauptlayout mit Metadaten
│   │   ├── page.tsx      ← Startseite
│   │   ├── impressum/    ← Impressum
│   │   └── datenschutz/  ← Datenschutz
│   └── api/contact/      ← Kontaktformular API
├── components/           ← React-Komponenten
├── i18n/                 ← Internationalisierung
│   ├── config.ts
│   ├── request.ts
│   └── dictionaries/     ← DE + RU Übersetzungen
└── lib/
    └── prisma.ts         ← Datenbank-Client
```
