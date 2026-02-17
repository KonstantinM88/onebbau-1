'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const homePath = `/${locale}`;
  const sectionHref = (id: string) => `${homePath}#${id}`;

  return (
    <footer className="bg-anthracite-900 text-anthracite-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="mb-4">
              <span className="text-2xl font-heading"><span className="text-brand-orange">One</span><span className="text-white">bbau</span></span>
            </div>
            <p className="text-sm leading-relaxed text-anthracite-400">
              {t('footer.description')}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.navigation')}
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: t('nav.home'), href: `/${locale}` },
                { label: t('nav.about'), id: 'about' },
                { label: t('nav.services'), id: 'services' },
                { label: t('nav.whyUs'), id: 'why-us' },
                { label: t('nav.gallery'), id: 'gallery' },
                { label: t('nav.contact'), id: 'contact' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.id ? sectionHref(item.id) : item.href}
                    className="text-sm text-anthracite-400 hover:text-brand-orange transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t('footer.services')}
            </h4>
            <ul className="space-y-2.5">
              {(t.raw('services.construction.items') as string[]).slice(0, 6).map((item, i) => (
                <li key={i}>
                  <span className="text-sm text-anthracite-400">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t('nav.contact')}
            </h4>
            <div className="space-y-3">
              <a href={`tel:${process.env.NEXT_PUBLIC_PHONE || '+49 123 456789'}`} className="flex items-center gap-3 text-sm text-anthracite-400 hover:text-brand-orange transition-colors">
                <Phone size={15} className="text-brand-orange flex-shrink-0" />
                {process.env.NEXT_PUBLIC_PHONE || '+49 123 456789'}
              </a>
              <a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL || 'info@onebbau.de'}`} className="flex items-center gap-3 text-sm text-anthracite-400 hover:text-brand-orange transition-colors">
                <Mail size={15} className="text-brand-orange flex-shrink-0" />
                {process.env.NEXT_PUBLIC_EMAIL || 'info@onebbau.de'}
              </a>
              <div className="flex items-center gap-3 text-sm text-anthracite-400">
                <MapPin size={15} className="text-brand-orange flex-shrink-0" />
                Halle (Saale)
              </div>
            </div>

            {/* Legal Links */}
            <div className="mt-6 pt-4 border-t border-anthracite-800 space-y-2">
              <a href={`/${locale}/impressum`} className="block text-xs text-anthracite-500 hover:text-brand-orange transition-colors">
                {t('nav.impressum')}
              </a>
              <a href={`/${locale}/datenschutz`} className="block text-xs text-anthracite-500 hover:text-brand-orange transition-colors">
                {t('nav.datenschutz')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-anthracite-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-center text-xs text-anthracite-500">
            © {new Date().getFullYear()} Onebbau. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}



//-------убираем пробел в логотипе-----
// 'use client';

// import { useTranslations, useLocale } from 'next-intl';
// import { Phone, Mail, MapPin } from 'lucide-react';

// export default function Footer() {
//   const t = useTranslations();
//   const locale = useLocale();

//   const scrollToSection = (id: string) => {
//     document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
//   };

//   return (
//     <footer className="bg-anthracite-900 text-anthracite-300">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
//           {/* Brand */}
//           <div className="sm:col-span-2 lg:col-span-1">
//             <div className="mb-4">
//               <span className="text-2xl font-heading">
//                 <span className="text-brand-orange">One</span>
//                 <span className="text-white">bbau</span>
//               </span>
//             </div>
//             <p className="text-sm leading-relaxed text-anthracite-400">
//               {t('footer.description')}
//             </p>
//           </div>

//           {/* Navigation */}
//           <div>
//             <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
//               {t('footer.navigation')}
//             </h4>
//             <ul className="space-y-2.5">
//               {[
//                 { label: t('nav.home'), href: `/${locale}` },
//                 { label: t('nav.about'), id: 'about' },
//                 { label: t('nav.services'), id: 'services' },
//                 { label: t('nav.whyUs'), id: 'why-us' },
//                 { label: t('nav.gallery'), id: 'gallery' },
//                 { label: t('nav.contact'), id: 'contact' },
//               ].map((item) => (
//                 <li key={item.label}>
//                   <button
//                     onClick={() => item.id ? scrollToSection(item.id) : window.scrollTo({ top: 0, behavior: 'smooth' })}
//                     className="text-sm text-anthracite-400 hover:text-brand-orange transition-colors"
//                   >
//                     {item.label}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Services */}
//           <div>
//             <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
//               {t('footer.services')}
//             </h4>
//             <ul className="space-y-2.5">
//               {(t.raw('services.construction.items') as string[]).slice(0, 6).map((item, i) => (
//                 <li key={i}>
//                   <span className="text-sm text-anthracite-400">{item}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Contact */}
//           <div>
//             <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
//               {t('nav.contact')}
//             </h4>
//             <div className="space-y-3">
//               <a href={`tel:${process.env.NEXT_PUBLIC_PHONE || '+49 123 456789'}`} className="flex items-center gap-3 text-sm text-anthracite-400 hover:text-brand-orange transition-colors">
//                 <Phone size={15} className="text-brand-orange flex-shrink-0" />
//                 {process.env.NEXT_PUBLIC_PHONE || '+49 123 456789'}
//               </a>
//               <a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL || 'info@onebbau.de'}`} className="flex items-center gap-3 text-sm text-anthracite-400 hover:text-brand-orange transition-colors">
//                 <Mail size={15} className="text-brand-orange flex-shrink-0" />
//                 {process.env.NEXT_PUBLIC_EMAIL || 'info@onebbau.de'}
//               </a>
//               <div className="flex items-center gap-3 text-sm text-anthracite-400">
//                 <MapPin size={15} className="text-brand-orange flex-shrink-0" />
//                 Halle (Saale)
//               </div>
//             </div>

//             {/* Legal Links */}
//             <div className="mt-6 pt-4 border-t border-anthracite-800 space-y-2">
//               <a href={`/${locale}/impressum`} className="block text-xs text-anthracite-500 hover:text-brand-orange transition-colors">
//                 {t('nav.impressum')}
//               </a>
//               <a href={`/${locale}/datenschutz`} className="block text-xs text-anthracite-500 hover:text-brand-orange transition-colors">
//                 {t('nav.datenschutz')}
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="border-t border-anthracite-800">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
//           <p className="text-center text-xs text-anthracite-500">
//             © {new Date().getFullYear()} Onebbau. {t('footer.rights')}
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }
