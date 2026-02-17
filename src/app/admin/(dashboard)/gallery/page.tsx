'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  CloudUpload,
  Edit3,
  ImagePlus,
  Images,
  Loader2,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from 'lucide-react';

type GalleryImage = {
  id: string;
  url: string;
  filename: string | null;
  category: string;
  caption: string | null;
  captionRu: string | null;
  sortOrder: number;
  width: number;
  height: number;
  size: number;
  createdAt: string;
};

type QueueItem = {
  id: string;
  file: File;
  preview: string;
};

type Notice = {
  tone: 'info' | 'success' | 'error';
  text: string;
};

const CATEGORIES = [
  { value: 'bathroom', de: 'Badezimmer', ru: 'Ванная' },
  { value: 'drywall', de: 'Trockenbau', ru: 'Гипсокартон' },
  { value: 'facade', de: 'Fassade', ru: 'Фасад' },
  { value: 'terrace', de: 'Terrasse', ru: 'Терраса' },
  { value: 'flooring', de: 'Bodenbeläge', ru: 'Полы' },
  { value: 'interior', de: 'Innenausbau', ru: 'Интерьер' },
  { value: 'garden', de: 'Garten', ru: 'Сад' },
  { value: 'masonry', de: 'Massivbau', ru: 'Кладка' },
];

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ACCEPTED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/avif',
]);

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function noticeClasses(tone: Notice['tone']) {
  if (tone === 'success') return 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200';
  if (tone === 'error') return 'border-rose-400/35 bg-rose-500/10 text-rose-200';
  return 'border-cyan-400/35 bg-cyan-500/10 text-cyan-100';
}

