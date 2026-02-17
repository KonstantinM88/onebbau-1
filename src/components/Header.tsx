'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';

const navItems = ['about', 'services', 'whyUs', 'gallery', 'contact'] as const;
const sectionIds: Record<string, string> = {
  about: 'about',
  services: 'services',
  whyUs: 'why-us',
  contact: 'contact',
};
// Gallery links to separate page
const pageLinks: Record<string, string> = {
  gallery: '/galerie',
};

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const switchLocale = (newLocale: string) => {
    const path = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(path);
    setIsMobileOpen(false);
  };

  const homePath = `/${locale}`;
  const sectionHref = (sectionId: string) => `${homePath}#${sectionId}`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-black/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <a
              href={`/${locale}`}
              className="group"
            >
              <span className={`text-2xl sm:text-[28px] font-heading tracking-tight transition-colors ${
                isScrolled ? 'text-brand-orange' : 'text-white'
              }`}>One</span><span className={`text-2xl sm:text-[28px] font-heading tracking-tight transition-colors ${
                isScrolled ? 'text-anthracite-800' : 'text-white'
              }`}>bbau</span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const pageLink = pageLinks[item];
                if (pageLink) {
                  return (
                    <a
                      key={item}
                      href={`/${locale}${pageLink}`}
                      className={`px-3 xl:px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        isScrolled
                          ? 'text-anthracite-600 hover:text-anthracite-900 hover:bg-anthracite-50'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {t(item)}
                    </a>
                  );
                }
                return (
                  <a
                    key={item}
                    href={sectionHref(sectionIds[item])}
                    className={`px-3 xl:px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      isScrolled
                        ? 'text-anthracite-600 hover:text-anthracite-900 hover:bg-anthracite-50'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {t(item)}
                  </a>
                );
              })}
            </nav>

            {/* Right side: Language + CTA */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Language Switcher */}
              <div className="flex items-center rounded-full border border-anthracite-200/30 overflow-hidden">
                <button
                  onClick={() => switchLocale('de')}
                  className={`px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                    locale === 'de'
                      ? 'bg-brand-orange text-white'
                      : isScrolled
                        ? 'text-anthracite-500 hover:text-anthracite-800'
                        : 'text-white/60 hover:text-white'
                  }`}
                >
                  DE
                </button>
                <button
                  onClick={() => switchLocale('ru')}
                  className={`px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                    locale === 'ru'
                      ? 'bg-brand-orange text-white'
                      : isScrolled
                        ? 'text-anthracite-500 hover:text-anthracite-800'
                        : 'text-white/60 hover:text-white'
                  }`}
                >
                  RU
                </button>
              </div>

              {/* CTA Button */}
              <a
                href={sectionHref('contact')}
                className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-dark text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:shadow-lg hover:shadow-brand-orange/25 active:scale-95"
              >
                <Phone size={15} />
                {t('contact')}
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled ? 'text-anthracite-700' : 'text-white'
              }`}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-white lg:hidden"
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-anthracite-100">
              <span className="text-2xl font-heading"><span className="text-brand-orange">One</span><span className="text-anthracite-800">bbau</span></span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 text-anthracite-700"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col px-6 py-8 gap-1">
              {navItems.map((item, i) => {
                const pageLink = pageLinks[item];
                if (pageLink) {
                  return (
                    <motion.a
                      key={item}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      href={`/${locale}${pageLink}`}
                      onClick={() => setIsMobileOpen(false)}
                      className="text-left py-3 px-4 text-lg font-medium text-anthracite-700 hover:text-brand-orange hover:bg-brand-orange/5 rounded-xl transition-all"
                    >
                      {t(item)}
                    </motion.a>
                  );
                }
                return (
                  <motion.a
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    href={sectionHref(sectionIds[item])}
                    onClick={() => setIsMobileOpen(false)}
                    className="text-left py-3 px-4 text-lg font-medium text-anthracite-700 hover:text-brand-orange hover:bg-brand-orange/5 rounded-xl transition-all"
                  >
                    {t(item)}
                  </motion.a>
                );
              })}

              {/* Language Switcher Mobile */}
              <div className="flex gap-2 mt-6 px-4">
                <button
                  onClick={() => switchLocale('de')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    locale === 'de'
                      ? 'bg-brand-orange text-white'
                      : 'bg-anthracite-100 text-anthracite-600'
                  }`}
                >
                  Deutsch
                </button>
                <button
                  onClick={() => switchLocale('ru')}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    locale === 'ru'
                      ? 'bg-brand-orange text-white'
                      : 'bg-anthracite-100 text-anthracite-600'
                  }`}
                >
                  Русский
                </button>
              </div>

              {/* CTA Mobile */}
              <motion.a
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                href={sectionHref('contact')}
                onClick={() => setIsMobileOpen(false)}
                className="mt-4 mx-4 flex items-center justify-center gap-2 bg-brand-orange text-white py-3.5 rounded-xl text-base font-semibold"
              >
                <Phone size={18} />
                {t('contact')}
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
