// src/app/admin/(dashboard)/news/editor/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Eye,
  ImagePlus,
  X,
  Calendar,
  Globe,
  FileText,
  AlertCircle,
  Check,
  Loader2,
  Info,
} from 'lucide-react';

type Article = {
  id: string;
  slug: string;
  title: string;
  titleRu: string;
  excerpt: string;
  excerptRu: string;
  content: string;
  contentRu: string;
  metaTitle: string | null;
  metaTitleRu: string | null;
  metaDesc: string | null;
  metaDescRu: string | null;
  coverUrl: string | null;
  published: boolean;
  publishedAt: string;
};

const COVER_HINT = 'Empfohlene Größe: 1200×630 (16:9). Formate: JPG, PNG, GIF, WebP, AVIF. Max 10 MB. Automatische Konvertierung zu WebP.';

function LangTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
        active
          ? 'bg-white text-anthracite-900 shadow-sm'
          : 'text-anthracite-400 hover:text-anthracite-600'
      }`}
    >
      {label}
    </button>
  );
}

function FieldLabel({ label, hint, charCount, maxChars }: { label: string; hint?: string; charCount?: number; maxChars?: number }) {
  return (
    <div className="mb-1.5 flex items-center justify-between gap-2">
      <label className="text-sm font-semibold text-anthracite-700">{label}</label>
      <div className="flex items-center gap-2">
        {hint && (
          <span className="text-[11px] text-anthracite-300" title={hint}>
            <Info className="inline h-3 w-3" />
          </span>
        )}
        {charCount !== undefined && maxChars && (
          <span className={`text-[11px] tabular-nums ${charCount > maxChars ? 'text-red-500 font-semibold' : 'text-anthracite-300'}`}>
            {charCount}/{maxChars}
          </span>
        )}
      </div>
    </div>
  );
}

export default function NewsEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const isEdit = !!editId;

  const [lang, setLang] = useState<'de' | 'ru'>('de');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!editId);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showSeo, setShowSeo] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [titleRu, setTitleRu] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [excerptRu, setExcerptRu] = useState('');
  const [content, setContent] = useState('');
  const [contentRu, setContentRu] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaTitleRu, setMetaTitleRu] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [metaDescRu, setMetaDescRu] = useState('');
  const [published, setPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState('');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  // Load article for editing
  useEffect(() => {
    if (!editId) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setPublishedAt(now.toISOString().slice(0, 16));
      return;
    }

    (async () => {
      try {
        const res = await fetch('/api/admin/news');
        if (!res.ok) throw new Error();
        const articles: Article[] = await res.json();
        const a = articles.find((x) => x.id === editId);
        if (!a) { router.push('/admin/news'); return; }

        setTitle(a.title);
        setTitleRu(a.titleRu);
        setExcerpt(a.excerpt);
        setExcerptRu(a.excerptRu);
        setContent(a.content);
        setContentRu(a.contentRu);
        setMetaTitle(a.metaTitle || '');
        setMetaTitleRu(a.metaTitleRu || '');
        setMetaDesc(a.metaDesc || '');
        setMetaDescRu(a.metaDescRu || '');
        setPublished(a.published);
        setCoverUrl(a.coverUrl);

        const d = new Date(a.publishedAt);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        setPublishedAt(d.toISOString().slice(0, 16));
      } catch {
        router.push('/admin/news');
      } finally {
        setLoading(false);
      }
    })();
  }, [editId, router]);

  // Cover file selection
  const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    setCoverUrl(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  // Save
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setToast({ type: 'error', text: 'Titel (DE) ist erforderlich' });
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      if (editId) fd.append('id', editId);
      fd.append('title', title);
      fd.append('titleRu', titleRu);
      fd.append('excerpt', excerpt);
      fd.append('excerptRu', excerptRu);
      fd.append('content', content);
      fd.append('contentRu', contentRu);
      fd.append('metaTitle', metaTitle);
      fd.append('metaTitleRu', metaTitleRu);
      fd.append('metaDesc', metaDesc);
      fd.append('metaDescRu', metaDescRu);
      fd.append('published', String(published));
      fd.append('publishedAt', publishedAt || new Date().toISOString());
      if (coverFile) fd.append('cover', coverFile);
      if (!coverUrl && !coverFile && isEdit) fd.append('removeCover', 'true');

      const res = await fetch('/api/admin/news', {
        method: isEdit ? 'PATCH' : 'POST',
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Fehler');

      setToast({ type: 'success', text: isEdit ? 'Gespeichert!' : 'Artikel erstellt!' });
      if (!isEdit) {
        setTimeout(() => router.push('/admin/news'), 800);
      }
    } catch (err: unknown) {
      setToast({ type: 'error', text: err instanceof Error ? err.message : 'Fehler beim Speichern' });
    } finally {
      setSaving(false);
    }
  };

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const displayCover = coverPreview || coverUrl;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave}>
      {/* Top bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/admin/news')}
            className="rounded-xl border border-anthracite-200 bg-white p-2.5 text-anthracite-500 shadow-sm hover:bg-anthracite-50"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-anthracite-900">
              {isEdit ? 'Artikel bearbeiten' : 'Neuer Artikel'}
            </h1>
            <p className="text-xs text-anthracite-400">
              {isEdit ? 'Änderungen werden live übernommen' : 'Erstelle einen neuen Beitrag'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Publish toggle */}
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all ${
              published
                ? 'border-green-300 bg-green-50 text-green-700'
                : 'border-amber-300 bg-amber-50 text-amber-700'
            }`}
          >
            {published ? <Eye className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            {published ? 'Veröffentlicht' : 'Entwurf'}
          </button>

          {/* Save */}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-orange/20 transition-all hover:bg-brand-orange-dark disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Speichern
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
        {/* Main content */}
        <div className="space-y-5">
          {/* Language tabs */}
          <div className="rounded-xl bg-anthracite-100 p-1 flex gap-1">
            <LangTab active={lang === 'de'} label="🇩🇪 Deutsch" onClick={() => setLang('de')} />
            <LangTab active={lang === 'ru'} label="🇷🇺 Russisch" onClick={() => setLang('ru')} />
          </div>

          {/* Title */}
          <div className="rounded-2xl border border-anthracite-100 bg-white p-5 shadow-sm">
            <FieldLabel
              label={lang === 'de' ? 'Überschrift *' : 'Заголовок'}
              hint={lang === 'de' ? 'Hauptüberschrift des Artikels' : 'Заголовок статьи'}
              charCount={lang === 'de' ? title.length : titleRu.length}
              maxChars={120}
            />
            <input
              type="text"
              value={lang === 'de' ? title : titleRu}
              onChange={(e) => lang === 'de' ? setTitle(e.target.value) : setTitleRu(e.target.value)}
              placeholder={lang === 'de' ? 'Titel des Artikels eingeben...' : 'Введите заголовок статьи...'}
              className="w-full rounded-xl border border-anthracite-200 bg-anthracite-50/50 px-4 py-3 text-base text-anthracite-900 outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              maxLength={200}
            />
            {lang === 'de' && title && (
              <p className="mt-2 text-[11px] text-anthracite-300">
                Slug: /news/{title.toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80)}
              </p>
            )}
          </div>

          {/* Excerpt */}
          <div className="rounded-2xl border border-anthracite-100 bg-white p-5 shadow-sm">
            <FieldLabel
              label={lang === 'de' ? 'Kurzbeschreibung' : 'Краткое описание'}
              charCount={lang === 'de' ? excerpt.length : excerptRu.length}
              maxChars={160}
            />
            <textarea
              value={lang === 'de' ? excerpt : excerptRu}
              onChange={(e) => lang === 'de' ? setExcerpt(e.target.value) : setExcerptRu(e.target.value)}
              placeholder={lang === 'de' ? 'Kurze Zusammenfassung für Vorschau und SEO...' : 'Краткое описание для превью и SEO...'}
              rows={3}
              maxLength={300}
              className="w-full resize-none rounded-xl border border-anthracite-200 bg-anthracite-50/50 px-4 py-3 text-sm text-anthracite-900 outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
          </div>

          {/* Content */}
          <div className="rounded-2xl border border-anthracite-100 bg-white p-5 shadow-sm">
            <FieldLabel
              label={lang === 'de' ? 'Text *' : 'Текст'}
              charCount={lang === 'de' ? content.length : contentRu.length}
              maxChars={50000}
            />
            <textarea
              value={lang === 'de' ? content : contentRu}
              onChange={(e) => lang === 'de' ? setContent(e.target.value) : setContentRu(e.target.value)}
              placeholder={lang === 'de' ? 'Artikeltext eingeben...' : 'Введите текст статьи...'}
              rows={16}
              className="w-full resize-y rounded-xl border border-anthracite-200 bg-anthracite-50/50 px-4 py-3 font-mono text-sm text-anthracite-900 outline-none transition-colors focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
            />
            <p className="mt-2 text-[11px] text-anthracite-300">
              Absätze mit Leerzeile trennen. Überschriften mit ## markieren. Listen mit – beginnen.
            </p>
          </div>

          {/* SEO section */}
          <div className="rounded-2xl border border-anthracite-100 bg-white shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSeo(!showSeo)}
              className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-anthracite-50/50 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-anthracite-700">
                <Globe className="h-4 w-4 text-brand-orange" />
                SEO и метаданные
              </span>
              <span className="text-xs text-anthracite-400">{showSeo ? '▲' : '▼'}</span>
            </button>

            {showSeo && (
              <div className="border-t border-anthracite-100 p-5 space-y-4">
                <div>
                  <FieldLabel
                    label={lang === 'de' ? 'Meta-Titel' : 'Мета-заголовок'}
                    charCount={lang === 'de' ? metaTitle.length : metaTitleRu.length}
                    maxChars={60}
                  />
                  <input
                    type="text"
                    value={lang === 'de' ? metaTitle : metaTitleRu}
                    onChange={(e) => lang === 'de' ? setMetaTitle(e.target.value) : setMetaTitleRu(e.target.value)}
                    placeholder={lang === 'de' ? 'SEO-Titel (leer = Überschrift)' : 'SEO-заголовок (пусто = заголовок)'}
                    maxLength={70}
                    className="w-full rounded-xl border border-anthracite-200 bg-anthracite-50/50 px-4 py-2.5 text-sm text-anthracite-900 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                  />
                </div>
                <div>
                  <FieldLabel
                    label={lang === 'de' ? 'Meta-Beschreibung' : 'Мета-описание'}
                    charCount={lang === 'de' ? metaDesc.length : metaDescRu.length}
                    maxChars={160}
                  />
                  <textarea
                    value={lang === 'de' ? metaDesc : metaDescRu}
                    onChange={(e) => lang === 'de' ? setMetaDesc(e.target.value) : setMetaDescRu(e.target.value)}
                    placeholder={lang === 'de' ? 'SEO-Beschreibung (leer = Kurzbeschreibung)' : 'SEO-описание (пусто = краткое описание)'}
                    rows={2}
                    maxLength={200}
                    className="w-full resize-none rounded-xl border border-anthracite-200 bg-anthracite-50/50 px-4 py-2.5 text-sm text-anthracite-900 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Cover image */}
          <div className="rounded-2xl border border-anthracite-100 bg-white p-5 shadow-sm">
            <FieldLabel label="Обложка" />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleCoverSelect}
              className="hidden"
            />

            {displayCover ? (
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={displayCover}
                  alt="Cover"
                  className="w-full aspect-[1200/630] object-cover"
                />
                <button
                  type="button"
                  onClick={removeCover}
                  className="absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-2 right-2 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-medium text-white hover:bg-black/70"
                >
                  Ändern
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-anthracite-200 px-4 py-8 text-anthracite-400 transition-colors hover:border-brand-orange/40 hover:text-brand-orange"
              >
                <ImagePlus className="h-8 w-8" />
                <span className="text-sm font-medium">Выберите файл</span>
              </button>
            )}

            <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-anthracite-300">
              <Info className="mt-0.5 h-3 w-3 flex-shrink-0" />
              {COVER_HINT}
            </p>
          </div>

          {/* Publish date */}
          <div className="rounded-2xl border border-anthracite-100 bg-white p-5 shadow-sm">
            <FieldLabel label="Публикация с" />
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-anthracite-300" />
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full rounded-xl border border-anthracite-200 bg-anthracite-50/50 py-2.5 pl-10 pr-4 text-sm text-anthracite-900 outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>
          </div>

          {/* Preview card */}
          <div className="rounded-2xl border border-anthracite-100 bg-white p-5 shadow-sm">
            <FieldLabel label="Предпросмотр обложки" />
            <div className="rounded-xl border border-anthracite-100 bg-anthracite-50 p-3">
              {displayCover && (
                <div className="mb-3 overflow-hidden rounded-lg aspect-[1200/630]">
                  <img src={displayCover} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <p className="text-sm font-semibold text-anthracite-900 line-clamp-2">{title || 'Überschrift...'}</p>
              <p className="mt-1 text-xs text-anthracite-400 line-clamp-2">{excerpt || 'Kurzbeschreibung...'}</p>
              <p className="mt-2 text-[11px] text-anthracite-300">onebbau.de/news/...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-xl ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.text}
        </div>
      )}
    </form>
  );
}