const cardGlowClass =
  'border border-cyan-400/30 bg-[#050c34]/90 shadow-[0_0_0_1px_rgba(34,211,238,0.08),0_0_40px_rgba(56,189,248,0.22)]';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('interior');
  const [captionDe, setCaptionDe] = useState('');
  const [captionRu, setCaptionRu] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editCategory, setEditCategory] = useState('interior');
  const [editCaptionDe, setEditCaptionDe] = useState('');
  const [editCaptionRu, setEditCaptionRu] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const queueRef = useRef<QueueItem[]>([]);

  const fetchImages = useCallback(async (withSpinner = true) => {
    if (withSpinner) setLoading(true);
    if (!withSpinner) setRefreshing(true);
    try {
      const res = await fetch('/api/admin/gallery');
      const data = await res.json().catch(() => []);
      setImages(Array.isArray(data) ? data : []);
    } catch {
      setNotice({ tone: 'error', text: 'Не удалось загрузить изображения.' });
    } finally {
      if (withSpinner) setLoading(false);
      if (!withSpinner) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    return () => {
      queueRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, []);

  useEffect(() => {
    if (!editingImage) return;
    const onEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setEditingImage(null);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [editingImage]);

  const filteredImages = useMemo(
    () => (filterCategory ? images.filter((img) => img.category === filterCategory) : images),
    [filterCategory, images]
  );

  const queueSize = useMemo(() => queue.reduce((sum, item) => sum + item.file.size, 0), [queue]);
  const totalStorage = useMemo(() => images.reduce((sum, img) => sum + img.size, 0), [images]);

  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    images.forEach((img) => {
      map[img.category] = (map[img.category] || 0) + 1;
    });
    return map;
  }, [images]);

  const clearQueue = useCallback(() => {
    setQueue((prev) => {
      prev.forEach((item) => URL.revokeObjectURL(item.preview));
      return [];
    });
  }, []);

  const removeQueueItem = useCallback((id: string) => {
    setQueue((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const enqueueFiles = useCallback((files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return;

    const valid: QueueItem[] = [];
    let invalidCount = 0;
    let oversizeCount = 0;

    list.forEach((file) => {
      const mime = file.type.toLowerCase();
      if (!(ACCEPTED_TYPES.has(mime) || mime.startsWith('image/'))) {
        invalidCount += 1;
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        oversizeCount += 1;
        return;
      }
      valid.push({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        preview: URL.createObjectURL(file),
      });
    });

    if (valid.length) {
      setQueue((prev) => [...prev, ...valid]);
      setShowUpload(true);
    }
    if (invalidCount || oversizeCount) {
      const parts = [];
      if (invalidCount) parts.push(`неподдерживаемый формат: ${invalidCount}`);
      if (oversizeCount) parts.push(`слишком большие: ${oversizeCount}`);
      setNotice({ tone: 'error', text: `Часть файлов пропущена (${parts.join(', ')}).` });
    }
  }, []);

  const uploadQueue = async () => {
    if (!queue.length) {
      setNotice({ tone: 'error', text: 'Сначала выберите хотя бы одно фото.' });
      return;
    }
    setUploading(true);
    setNotice({ tone: 'info', text: `Загрузка ${queue.length} файла(ов)...` });
    try {
      const formData = new FormData();
      queue.forEach((item) => formData.append('files', item.file));
      formData.append('category', selectedCategory);
      if (captionDe.trim()) formData.append('caption', captionDe.trim());
      if (captionRu.trim()) formData.append('captionRu', captionRu.trim());

      const res = await fetch('/api/admin/gallery', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Upload failed');
      }

      const data = await res.json().catch(() => ({}));
      const uploadedCount = Array.isArray(data.images) ? data.images.length : queue.length;
      clearQueue();
      setCaptionDe('');
      setCaptionRu('');
      setNotice({ tone: 'success', text: `Успешно загружено: ${uploadedCount}.` });
      await fetchImages(false);
    } catch {
      setNotice({ tone: 'error', text: 'Ошибка загрузки. Попробуйте снова.' });
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: string) => {
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Delete failed');
      setImages((prev) => prev.filter((img) => img.id !== id));
      setDeleteConfirm(null);
      setNotice({ tone: 'success', text: 'Фото удалено.' });
    } catch {
      setNotice({ tone: 'error', text: 'Не удалось удалить фото.' });
    }
  };

  const openEditModal = (image: GalleryImage) => {
    setEditingImage(image);
    setEditCategory(image.category);
    setEditCaptionDe(image.caption || '');
    setEditCaptionRu(image.captionRu || '');
  };

  const saveEdit = async () => {
    if (!editingImage) return;
    setSavingEdit(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingImage.id,
          category: editCategory,
          caption: editCaptionDe.trim() || null,
          captionRu: editCaptionRu.trim() || null,
        }),
      });
      if (!res.ok) throw new Error('Patch failed');
      const updated = (await res.json()) as GalleryImage;
      setImages((prev) => prev.map((img) => (img.id === updated.id ? updated : img)));
      setEditingImage(null);
      setNotice({ tone: 'success', text: 'Изменения сохранены.' });
    } catch {
      setNotice({ tone: 'error', text: 'Не удалось сохранить изменения.' });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    if (event.dataTransfer.files.length) enqueueFiles(event.dataTransfer.files);
  };
  return (
    <div className="space-y-6 text-slate-100">
      <section className={`relative overflow-hidden rounded-[30px] p-5 sm:p-7 lg:overflow-visible ${cardGlowClass}`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.22),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.2),transparent_45%)]" />
        <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.18em] text-cyan-200/70">admin / galerie</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Галерея работ</h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300/85 xl:max-w-2xl">
              Страница загрузки и предпросмотра в современном стиле: сначала проверяешь фото, потом отправляешь.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto lg:flex-wrap lg:justify-end">
            <button
              onClick={() => fetchImages(false)}
              className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-cyan-300/30 bg-[#0a1b4f]/70 px-4 py-2.5 text-sm font-semibold text-cyan-100 hover:bg-[#0f2b77]/70 sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Обновить
            </button>
            <button
              onClick={() => setShowUpload((v) => !v)}
              className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_22px_rgba(217,70,239,0.45)] hover:bg-fuchsia-500 sm:w-auto"
            >
              <ImagePlus className="h-4 w-4" />
              {showUpload ? 'Скрыть загрузку' : 'Добавить фото'}
            </button>
          </div>
        </div>

        {notice && (
          <div className={`relative mt-5 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm ${noticeClasses(notice.tone)}`}>
            <div className="flex items-center gap-2">
              {notice.tone === 'success' ? <CheckCircle2 className="h-4 w-4" /> : notice.tone === 'error' ? <AlertCircle className="h-4 w-4" /> : <Loader2 className={`h-4 w-4 ${uploading ? 'animate-spin' : ''}`} />}
              <span>{notice.text}</span>
            </div>
            <button onClick={() => setNotice(null)} className="rounded-lg p-1 hover:bg-white/10" aria-label="Закрыть">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {showUpload && (
          <div className="relative mt-5 grid gap-4 xl:grid-cols-5">
            <div className={`rounded-2xl p-4 xl:col-span-2 ${cardGlowClass}`}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-cyan-100">Параметры загрузки</h2>
                <button onClick={() => setShowUpload(false)} className="rounded-lg border border-cyan-300/20 p-1.5 text-cyan-100/70 hover:bg-white/5" aria-label="Скрыть">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Категория</label>
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full rounded-xl border border-cyan-300/20 bg-[#081744]/90 px-3 py-2.5 text-sm text-white focus:border-fuchsia-400/60 focus:outline-none">
                    {CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>{category.ru}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Описание (DE)</label>
                  <input value={captionDe} onChange={(e) => setCaptionDe(e.target.value)} className="w-full rounded-xl border border-cyan-300/20 bg-[#081744]/90 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-fuchsia-400/60 focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Описание (RU)</label>
                  <input value={captionRu} onChange={(e) => setCaptionRu(e.target.value)} className="w-full rounded-xl border border-cyan-300/20 bg-[#081744]/90 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:border-fuchsia-400/60 focus:outline-none" />
                </div>
              </div>
            </div>

            <div className="xl:col-span-3">
              <div
                onDragOver={(event) => { event.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative min-h-[260px] cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-4 transition ${dragOver ? 'border-fuchsia-400 bg-fuchsia-400/10 shadow-[0_0_28px_rgba(232,121,249,0.35)]' : 'border-cyan-300/25 bg-[#071544]/65 hover:border-fuchsia-400/50 hover:bg-[#0a1b58]/65'}`}
              >
                {queue[0] ? (
                  <div className="grid h-full gap-4 sm:grid-cols-[1.2fr_1fr]">
                    <div className="relative overflow-hidden rounded-xl border border-cyan-300/25 bg-[#061338]">
                      <img src={queue[0].preview} alt={queue[0].file.name} className="h-full w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white">
                        <p className="truncate text-xs font-semibold">{queue[0].file.name}</p>
                        <p className="text-[11px] text-white/70">{formatBytes(queue[0].file.size)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between rounded-xl border border-cyan-300/20 bg-[#061338]/70 p-3">
                      <div>
                        <p className="text-sm font-semibold text-cyan-100">Предпросмотр перед загрузкой</p>
                        <p className="mt-1 text-xs text-slate-300">{queue.length === 1 ? '1 файл готов к отправке' : `${queue.length} файлов готовы к отправке`}</p>
                      </div>
                      <button type="button" onClick={(event) => { event.stopPropagation(); fileInputRef.current?.click(); }} className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-300/25 bg-[#0a1f63] px-3 py-2 text-sm font-semibold text-cyan-100 hover:bg-[#112b7f]">
                        <CloudUpload className="h-4 w-4" />
                        Добавить ещё
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-fuchsia-500/15 text-fuchsia-300 shadow-[0_0_24px_rgba(217,70,239,0.35)]">
                      <Upload className="h-8 w-8" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-white">Перетащите фото сюда или нажмите для выбора</p>
                    <p className="mt-2 text-xs text-slate-300">Предпросмотр появится сразу, до отправки на сервер</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className={`relative mt-4 rounded-2xl p-4 ${cardGlowClass}`}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-cyan-100">Очередь загрузки: {queue.length} файл(ов), {formatBytes(queueSize)}</p>
            <button onClick={clearQueue} className="text-xs font-semibold uppercase tracking-wide text-slate-300 transition hover:text-rose-300">Очистить очередь</button>
          </div>
          {queue.length ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {queue.map((item, index) => (
                  <div key={item.id} className="rounded-xl border border-cyan-300/20 bg-[#061338]/80 p-2">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-cyan-300/10">
                      <img src={item.preview} alt={item.file.name} className="h-full w-full object-cover" />
                      <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">#{index + 1}</span>
                      <button onClick={() => removeQueueItem(item.id)} className="absolute right-1 top-1 rounded-md bg-black/65 p-1 text-white hover:bg-rose-600" aria-label="Убрать файл"><X className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button onClick={clearQueue} className="rounded-xl border border-cyan-300/20 bg-[#081744]/80 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-[#0e246b]/80">Удалить всё</button>
                <button onClick={uploadQueue} disabled={uploading || !queue.length} className="inline-flex items-center justify-center gap-2 rounded-xl bg-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(217,70,239,0.45)] hover:bg-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-60">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CloudUpload className="h-4 w-4" />}
                  {uploading ? 'Загрузка...' : 'Загрузить в галерею'}
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-300">Очередь пуста. Добавьте фото через drag-and-drop или кнопку выбора.</p>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,image/avif"
          multiple
          className="hidden"
          onChange={(event) => {
            if (event.target.files) enqueueFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </section>

      <section className={`relative overflow-hidden rounded-[30px] p-5 sm:p-7 lg:overflow-visible ${cardGlowClass}`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.15),transparent_48%)]" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Галерея работ ({images.length} фото)</h2>
            <p className="mt-1 text-sm text-slate-300">Фильтруй, редактируй и удаляй фото прямо здесь.</p>
          </div>
          <button onClick={() => fileInputRef.current?.click()} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-fuchsia-500 sm:w-auto">
            <ImagePlus className="h-4 w-4" />
            Добавить фото
          </button>
        </div>

        <div className="relative mt-4 flex overflow-x-auto pb-1">
          <div className="flex min-w-max gap-2">
            <button onClick={() => setFilterCategory(null)} className={`rounded-xl px-4 py-2 text-sm font-semibold ${!filterCategory ? 'bg-cyan-400/20 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.25)]' : 'bg-[#081744]/80 text-slate-300 hover:bg-[#0f276f]/80'}`}>
              Все ({images.length})
            </button>
            {CATEGORIES.map((category) => {
              const count = categoryCounts[category.value] || 0;
              if (!count) return null;
              const active = filterCategory === category.value;
              return (
                <button key={category.value} onClick={() => setFilterCategory(active ? null : category.value)} className={`rounded-xl px-4 py-2 text-sm font-semibold ${active ? 'bg-cyan-400/20 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.25)]' : 'bg-[#081744]/80 text-slate-300 hover:bg-[#0f276f]/80'}`}>
                  {category.ru} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="relative py-20 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-cyan-200" />
            <p className="mt-3 text-sm text-slate-300">Загрузка галереи...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="relative py-20 text-center">
            <Images className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-3 text-base font-medium text-slate-200">В этой категории пока нет фото</p>
          </div>
        ) : (
          <div className="relative mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredImages.map((image) => (
              <article key={image.id} className="group overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#081744]/75 shadow-[0_0_24px_rgba(56,189,248,0.12)]">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={image.url} alt={image.caption || image.category} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute right-2 top-2 flex gap-1.5 opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
                    <button onClick={() => openEditModal(image)} className="rounded-lg bg-black/60 p-1.5 text-white hover:bg-cyan-500/70" aria-label="Редактировать"><Edit3 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setDeleteConfirm((v) => (v === image.id ? null : image.id))} className="rounded-lg bg-black/60 p-1.5 text-white hover:bg-rose-600" aria-label="Удалить"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
                <div className="space-y-2 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-cyan-400/15 px-2.5 py-1 text-[11px] font-semibold text-cyan-200">{CATEGORIES.find((item) => item.value === image.category)?.ru || image.category}</span>
                    <span className="text-[11px] text-slate-400">{formatBytes(image.size)}</span>
                  </div>
                  <p className={`line-clamp-2 text-sm ${image.captionRu || image.caption ? 'text-slate-200' : 'text-slate-400'}`}>{image.captionRu || image.caption || 'Без описания'}</p>
                  {deleteConfirm === image.id && (
                    <div className="rounded-xl border border-rose-400/30 bg-rose-500/10 p-2">
                      <p className="text-xs text-rose-200">Точно удалить это фото?</p>
                      <div className="mt-2 flex gap-2">
                        <button onClick={() => deleteImage(image.id)} className="flex-1 rounded-lg bg-rose-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-rose-500">Удалить</button>
                        <button onClick={() => setDeleteConfirm(null)} className="flex-1 rounded-lg border border-rose-300/30 bg-white/10 px-2 py-1.5 text-xs font-semibold text-rose-100 hover:bg-white/15">Отмена</button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="relative mt-5 rounded-xl border border-cyan-300/15 bg-[#061338]/70 px-4 py-2.5 text-xs text-slate-300">
          Общий объём в галерее: {formatBytes(totalStorage)}
        </div>
      </section>

      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#020619]/80 p-4 backdrop-blur-sm sm:items-center" onClick={() => setEditingImage(null)}>
          <div className={`w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl p-5 sm:p-6 ${cardGlowClass}`} onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Редактировать фото</h3>
              <button onClick={() => setEditingImage(null)} className="rounded-xl border border-cyan-300/20 p-2 text-slate-300 hover:bg-white/10" aria-label="Закрыть"><X className="h-4 w-4" /></button>
            </div>
            <div className="mb-4 overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#061338]">
              <img src={editingImage.url} alt={editingImage.caption || editingImage.category} className="h-52 w-full object-cover" />
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Категория</label>
                <select value={editCategory} onChange={(event) => setEditCategory(event.target.value)} className="w-full rounded-xl border border-cyan-300/20 bg-[#081744]/90 px-3 py-2.5 text-sm text-white focus:border-fuchsia-400/60 focus:outline-none">
                  {CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>{category.ru}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Описание (DE)</label>
                <input value={editCaptionDe} onChange={(event) => setEditCaptionDe(event.target.value)} className="w-full rounded-xl border border-cyan-300/20 bg-[#081744]/90 px-3 py-2.5 text-sm text-white focus:border-fuchsia-400/60 focus:outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-300">Описание (RU)</label>
                <input value={editCaptionRu} onChange={(event) => setEditCaptionRu(event.target.value)} className="w-full rounded-xl border border-cyan-300/20 bg-[#081744]/90 px-3 py-2.5 text-sm text-white focus:border-fuchsia-400/60 focus:outline-none" />
              </div>
            </div>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button onClick={() => setEditingImage(null)} className="rounded-xl border border-cyan-300/20 bg-[#081744]/90 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-[#102d7f]/90">Отмена</button>
              <button onClick={saveEdit} disabled={savingEdit} className="inline-flex items-center justify-center gap-2 rounded-xl bg-fuchsia-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-fuchsia-500 disabled:cursor-not-allowed disabled:opacity-60">
                {savingEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit3 className="h-4 w-4" />}
                {savingEdit ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
