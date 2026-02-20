'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Phone, Mail, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import AnimateOnScroll from '@/components/ui/AnimateOnScroll';
import SectionLabel from '@/components/ui/SectionLabel';

export default function Contact() {
  const t = useTranslations('contact');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="section-padding bg-anthracite-950 text-white relative overflow-hidden">
      {/* Decorative bg */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-500/3 rounded-full blur-[120px]" />

      <div className="container-custom relative z-10">
        <AnimateOnScroll className="text-center mb-14">
          <SectionLabel text={t('sectionLabel')} />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading text-white mb-4">
            {t('title')}
          </h2>
          <p className="text-anthracite-400 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </AnimateOnScroll>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact info */}
          <AnimateOnScroll variant="slideLeft" className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-anthracite-400">{t('phone')}</p>
                  <a href="tel:+4915204586659" className="text-white font-medium hover:text-primary-400 transition-colors">
                    +49 1520 458 6659
                  </a>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-anthracite-400">{t('email')}</p>
                  <a href="mailto:info@onebbau.de" className="text-white font-medium hover:text-primary-400 transition-colors">
                    info@onebbau.de
                  </a>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-anthracite-400">{t('region')}</p>
                  <p className="text-white font-medium">Halle (Saale), Sachsen-Anhalt</p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Contact form */}
          <AnimateOnScroll variant="slideRight" delay={0.2} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-anthracite-300 mb-2">
                    {t('form.name')} *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('form.namePlaceholder')}
                    className="w-full px-4 py-3.5 bg-anthracite-900/50 border border-anthracite-700/50 rounded-xl text-white placeholder:text-anthracite-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-anthracite-300 mb-2">
                    {t('form.email')} *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('form.emailPlaceholder')}
                    className="w-full px-4 py-3.5 bg-anthracite-900/50 border border-anthracite-700/50 rounded-xl text-white placeholder:text-anthracite-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-anthracite-300 mb-2">
                  {t('form.phone')}
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('form.phonePlaceholder')}
                  className="w-full px-4 py-3.5 bg-anthracite-900/50 border border-anthracite-700/50 rounded-xl text-white placeholder:text-anthracite-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-anthracite-300 mb-2">
                  {t('form.message')} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('form.messagePlaceholder')}
                  className="w-full px-4 py-3.5 bg-anthracite-900/50 border border-anthracite-700/50 rounded-xl text-white placeholder:text-anthracite-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 transition-all resize-none"
                />
              </div>

              {/* Status messages */}
              {status === 'success' && (
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle className="w-5 h-5" />
                  {t('form.success')}
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-5 h-5" />
                  {t('form.error')}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/20"
              >
                {status === 'sending' ? t('form.sending') : t('form.submit')}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
