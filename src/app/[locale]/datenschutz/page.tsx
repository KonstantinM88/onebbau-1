import { useTranslations } from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Datenschutz() {
  const t = useTranslations('datenschutz');
  const phone = process.env.NEXT_PUBLIC_PHONE || '+49 1520 458 6659';
  const email = process.env.NEXT_PUBLIC_EMAIL || 'service@onebbau.de';
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://onebbau.de').replace(/\/+$/, '');
  const content = t('content', { phone, email, siteUrl });

  return (
    <>
      <Header />
      <main className="pt-28 pb-20 min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl sm:text-4xl text-anthracite-900 mb-8">
            {t('title')}
          </h1>
          <div className="prose prose-anthracite max-w-none">
            {content.split('\n').map((line, i) => (
              <p key={i} className="text-anthracite-600 leading-relaxed mb-2">
                {line}
              </p>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
