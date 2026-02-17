'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Images, LogOut, Menu, Sparkles, X, type LucideIcon } from 'lucide-react';

const navItems = [
  {
    href: '/admin/gallery',
    label: 'Galerie',
    subtitle: 'Upload und Verwaltung',
    icon: Images,
  },
];

type AdminShellProps = {
  children: React.ReactNode;
  username: string;
};

type NavLinkProps = {
  href: string;
  label: string;
  subtitle?: string;
  icon: LucideIcon;
  active: boolean;
  onNavigate?: () => void;
};

function NavLink({ href, label, subtitle, icon: Icon, active, onNavigate }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`group flex items-center gap-3 rounded-2xl border px-3 py-3 transition-all ${
        active
          ? 'border-brand-orange/40 bg-brand-orange/20 text-white shadow-lg shadow-brand-orange/10'
          : 'border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          active ? 'bg-brand-orange text-white' : 'bg-white/5 text-slate-400 group-hover:text-white'
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold">{label}</span>
        {subtitle ? <span className="block truncate text-xs text-slate-400">{subtitle}</span> : null}
      </span>
    </Link>
  );
}

function Navigation({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          subtitle={item.subtitle}
          icon={item.icon}
          active={pathname.startsWith(item.href)}
          onNavigate={onNavigate}
        />
      ))}

      <Link
        href="/de"
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-slate-300 transition-all hover:border-white/10 hover:bg-white/5 hover:text-white"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 group-hover:text-white">
          <Home className="h-4 w-4" />
        </span>
        <span>
          <span className="block text-sm font-semibold">Webseite</span>
          <span className="block text-xs text-slate-400">Im neuen Tab öffnen</span>
        </span>
      </Link>
    </nav>
  );
}

export default function AdminShell({ children, username }: AdminShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#ebeff6] text-anthracite-900">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(232,97,26,0.16),transparent_50%),radial-gradient(circle_at_85%_85%,rgba(18,27,43,0.12),transparent_40%)]" />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/10 bg-[#0f141f]/95 px-4 py-5 text-white shadow-[0_25px_80px_rgba(8,12,20,0.45)] backdrop-blur-xl lg:flex xl:w-72">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-xl font-bold">
                <span className="text-brand-orange">One</span>
                <span>bbau</span>
              </div>
              <p className="mt-1 text-xs text-slate-400">Admin Workspace</p>
            </div>

            <div className="mt-4 rounded-2xl border border-brand-orange/20 bg-brand-orange/10 px-3 py-2.5 text-xs text-brand-orange">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                Medienverwaltung
              </span>
              <p className="mt-1 text-[11px] text-slate-300">Schneller Upload, Kontrolle und Live-Änderungen.</p>
            </div>

            <div className="mt-5 flex-1">
              <Navigation pathname={pathname} />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-orange/20 text-xs font-bold text-brand-orange">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{username}</p>
                    <p className="truncate text-xs text-slate-400">Administrator</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/5 hover:text-red-300"
                  title="Abmelden"
                  aria-label="Abmelden"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
      </aside>

      <header className="sticky top-0 z-30 mx-3 mt-3 rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-[0_10px_28px_rgba(16,24,40,0.1)] backdrop-blur lg:hidden">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setMenuOpen(true)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600"
                aria-label="Menü öffnen"
              >
                <Menu className="h-5 w-5" />
              </button>

              <div className="text-center">
                <p className="text-sm font-bold text-slate-900">
                  <span className="text-brand-orange">One</span>bbau
                </p>
                <p className="text-[11px] text-slate-500">Admin</p>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600"
                title="Abmelden"
                aria-label="Abmelden"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-black/45 transition-opacity lg:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMenuOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[84vw] max-w-sm border-r border-white/10 bg-[#0f141f]/95 p-4 text-white shadow-[0_25px_80px_rgba(8,12,20,0.6)] backdrop-blur-xl transition-transform lg:hidden ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">
                  <span className="text-brand-orange">One</span>bbau
                </p>
                <p className="text-xs text-slate-400">Navigation</p>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-xl p-2 text-slate-300 hover:bg-white/10"
                aria-label="Menü schließen"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5">
              <Navigation pathname={pathname} onNavigate={() => setMenuOpen(false)} />
            </div>
      </aside>

      <main className="relative px-4 pb-8 pt-4 sm:px-6 sm:pt-6 lg:ml-64 lg:px-8 lg:pb-10 lg:pt-8 xl:ml-72 xl:px-10">
        <div className="mx-auto w-full max-w-[1680px]">
          {children}
        </div>
      </main>
    </div>
  );
}
