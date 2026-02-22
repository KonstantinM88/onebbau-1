'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Send, Phone, Mail, MapPin, CheckCircle, AlertCircle, PhoneCall } from 'lucide-react';

export default function Contact() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const primaryPhone = process.env.NEXT_PUBLIC_PHONE || '+49 1520 458 6659';
  const secondaryPhone = '+49 177 33077538';
  const phoneToTel = (value: string) => value.replace(/\s+/g, '');
  const phoneToWhatsApp = (value: string) => value.replace(/\D/g, '');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, locale }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" ref={ref} className="py-20 sm:py-28 bg-anthracite-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-anthracite-900">
            {t('sectionTitle')}
          </h2>
          <div className="mt-4 mx-auto w-16 h-1 bg-brand-orange rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h3 className="font-heading text-2xl sm:text-3xl text-anthracite-800 mb-4">
              {t('title')}
            </h3>
            <p className="text-anthracite-500 text-base leading-relaxed mb-8">
              {t('subtitle')}
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange transition-colors">
                  <Phone size={20} className="text-brand-orange group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-anthracite-400 uppercase tracking-wider font-medium">{t('phone')}</p>
                  <div className="mt-1.5 space-y-1.5">
                    {[
                      { label: primaryPhone, value: primaryPhone },
                      { label: secondaryPhone, value: secondaryPhone },
                    ].map((phone) => (
                      <div key={phone.value} className="flex items-center gap-2">
                        <a
                          href={`tel:${phoneToTel(phone.value)}`}
                          className="text-anthracite-800 font-medium hover:text-brand-orange transition-colors"
                        >
                          {phone.label}
                        </a>
                        <a
                          href={`tel:${phoneToTel(phone.value)}`}
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-anthracite-200 text-anthracite-500 hover:border-brand-orange/40 hover:text-brand-orange transition-colors"
                          aria-label={`Call ${phone.label}`}
                        >
                          <PhoneCall size={14} />
                        </a>
                        <a
                          href={`https://wa.me/${phoneToWhatsApp(phone.value)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-green-200 text-green-600 hover:bg-green-50 transition-colors"
                          aria-label={`WhatsApp ${phone.label}`}
                          title="WhatsApp"
                        >
                          <svg viewBox="0 0 32 32" className="h-4 w-4 fill-current" aria-hidden="true">
                            <path d="M19.11 17.24c-.27-.14-1.61-.79-1.86-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.31.2-.58.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.58-1.5-1.85-.16-.27-.02-.42.12-.55.12-.12.27-.31.41-.46.14-.16.18-.27.27-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47h-.52c-.18 0-.48.07-.73.34-.25.27-.96.93-.96 2.27 0 1.34.98 2.64 1.11 2.82.14.18 1.92 2.93 4.66 4.11.65.28 1.16.45 1.55.58.65.21 1.24.18 1.71.11.52-.08 1.61-.66 1.84-1.29.23-.64.23-1.19.16-1.29-.07-.09-.25-.14-.52-.27z" />
                            <path d="M16 3C8.83 3 3 8.83 3 16c0 2.29.6 4.53 1.73 6.5L3 29l6.71-1.7A13 13 0 1 0 16 3zm0 23.83c-2.03 0-4.01-.57-5.72-1.64l-.41-.25-3.98 1.01 1.06-3.88-.27-.4A10.78 10.78 0 1 1 16 26.83z" />
                          </svg>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <a
                href={`mailto:${process.env.NEXT_PUBLIC_EMAIL || 'info@onebbau.de'}`}
                className="flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center group-hover:bg-brand-orange transition-colors">
                  <Mail size={20} className="text-brand-orange group-hover:text-white transition-colors" />
                </div>
                <div>
                  <p className="text-xs text-anthracite-400 uppercase tracking-wider font-medium">{t('email')}</p>
                  <p className="text-anthracite-800 font-medium">
                    {process.env.NEXT_PUBLIC_EMAIL || 'info@onebbau.de'}
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                  <MapPin size={20} className="text-brand-orange" />
                </div>
                <div>
                  <p className="text-xs text-anthracite-400 uppercase tracking-wider font-medium">Region</p>
                  <p className="text-anthracite-800 font-medium">Halle (Saale) und Umgebung</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/5 border border-anthracite-100/50"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-anthracite-600 mb-1.5">
                    {t('form.name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-anthracite-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all text-anthracite-800 placeholder-anthracite-300"
                    placeholder={t('form.name')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-anthracite-600 mb-1.5">
                    {t('form.email')} *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-anthracite-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all text-anthracite-800 placeholder-anthracite-300"
                    placeholder={t('form.email')}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-anthracite-600 mb-1.5">
                  {t('form.phone')}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-anthracite-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all text-anthracite-800 placeholder-anthracite-300"
                  placeholder={t('form.phone')}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-anthracite-600 mb-1.5">
                  {t('form.message')} *
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-anthracite-200 focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 outline-none transition-all text-anthracite-800 placeholder-anthracite-300 resize-none"
                  placeholder={t('form.message')}
                />
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-green-50 text-green-700 text-sm">
                  <CheckCircle size={18} />
                  {t('form.success')}
                </div>
              )}
              {status === 'error' && (
                <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 text-red-700 text-sm">
                  <AlertCircle size={18} />
                  {t('form.error')}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-dark disabled:opacity-60 text-white py-3.5 sm:py-4 rounded-xl text-base font-semibold transition-all hover:shadow-lg hover:shadow-brand-orange/25 active:scale-[0.98]"
              >
                <Send size={18} />
                {status === 'sending' ? t('form.sending') : t('form.submit')}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
