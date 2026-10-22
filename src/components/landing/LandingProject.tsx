import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import type { Landing } from '@/lib/landings';
import BeforeAfterSlider from './BeforeAfterSlider';

type Props = { project: NonNullable<Landing['project']>; locale: string };

export default async function LandingProject({ project, locale }: Props) {
  const content = locale === 'ru' ? project.ru : project.de;
  // A draft has no public article URL. Failure to check publication must not
  // hide the static case study or introduce a link to an unavailable article.
  const article = await prisma.newsArticle.findFirst({
    where: { slug: project.articleSlug, published: true },
    select: { slug: true },
  }).catch(() => null);
  const photos = [project.beforeImage, project.processImage, project.afterImage];

  return (
    <section className="bg-anthracite-50/60 py-16 sm:py-24" aria-labelledby="project-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-anthracite-600">
            {locale === 'ru' ? 'Выполненный объект' : 'Ausgeführtes Projekt'}
          </p>
          <h2 id="project-heading" className="mt-3 font-heading text-3xl text-anthracite-900 sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-5 leading-relaxed text-anthracite-700">{content.text}</p>
        </div>
        {project.comparison && (
          <BeforeAfterSlider
            beforeImage={project.comparison.beforeImage}
            afterImage={project.comparison.afterImage}
            locale={locale}
          />
        )}
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {photos.map((src, index) => (
            <figure key={src} className="overflow-hidden rounded-2xl border border-anthracite-200 bg-white">
              <Image
                src={src}
                alt={content.captions[index]}
                width={index === 2 ? 675 : 960}
                height={index === 2 ? 900 : 1280}
                sizes="(max-width: 639px) calc(100vw - 2rem), (max-width: 1023px) 31vw, 400px"
                className="h-auto w-full"
              />
              <figcaption className="px-4 py-4 text-sm leading-6 text-anthracite-600">
                {content.captions[index]}
              </figcaption>
            </figure>
          ))}
        </div>
        {article && (
          <Link href={`/${locale}/news/${article.slug}`} className="mt-7 inline-flex items-center gap-2 font-semibold text-brand-orange-dark underline underline-offset-4">
            {content.linkLabel} <ArrowRight size={18} aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
}
