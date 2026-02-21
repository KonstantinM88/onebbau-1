// src/app/admin/(dashboard)/news/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  FileText,
  Search,
  Newspaper,
} from 'lucide-react';

type Article = {
  id: string;
  slug: string;
  title: string;
  titleRu: string;
  excerpt: string;
  coverUrl: string | null;
  published: boolean;
  publishedAt: string;
  createdAt: string;
};

export default function AdminNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadArticles = async () => {
    try {
      const res = await fetch('/api/admin/news');
      if (res.ok) setArticles(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadArticles(); }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch('/api/admin/news', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
      setDeleteId(null);
    }
  };

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.titleRu.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-anthracite-900">
            <Newspaper className="h-6 w-6 text-brand-orange" />
            Neuigkeiten
          </h1>
          <p className="mt-1 text-sm text-anthracite-400">
            {articles.length} {articles.length === 1 ? 'Artikel' : 'Artikel'} insgesamt
          </p>
        </div>
        <Link
          href="/admin/news/editor"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-orange/20 transition-all hover:bg-brand-orange-dark hover:shadow-brand-orange/30"
        >
          <Plus className="h-4 w-4" />
          Neuer Artikel
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-anthracite-300" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Artikel suchen..."
          className="w-full rounded-xl border border-anthracite-200 bg-white py-2.5 pl-10 pr-4 text-sm text-anthracite-900 shadow-sm outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand-orange/30 border-t-brand-orange" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-anthracite-200 bg-white p-12 text-center">
          <FileText className="mx-auto mb-3 h-10 w-10 text-anthracite-200" />
          <p className="text-anthracite-400">
            {search ? 'Keine Artikel gefunden' : 'Noch keine Artikel vorhanden'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((article) => (
            <div
              key={article.id}
              className="group flex items-start gap-4 rounded-2xl border border-anthracite-100 bg-white p-4 shadow-sm transition-all hover:border-brand-orange/20 hover:shadow-md"
            >
              {/* Cover thumbnail */}
              <div className="hidden h-20 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-anthracite-50 sm:block">
                {article.coverUrl ? (
                  <img
                    src={article.coverUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <FileText className="h-6 w-6 text-anthracite-200" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-anthracite-900">
                      {article.title}
                    </h3>
                    {article.titleRu && (
                      <p className="truncate text-xs text-anthracite-400 mt-0.5">{article.titleRu}</p>
                    )}
                  </div>
                  <span
                    className={`flex-shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      article.published
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {article.published ? (
                      <><Eye className="h-3 w-3" /> Veröffentlicht</>
                    ) : (
                      <><EyeOff className="h-3 w-3" /> Entwurf</>
                    )}
                  </span>
                </div>

                {article.excerpt && (
                  <p className="mt-1.5 line-clamp-1 text-sm text-anthracite-400">{article.excerpt}</p>
                )}

                <div className="mt-2.5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-xs text-anthracite-300">
                    <Calendar className="h-3 w-3" />
                    {formatDate(article.publishedAt)}
                  </span>
                  <span className="text-xs text-anthracite-200">/de/news/{article.slug}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-shrink-0 items-center gap-1">
                <Link
                  href={`/admin/news/editor?id=${article.id}`}
                  className="rounded-lg p-2 text-anthracite-400 transition-colors hover:bg-brand-orange/10 hover:text-brand-orange"
                  title="Bearbeiten"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                <a
                  href={`/de/news/${article.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg p-2 text-anthracite-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                  title="Vorschau"
                >
                  <Eye className="h-4 w-4" />
                </a>
                <button
                  onClick={() => setDeleteId(article.id)}
                  className="rounded-lg p-2 text-anthracite-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  title="Löschen"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-anthracite-900">Artikel löschen?</h3>
            <p className="mt-2 text-sm text-anthracite-500">
              Dieser Vorgang kann nicht rückgängig gemacht werden.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setDeleteId(null)}
                className="rounded-lg border border-anthracite-200 px-4 py-2 text-sm font-medium text-anthracite-600 hover:bg-anthracite-50"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}