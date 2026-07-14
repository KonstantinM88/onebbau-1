// src/lib/landings.ts
// Данные посадочных страниц для SEO / GEO / AIO продвижения.
// Каждый лендинг: прямой ответ на запрос в первом абзаце (AIO),
// локальные сущности Halle (Saale) (GEO), FAQ для FAQPage-schema,
// ценовые ориентиры и внутренняя перелинковка.

export type Locale = 'de' | 'ru';

export type LandingFaq = { q: string; a: string };
export type LandingStep = { title: string; text: string };
export type LandingBenefit = { title: string; text: string };
export type LandingStat = { value: number; suffix: string; label: string };

export type LandingContent = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  // Первые 2–3 предложения — прямой ответ на поисковый запрос (для AI-выдачи)
  directAnswer: string;
  intro: string;
  benefitsTitle: string;
  benefits: LandingBenefit[];
  processTitle: string;
  steps: LandingStep[];
  priceTitle: string;
  priceText: string;
  priceRange: string;
  areaTitle: string;
  areaText: string;
  faqTitle: string;
  faq: LandingFaq[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  stats: LandingStat[];
};

export type Landing = {
  slug: string;
  serviceType: string; // для schema.org Service
  image: string | Record<Locale, string>;
  imageAspect?: Partial<Record<Locale, number>>;
  imageAlt: Record<Locale, string>;
  keywords: string[];
  related: string[];
  de: LandingContent;
  ru: LandingContent;
};

const AREA_DE =
  'Wir arbeiten in Halle (Saale) und im Umkreis von ca. 30 km: Saalekreis, Merseburg, Landsberg, Kabelsketal, Teutschenthal, Petersberg sowie in allen Stadtteilen – von Trotha über Kröllwitz und Heide-Nord bis Ammendorf und Büschdorf.';
const AREA_RU =
  'Мы работаем в Halle (Saale) и в радиусе ~30 км: Saalekreis, Merseburg, Landsberg, Kabelsketal, Teutschenthal, Petersberg, а также во всех районах города — от Trotha и Kröllwitz до Ammendorf и Büschdorf.';

export const landings: Landing[] = [
  {
    slug: 'badsanierung-halle',
    serviceType: 'Badsanierung',
    image: { de: '/images/landings/badsanierung-halle-de.webp', ru: '/images/landings/badsanierung-halle-ru.webp' },
    imageAspect: { de: 2, ru: 2 },
    imageAlt: {
      de: 'Modern saniertes Badezimmer mit bodengleicher Dusche und Onebbau-Leistungsübersicht',
      ru: 'Современная ванная после ремонта с душем вровень с полом и описанием услуг Onebbau',
    },
    keywords: [
      'Badsanierung Halle Saale',
      'Bad renovieren Halle',
      'Badezimmer Komplettsanierung Halle',
      'bodengleiche Dusche einbauen Halle',
    ],
    related: ['trockenbau-halle', 'fliesenleger-halle', 'malerarbeiten-halle'],
    de: {
      metaTitle: 'Badsanierung Halle (Saale) – Komplettbad aus einer Hand | Onebbau',
      metaDescription:
        'Badsanierung in Halle (Saale): Komplettbad, bodengleiche Dusche, Fliesen, Trockenbau. Festpreisangebot in 2–5 Werktagen, Umsetzung meist in 2–4 Wochen. Jetzt Besichtigung anfragen.',
      eyebrow: 'Badsanierung',
      h1: 'Badsanierung in Halle (Saale) – komplett aus einer Hand',
      directAnswer:
        'Onebbau saniert Badezimmer in Halle (Saale) komplett aus einer Hand: von Demontage und Abdichtung über Trockenbau und Fliesen bis zur Montage von Dusche, WC und Waschtisch. Ein typisches Komplettbad (4–8 m²) dauert 2–4 Wochen; das Festpreisangebot erhalten Sie 2–5 Werktage nach der kostenlosen Besichtigung.',
      intro:
        'Ob Altbau in der Innenstadt, Plattenbau in Neustadt oder Einfamilienhaus in Dölau – jedes Bad hat andere Voraussetzungen. Wir planen die Sanierung so, dass Leitungswege, Abdichtung nach DIN 18534 und Fliesenspiegel zusammenpassen, und koordinieren alle Gewerke selbst. Sie haben einen Ansprechpartner, einen Termin­plan und einen Festpreis.',
      benefitsTitle: 'Was Sie bei uns bekommen',
      benefits: [
        {
          title: 'Komplettbad statt Gewerke-Puzzle',
          text: 'Demontage, Rohinstallation, Abdichtung, Trockenbau, Fliesen, Sanitärmontage und Malerarbeiten – koordiniert von einem Team.',
        },
        {
          title: 'Bodengleiche Duschen',
          text: 'Barrierearme Duschen mit Punkt- oder Linienentwässerung, sauber abgedichtet – auch im Altbau mit geringer Aufbauhöhe.',
        },
        {
          title: 'Staubarm und bewohnbar',
          text: 'Staubschutzwände, tägliches Aufräumen und klare Etappen: Ihre Wohnung bleibt während der Sanierung nutzbar.',
        },
        {
          title: 'Festpreis vor Baubeginn',
          text: 'Sie wissen vor dem ersten Hammerschlag, was das Bad kostet. Nachträge nur bei echten, gemeinsam bestätigten Änderungen.',
        },
      ],
      processTitle: 'So läuft Ihre Badsanierung ab',
      steps: [
        { title: 'Besichtigung vor Ort', text: 'Kostenlos in Halle und Umgebung. Wir messen auf, klären Wünsche und Budget.' },
        { title: 'Festpreisangebot', text: 'Innerhalb von 2–5 Werktagen, mit Leistungsverzeichnis und Terminfenster.' },
        { title: 'Demontage & Rohbau', text: 'Alte Sanitärobjekte raus, Leitungen neu, Abdichtung nach DIN 18534.' },
        { title: 'Ausbau & Fliesen', text: 'Trockenbau, Estrich-Ausgleich, Fliesen an Wand und Boden, Silikonfugen.' },
        { title: 'Montage & Übergabe', text: 'Dusche, WC, Waschtisch, Beleuchtung. Gemeinsame Abnahme, besenreine Übergabe.' },
      ],
      priceTitle: 'Was kostet eine Badsanierung in Halle?',
      priceText:
        'Die Kosten hängen von Größe, Zustand der Leitungen und Ausstattung ab. Als Orientierung für Halle (Saale): Teilsanierung (z. B. Dusche + Fliesenspiegel) ab ca. 4.000 €, Komplettbad 4–6 m² meist 9.000–16.000 €, gehobene Ausstattung oder Grundriss­änderungen darüber. Nach der Besichtigung erhalten Sie einen verbindlichen Festpreis.',
      priceRange: '€€ – Komplettbad meist 9.000–16.000 €',
      areaTitle: 'Einsatzgebiet',
      areaText: AREA_DE,
      faqTitle: 'Häufige Fragen zur Badsanierung',
      faq: [
        {
          q: 'Wie lange dauert eine komplette Badsanierung?',
          a: 'Ein Standardbad mit 4–8 m² dauert in der Regel 2–4 Wochen. Grundrissänderungen, Estricharbeiten oder lange Liefertermine für Sonderausstattung können die Zeit verlängern – das steht dann bereits im Angebot.',
        },
        {
          q: 'Kann ich während der Sanierung in der Wohnung bleiben?',
          a: 'Ja, in den meisten Fällen. Wir arbeiten mit Staubschutz, halten Flure sauber und stimmen mit Ihnen ab, wann Wasser kurzzeitig abgestellt wird. Nur wenige Tage ist das Bad komplett unbenutzbar.',
        },
        {
          q: 'Ist eine bodengleiche Dusche im Altbau möglich?',
          a: 'Meist ja. Entscheidend ist die verfügbare Aufbauhöhe für Ablauf und Gefälle. Bei der Besichtigung prüfen wir die Deckenkonstruktion und schlagen die passende Ablauftechnik vor – notfalls mit flachem Duschelement.',
        },
        {
          q: 'Übernehmen Sie auch nur Teilarbeiten, z. B. Fliesen?',
          a: 'Ja. Wir sanieren auch einzelne Bereiche – neue Fliesen, Austausch der Dusche, Erneuerung der Silikonfugen oder Trockenbau-Vorwände. Das Angebot wird entsprechend kleiner.',
        },
        {
          q: 'Bekomme ich einen Festpreis?',
          a: 'Ja. Nach der Besichtigung erhalten Sie ein Festpreisangebot mit Leistungsverzeichnis. Mehrkosten entstehen nur, wenn wir gemeinsam Änderungen beschließen oder verdeckte Schäden (z. B. marode Leitungen) auftauchen – dann sprechen wir vorher mit Ihnen.',
        },
      ],
      ctaTitle: 'Bad besichtigen lassen – kostenlos & unverbindlich',
      ctaText: 'Schicken Sie uns 2–3 Fotos Ihres Bades oder vereinbaren Sie direkt einen Termin in Halle (Saale).',
      ctaButton: 'Kostenlose Besichtigung anfragen',
      stats: [
        { value: 80, suffix: '+', label: 'sanierte Bäder' },
        { value: 14, suffix: ' Tage', label: 'typische Bauzeit ab' },
        { value: 100, suffix: '%', label: 'Festpreisangebote' },
      ],
    },
    ru: {
      metaTitle: 'Ремонт ванной в Halle (Saale) под ключ | Onebbau',
      metaDescription:
        'Ремонт ванной комнаты в Halle (Saale) под ключ: душ вровень с полом, плитка, гипсокартон. Фиксированная смета за 2–5 дней, ремонт обычно 2–4 недели.',
      eyebrow: 'Ремонт ванной',
      h1: 'Ремонт ванной в Halle (Saale) под ключ',
      directAnswer:
        'Onebbau делает ремонт ванных комнат в Halle (Saale) под ключ: демонтаж, гидроизоляция, гипсокартон, плитка и установка сантехники. Стандартная ванная 4–8 м² занимает 2–4 недели; фиксированную смету вы получаете через 2–5 рабочих дней после бесплатного осмотра.',
      intro:
        'Старый фонд в центре, панельный дом в Neustadt или частный дом в Dölau — у каждой ванной свои особенности. Мы планируем разводку, гидроизоляцию по DIN 18534 и раскладку плитки как единое целое и сами координируем все работы. У вас один подрядчик, один график и одна фиксированная цена.',
      benefitsTitle: 'Что вы получаете',
      benefits: [
        { title: 'Всё под ключ', text: 'Демонтаж, черновая разводка, гидроизоляция, гипсокартон, плитка, сантехника и покраска — одной командой.' },
        { title: 'Душ вровень с полом', text: 'Безбарьерные душевые с точечным или линейным трапом, с аккуратной гидроизоляцией — в том числе в старом фонде.' },
        { title: 'Чисто и без стресса', text: 'Пылезащитные перегородки, ежедневная уборка, понятные этапы. Квартира остаётся жилой.' },
        { title: 'Фиксированная цена', text: 'Вы знаете стоимость до начала работ. Доплаты — только за согласованные изменения.' },
      ],
      processTitle: 'Как проходит ремонт',
      steps: [
        { title: 'Осмотр на месте', text: 'Бесплатно в Halle и окрестностях. Замеры, пожелания, бюджет.' },
        { title: 'Смета с фиксированной ценой', text: 'За 2–5 рабочих дней, с перечнем работ и сроками.' },
        { title: 'Демонтаж и черновые работы', text: 'Демонтаж, новая разводка, гидроизоляция по DIN 18534.' },
        { title: 'Отделка и плитка', text: 'Гипсокартон, выравнивание, укладка плитки, силиконовые швы.' },
        { title: 'Монтаж и сдача', text: 'Душ, унитаз, раковина, свет. Совместная приёмка, уборка.' },
      ],
      priceTitle: 'Сколько стоит ремонт ванной в Halle?',
      priceText:
        'Цена зависит от площади, состояния коммуникаций и материалов. Ориентир для Halle (Saale): частичный ремонт от ~4 000 €, ванная 4–6 м² под ключ обычно 9 000–16 000 €. После осмотра вы получаете обязательную фиксированную смету.',
      priceRange: '€€ — ванная под ключ обычно 9 000–16 000 €',
      areaTitle: 'Зона работы',
      areaText: AREA_RU,
      faqTitle: 'Частые вопросы',
      faq: [
        { q: 'Сколько длится ремонт ванной?', a: 'Стандартная ванная 4–8 м² — обычно 2–4 недели. Перепланировка, стяжка или долгие поставки сантехники увеличивают срок — это фиксируется в смете заранее.' },
        { q: 'Можно ли жить в квартире во время ремонта?', a: 'В большинстве случаев да. Мы ставим пылезащиту, поддерживаем чистоту и заранее согласовываем отключения воды. Полностью недоступна ванная лишь несколько дней.' },
        { q: 'Возможен ли душ вровень с полом в старом доме?', a: 'Чаще всего да — важна высота для трапа и уклона. При осмотре мы оцениваем перекрытие и подбираем подходящее решение, при необходимости — плоский душевой элемент.' },
        { q: 'Делаете ли вы отдельные работы, например только плитку?', a: 'Да: плитка, замена душа, обновление швов, короба из гипсокартона. Смета формируется под конкретный объём.' },
        { q: 'Цена фиксированная?', a: 'Да, после осмотра вы получаете смету с фиксированной ценой. Доплаты возможны только при согласованных изменениях или скрытых дефектах — и всегда обсуждаются заранее.' },
      ],
      ctaTitle: 'Бесплатный осмотр ванной',
      ctaText: 'Пришлите 2–3 фото ванной или запишитесь на осмотр в Halle (Saale).',
      ctaButton: 'Запросить бесплатный осмотр',
      stats: [
        { value: 80, suffix: '+', label: 'отремонтированных ванных' },
        { value: 14, suffix: ' дней', label: 'типичный срок от' },
        { value: 100, suffix: '%', label: 'смет с фиксированной ценой' },
      ],
    },
  },

  {
    slug: 'trockenbau-halle',
    serviceType: 'Trockenbau',
    image: { de: '/images/landings/trockenbau-halle-de.webp', ru: '/images/landings/trockenbau-halle-ru.webp' },
    imageAspect: { de: 2, ru: 1.5 },
    imageAlt: {
      de: 'Trockenbauer montiert Gipskartonplatten in einem Innenraum in Halle',
      ru: 'Мастер устанавливает гипсокартон в ремонтируемом помещении в Halle',
    },
    keywords: [
      'Trockenbau Halle Saale',
      'Trockenbauer Halle',
      'Rigips Wand einziehen Halle',
      'Dachausbau Trockenbau Halle',
    ],
    related: ['badsanierung-halle', 'malerarbeiten-halle', 'bodenleger-halle'],
    de: {
      metaTitle: 'Trockenbau Halle (Saale) – Wände, Decken, Dachausbau | Onebbau',
      metaDescription:
        'Trockenbau in Halle (Saale): Trennwände, abgehängte Decken, Dachschrägen, Schall- und Brandschutz. Saubere Ausführung, Festpreis nach kostenloser Besichtigung.',
      eyebrow: 'Trockenbau',
      h1: 'Trockenbau in Halle (Saale) – Wände, Decken und Dachausbau',
      directAnswer:
        'Onebbau führt Trockenbauarbeiten in Halle (Saale) aus: Trennwände aus Gipskarton, abgehängte Decken, Vorwandinstallationen, Dachschrägen-Verkleidung sowie Schall- und Brandschutzkonstruktionen. Eine Trennwand steht meist in 1–2 Tagen, komplette Dachgeschoss-Ausbauten in 1–3 Wochen.',
      intro:
        'Trockenbau ist der schnellste Weg, Räume neu zu schneiden: ein zusätzliches Kinderzimmer, ein Homeoffice, eine Ankleide oder ein ausgebautes Dachgeschoss. Wir arbeiten mit Metallständerwerk und Qualitätsplatten (u. a. Knauf/Rigips), achten auf saubere Fugen in Q2–Q3 und übergeben streichfertige Flächen.',
      benefitsTitle: 'Unsere Trockenbau-Leistungen',
      benefits: [
        { title: 'Trennwände & Raumteiler', text: 'Neue Zimmer in Wohnungen und Büros – mit Dämmung, auf Wunsch mit Tür und Elektro-Leerrohren.' },
        { title: 'Decken & Lichtkonzepte', text: 'Abgehängte Decken, Schattenfugen, indirekte Beleuchtung, Spots – sauber gespachtelt.' },
        { title: 'Dachausbau', text: 'Dämmung, Dampfbremse und Beplankung von Dachschrägen – aus ungenutztem Speicher wird Wohnraum.' },
        { title: 'Schall- & Brandschutz', text: 'Mehrlagige Beplankung und entkoppelte Konstruktionen für Ruhe zwischen Räumen und Wohnungen.' },
      ],
      processTitle: 'Ablauf Ihrer Trockenbau-Arbeiten',
      steps: [
        { title: 'Besichtigung & Aufmaß', text: 'Wir prüfen Untergrund, Höhen und Anschlüsse vor Ort.' },
        { title: 'Angebot mit Festpreis', text: 'Materialliste, Fugenqualität (Q2/Q3) und Termin – schriftlich in 2–5 Werktagen.' },
        { title: 'Ständerwerk & Ausbau', text: 'Metallprofile, Dämmung, Elektro-Vorbereitung, Beplankung.' },
        { title: 'Spachteln & Übergabe', text: 'Fugen spachteln und schleifen, streichfertige oder auf Wunsch gestrichene Übergabe.' },
      ],
      priceTitle: 'Was kostet Trockenbau in Halle?',
      priceText:
        'Richtwerte für Halle (Saale): einfache Trennwand inkl. Material ab ca. 90–140 €/m², abgehängte Decke ab ca. 70–110 €/m², Dachschrägen mit Dämmung ab ca. 120 €/m². Der genaue Preis hängt von Höhe, Dämmung und Fugenqualität ab – nach der Besichtigung nennen wir einen Festpreis.',
      priceRange: '€ – Trennwand ab ca. 90 €/m²',
      areaTitle: 'Einsatzgebiet',
      areaText: AREA_DE,
      faqTitle: 'Häufige Fragen zum Trockenbau',
      faq: [
        { q: 'Wie schnell steht eine neue Trennwand?', a: 'Eine Standard-Trennwand in einer Wohnung steht inkl. Spachteln meist in 1–2 Arbeitstagen. Trocknungszeiten der Spachtelmasse kommen hinzu, bevor gestrichen werden kann.' },
        { q: 'Kann in die Wand eine Tür oder Elektrik integriert werden?', a: 'Ja. Türöffnungen mit Aussteifung, Leerrohre, Steckdosen und Schalter planen wir gleich mit ein – der Elektroanschluss selbst erfolgt durch einen Elektriker.' },
        { q: 'Hilft Trockenbau gegen Lärm?', a: 'Deutlich – mit Mineralwolle-Dämmung und doppelter Beplankung erreichen Trennwände gute Schalldämmwerte. Für Wohnungstrennwände planen wir entkoppelte Konstruktionen.' },
        { q: 'Arbeiten Sie auch in bewohnten Wohnungen?', a: 'Ja, das ist der Normalfall. Wir decken Böden ab, arbeiten mit Staubschutz und räumen täglich auf.' },
        { q: 'Übernehmen Sie auch das Streichen?', a: 'Auf Wunsch ja – wir übergeben entweder streichfertig gespachtelt (Q2/Q3) oder komplett gestrichen.' },
      ],
      ctaTitle: 'Projekt besprechen',
      ctaText: 'Beschreiben Sie kurz Ihr Vorhaben – wir melden uns mit Terminvorschlag für die Besichtigung.',
      ctaButton: 'Kostenlose Beratung anfragen',
      stats: [
        { value: 5000, suffix: ' m²', label: 'verbaute Platten' },
        { value: 2, suffix: ' Tage', label: 'Trennwand typisch in' },
        { value: 10, suffix: '+', label: 'Jahre Erfahrung' },
      ],
    },
    ru: {
      metaTitle: 'Гипсокартон и Trockenbau в Halle (Saale) | Onebbau',
      metaDescription:
        'Работы по гипсокартону в Halle (Saale): перегородки, потолки, мансарды, шумоизоляция. Аккуратно, с фиксированной сметой после бесплатного осмотра.',
      eyebrow: 'Гипсокартон',
      h1: 'Гипсокартон (Trockenbau) в Halle (Saale)',
      directAnswer:
        'Onebbau выполняет работы по гипсокартону в Halle (Saale): перегородки, подвесные потолки, инсталляции, обшивка мансард, шумо- и пожарозащитные конструкции. Перегородка обычно готова за 1–2 дня, полный выход мансарды — за 1–3 недели.',
      intro:
        'Гипсокартон — самый быстрый способ перекроить пространство: детская, кабинет, гардеробная или жилая мансарда. Мы работаем на металлическом каркасе с качественными плитами (Knauf/Rigips), шпаклюем в качестве Q2–Q3 и сдаём поверхности под покраску.',
      benefitsTitle: 'Что мы делаем',
      benefits: [
        { title: 'Перегородки', text: 'Новые комнаты в квартирах и офисах — с утеплителем, дверными проёмами и закладными под электрику.' },
        { title: 'Потолки и свет', text: 'Подвесные потолки, теневые швы, ниши под подсветку и споты.' },
        { title: 'Мансарды', text: 'Утепление, пароизоляция и обшивка скатов — чердак превращается в жилую комнату.' },
        { title: 'Шумоизоляция', text: 'Многослойная обшивка и развязанные конструкции для тишины между комнатами.' },
      ],
      processTitle: 'Как проходит работа',
      steps: [
        { title: 'Осмотр и замеры', text: 'Проверяем основание, высоты и примыкания на месте.' },
        { title: 'Смета с фиксированной ценой', text: 'Материалы, качество швов (Q2/Q3) и сроки — письменно за 2–5 дней.' },
        { title: 'Каркас и обшивка', text: 'Профили, утеплитель, подготовка под электрику, плиты.' },
        { title: 'Шпаклёвка и сдача', text: 'Швы, шлифовка, сдача под покраску или с покраской.' },
      ],
      priceTitle: 'Сколько стоит гипсокартон в Halle?',
      priceText:
        'Ориентиры для Halle (Saale): перегородка с материалом от ~90–140 €/м², подвесной потолок от ~70–110 €/м², скаты мансарды с утеплением от ~120 €/м². Точная цена — после осмотра, фиксированной сметой.',
      priceRange: '€ — перегородка от ~90 €/м²',
      areaTitle: 'Зона работы',
      areaText: AREA_RU,
      faqTitle: 'Частые вопросы',
      faq: [
        { q: 'Как быстро появится новая перегородка?', a: 'Стандартная перегородка в квартире — обычно 1–2 рабочих дня, плюс время высыхания шпаклёвки перед покраской.' },
        { q: 'Можно ли встроить дверь и электрику?', a: 'Да, проёмы с усилением, гофры, подрозетники закладываем сразу; подключение выполняет электрик.' },
        { q: 'Помогает ли гипсокартон от шума?', a: 'Заметно: минеральная вата и двойная обшивка дают хорошую шумоизоляцию. Для межквартирных стен используем развязанные конструкции.' },
        { q: 'Работаете ли в жилых квартирах?', a: 'Да, это обычный случай: укрываем полы, ставим пылезащиту, убираем ежедневно.' },
        { q: 'Красите ли вы стены после?', a: 'По желанию — сдаём под покраску (Q2/Q3) или полностью покрашенными.' },
      ],
      ctaTitle: 'Обсудить проект',
      ctaText: 'Опишите задачу — предложим дату бесплатного осмотра.',
      ctaButton: 'Запросить консультацию',
      stats: [
        { value: 5000, suffix: ' м²', label: 'смонтированных плит' },
        { value: 2, suffix: ' дня', label: 'перегородка обычно за' },
        { value: 10, suffix: '+', label: 'лет опыта' },
      ],
    },
  },

  {
    slug: 'terrassenbau-halle',
    serviceType: 'Terrassenbau',
    image: { de: '/images/landings/terrassenbau-halle-de.webp', ru: '/images/landings/terrassenbau-halle-ru.webp' },
    imageAspect: { de: 1.5, ru: 1.5 },
    imageAlt: {
      de: 'Moderne beleuchtete Terrasse an einem Wohnhaus mit Onebbau-Leistungsübersicht',
      ru: 'Современная освещённая терраса у жилого дома с описанием работ Onebbau',
    },
    keywords: [
      'Terrasse bauen Halle Saale',
      'Terrassenbau Halle',
      'Holzterrasse Halle',
      'WPC Terrasse verlegen Halle',
    ],
    related: ['hochbeet-nach-mass', 'gartenpflege-baumschnitt-halle', 'pflasterarbeiten-halle'],
    de: {
      metaTitle: 'Terrassenbau Halle (Saale) – Holz, WPC & Pflaster | Onebbau',
      metaDescription:
        'Terrasse bauen in Halle (Saale): Holz-, WPC- und Pflasterterrassen mit stabilem Unterbau. Beratung vor Ort, Festpreis, Umsetzung meist in 3–7 Tagen.',
      eyebrow: 'Terrassenbau',
      h1: 'Terrassenbau in Halle (Saale) – Holz, WPC und Naturstein',
      directAnswer:
        'Onebbau baut Terrassen in Halle (Saale) und Umgebung: Holz- und WPC-Dielen auf Unterkonstruktion sowie gepflasterte Terrassen mit frostsicherem Unterbau. Eine typische Terrasse mit 20–30 m² entsteht in 3–7 Arbeitstagen, inklusive Unterbau, Gefälle und sauberer Randabschlüsse.',
      intro:
        'Eine Terrasse hält nur so lange wie ihr Unterbau. Deshalb beginnen wir immer mit Tragschicht, Gefälle (ca. 2 % vom Haus weg) und Entwässerung – erst dann kommen Dielen oder Pflaster. Ob Lärche, sibirische Lärche, WPC oder Betonstein: Wir beraten ehrlich, was zu Nutzung, Lage und Budget passt.',
      benefitsTitle: 'Terrassen, die bleiben',
      benefits: [
        { title: 'Holz & WPC', text: 'Dielen auf justierbarer Unterkonstruktion – verdeckt verschraubt, mit Belüftung gegen Staunässe.' },
        { title: 'Pflaster & Naturstein', text: 'Frostsicherer Schichtaufbau, saubere Kanten, exaktes Gefälle – auch für Einfahrten geeignet.' },
        { title: 'Stufen & Einfassungen', text: 'Blockstufen, Beeteinfassungen, Übergänge zum Rasen – alles aus einer Hand.' },
        { title: 'Gartenlauben & Überdachung', text: 'Auf Wunsch bauen wir Lauben und einfache Überdachungen gleich mit.' },
      ],
      processTitle: 'Vom Rasen zur fertigen Terrasse',
      steps: [
        { title: 'Vor-Ort-Termin', text: 'Aufmaß, Bodencheck, Materialberatung mit Mustern.' },
        { title: 'Angebot & Planung', text: 'Festpreis mit Aufbauskizze und Materialliste in 2–5 Werktagen.' },
        { title: 'Unterbau', text: 'Aushub, Tragschicht, Verdichtung, Gefälle und Entwässerung.' },
        { title: 'Belag & Details', text: 'Dielen oder Pflaster, Randabschlüsse, Stufen, Endreinigung.' },
      ],
      priceTitle: 'Was kostet eine Terrasse in Halle?',
      priceText:
        'Richtwerte inkl. Unterbau und Material: WPC- oder Lärchenterrasse ab ca. 120–180 €/m², Pflasterterrasse ab ca. 90–140 €/m², Naturstein darüber. Hanglage, Stufen oder alte Beläge, die entsorgt werden müssen, beeinflussen den Preis – wir kalkulieren das transparent im Angebot.',
      priceRange: '€€ – Holz/WPC ab ca. 120 €/m²',
      areaTitle: 'Einsatzgebiet',
      areaText: AREA_DE,
      faqTitle: 'Häufige Fragen zum Terrassenbau',
      faq: [
        { q: 'Holz, WPC oder Pflaster – was ist besser?', a: 'Holz ist warm und natürlich, braucht aber Pflege (Ölen). WPC ist pflegeleicht und splitterfrei, wird in praller Sonne wärmer. Pflaster ist am langlebigsten und wintertauglich. Wir zeigen Muster und rechnen alle Varianten durch.' },
        { q: 'Braucht eine Terrasse eine Baugenehmigung?', a: 'Ebenerdige Terrassen sind in Sachsen-Anhalt in der Regel genehmigungsfrei. Bei Überdachungen oder Aufschüttungen kann es anders sein – wir weisen Sie im Angebot darauf hin.' },
        { q: 'Wie lange dauert der Bau?', a: 'Eine Terrasse mit 20–30 m² dauert meist 3–7 Arbeitstage, abhängig von Unterbau und Wetter.' },
        { q: 'Kann die alte Terrasse entsorgt werden?', a: 'Ja, Rückbau und Entsorgung alter Beläge übernehmen wir und weisen sie im Angebot separat aus.' },
        { q: 'Wann ist die beste Jahreszeit?', a: 'Frühjahr bis Herbst ist ideal. Beliebte Termine im Frühjahr sind schnell vergeben – für eine Terrasse zur Gartensaison lohnt die Anfrage im Winter.' },
      ],
      ctaTitle: 'Terrassen-Termin sichern',
      ctaText: 'Schicken Sie uns Maße oder ein Foto der Fläche – wir melden uns mit einer ersten Einschätzung.',
      ctaButton: 'Beratung anfragen',
      stats: [
        { value: 60, suffix: '+', label: 'gebaute Terrassen' },
        { value: 5, suffix: ' Tage', label: 'typische Bauzeit' },
        { value: 2, suffix: ' %', label: 'Gefälle – fachgerecht' },
      ],
    },
    ru: {
      metaTitle: 'Строительство террас в Halle (Saale) | Onebbau',
      metaDescription:
        'Террасы в Halle (Saale): дерево, WPC (ДПК) и брусчатка на надёжном основании. Консультация на месте, фиксированная цена, монтаж обычно за 3–7 дней.',
      eyebrow: 'Террасы',
      h1: 'Строительство террас в Halle (Saale)',
      directAnswer:
        'Onebbau строит террасы в Halle (Saale) и окрестностях: деревянный и ДПК-настил на регулируемой обрешётке, а также мощёные террасы на морозостойком основании. Терраса 20–30 м² обычно готова за 3–7 рабочих дней — с основанием, уклоном и аккуратными краями.',
      intro:
        'Терраса служит ровно столько, сколько её основание. Поэтому мы начинаем с несущего слоя, уклона ~2 % от дома и водоотвода — и только потом укладываем настил или камень. Лиственница, ДПК или бетонный камень — честно советуем, что подходит под вашу площадку и бюджет.',
      benefitsTitle: 'Террасы, которые служат',
      benefits: [
        { title: 'Дерево и ДПК', text: 'Настил на регулируемой обрешётке, скрытый крепёж, вентиляция от застоя влаги.' },
        { title: 'Брусчатка и камень', text: 'Морозостойкий «пирог», ровные края, точный уклон — подходит и для подъездов.' },
        { title: 'Ступени и ограждения', text: 'Блочные ступени, бордюры, переходы к газону — всё из одних рук.' },
        { title: 'Беседки и навесы', text: 'По желанию построим беседку или простой навес вместе с террасой.' },
      ],
      processTitle: 'От газона до готовой террасы',
      steps: [
        { title: 'Выезд на объект', text: 'Замеры, оценка грунта, образцы материалов.' },
        { title: 'Смета и план', text: 'Фиксированная цена со схемой «пирога» за 2–5 дней.' },
        { title: 'Основание', text: 'Выемка, несущий слой, трамбовка, уклон и водоотвод.' },
        { title: 'Настил и детали', text: 'Доска или камень, канты, ступени, финальная уборка.' },
      ],
      priceTitle: 'Сколько стоит терраса в Halle?',
      priceText:
        'Ориентиры с основанием и материалом: ДПК/лиственница от ~120–180 €/м², брусчатка от ~90–140 €/м², натуральный камень дороже. Склон, ступени и вывоз старого покрытия учитываем прозрачно в смете.',
      priceRange: '€€ — дерево/ДПК от ~120 €/м²',
      areaTitle: 'Зона работы',
      areaText: AREA_RU,
      faqTitle: 'Частые вопросы',
      faq: [
        { q: 'Дерево, ДПК или камень?', a: 'Дерево тёплое, но требует ухода; ДПК не требует ухода, но греется на солнце; камень самый долговечный и зимостойкий. Покажем образцы и просчитаем варианты.' },
        { q: 'Нужно ли разрешение на террасу?', a: 'Террасы на уровне земли в Саксонии-Анхальт обычно не требуют разрешения. Навесы и подсыпки — отдельный случай, предупредим в смете.' },
        { q: 'Сколько длится монтаж?', a: 'Терраса 20–30 м² — обычно 3–7 рабочих дней в зависимости от основания и погоды.' },
        { q: 'Вывезете ли старое покрытие?', a: 'Да, демонтаж и утилизацию берём на себя и показываем отдельной строкой в смете.' },
        { q: 'Когда лучше заказывать?', a: 'Строим с весны по осень. Весенние даты разбирают быстро — чтобы успеть к сезону, пишите зимой.' },
      ],
      ctaTitle: 'Забронировать выезд',
      ctaText: 'Пришлите размеры или фото площадки — дадим первую оценку.',
      ctaButton: 'Запросить консультацию',
      stats: [
        { value: 60, suffix: '+', label: 'построенных террас' },
        { value: 5, suffix: ' дней', label: 'типичный срок' },
        { value: 2, suffix: ' %', label: 'уклон — по правилам' },
      ],
    },
  },

  {
    slug: 'fassadendaemmung-halle',
    serviceType: 'Fassadendämmung (WDVS)',
    image: '/images/facade.webp',
    imageAlt: {
      de: 'Gedämmte und neu gestaltete Fassade eines Wohnhauses',
      ru: 'Утеплённый и обновлённый фасад жилого дома',
    },
    keywords: [
      'Fassadendämmung Halle Saale',
      'Fassade dämmen Kosten Halle',
      'WDVS Halle',
      'Fassadensanierung Halle',
    ],
    related: ['malerarbeiten-halle', 'trockenbau-halle', 'terrassenbau-halle'],
    de: {
      metaTitle: 'Fassadendämmung Halle (Saale) – WDVS & Fassadensanierung | Onebbau',
      metaDescription:
        'Fassadendämmung in Halle (Saale): WDVS, Putz und Anstrich für Ein- und Mehrfamilienhäuser. Bis zu 30 % weniger Heizkosten, förderfähig. Kostenlose Vor-Ort-Beratung.',
      eyebrow: 'Fassadendämmung',
      h1: 'Fassadendämmung in Halle (Saale) – Heizkosten senken, Fassade erneuern',
      directAnswer:
        'Onebbau dämmt Fassaden in Halle (Saale) mit Wärmedämmverbundsystemen (WDVS): Dämmplatten, Armierung, Oberputz und Anstrich in einem Arbeitsgang. Eine gedämmte Fassade senkt die Heizkosten typischerweise um 20–30 % und ist über BEG-Zuschüsse förderfähig. Ein Einfamilienhaus dauert je nach Größe 2–4 Wochen.',
      intro:
        'Viele Häuser in Halle – vom Gründerzeit-Altbau bis zum Siedlungshaus der 60er – verlieren den Großteil ihrer Wärme über ungedämmte Außenwände. Ein WDVS löst zwei Aufgaben zugleich: Der Energieverbrauch sinkt spürbar, und die Fassade sieht aus wie neu. Wir übernehmen Gerüst-Koordination, Dämmung, Putz und Anstrich.',
      benefitsTitle: 'Warum sich Dämmen rechnet',
      benefits: [
        { title: 'Bis zu 30 % weniger Heizkosten', text: 'Je nach Ausgangszustand sinkt der Verbrauch deutlich – bei steigenden Energiepreisen Jahr für Jahr bares Geld.' },
        { title: 'Förderfähig (BEG)', text: 'Fassadendämmung wird über die Bundesförderung für effiziente Gebäude bezuschusst – wir liefern die nötigen Unterlagen fürs Angebot.' },
        { title: 'Neue Optik inklusive', text: 'Oberputz in Wunschstruktur und -farbe: Sanierung und Verschönerung in einem Schritt.' },
        { title: 'Schutz der Bausubstanz', text: 'Warme Wandoberflächen reduzieren das Schimmelrisiko in Innenräumen spürbar.' },
      ],
      processTitle: 'So dämmen wir Ihre Fassade',
      steps: [
        { title: 'Vor-Ort-Analyse', text: 'Zustand von Putz und Untergrund, Dämmstärke-Empfehlung, Fördercheck.' },
        { title: 'Angebot & Planung', text: 'Festpreis mit Systemaufbau, Materialangaben und Zeitplan.' },
        { title: 'Gerüst & Dämmung', text: 'Kleben/Dübeln der Platten, Laibungen, Anschlüsse an Fenster und Sockel.' },
        { title: 'Armierung & Putz', text: 'Gewebespachtelung, Oberputz, Anstrich – inkl. Endabnahme.' },
      ],
      priceTitle: 'Was kostet Fassadendämmung in Halle?',
      priceText:
        'Richtwert für WDVS inkl. Gerüst, Material und Putz: ca. 140–220 €/m² Fassadenfläche, abhängig von Dämmstärke, Untergrund und Detailaufwand. Für ein typisches Einfamilienhaus (150 m² Fassade) ergibt das ca. 21.000–33.000 € – abzüglich möglicher BEG-Förderung von 15–20 %.',
      priceRange: '€€€ – WDVS ca. 140–220 €/m²',
      areaTitle: 'Einsatzgebiet',
      areaText: AREA_DE,
      faqTitle: 'Häufige Fragen zur Fassadendämmung',
      faq: [
        { q: 'Wie viel Heizkosten spart eine Fassadendämmung?', a: 'Bei ungedämmten Bestandsgebäuden sind 20–30 % Einsparung realistisch, in Kombination mit neuen Fenstern und Dachdämmung auch mehr. Die genaue Zahl hängt vom Ausgangszustand ab.' },
        { q: 'Gibt es Förderung?', a: 'Ja. Über die BEG (Einzelmaßnahmen) sind aktuell 15 % Zuschuss möglich, mit individuellem Sanierungsfahrplan 20 %. Voraussetzung ist ein Energieeffizienz-Experte – wir nennen Ihnen Ansprechpartner in der Region.' },
        { q: 'Welche Dämmstärke ist sinnvoll?', a: 'Üblich sind 14–16 cm EPS oder Mineralwolle, um die GEG-Anforderungen zu erfüllen und förderfähig zu sein. Wir rechnen die passende Stärke für Ihr Haus.' },
        { q: 'Wie lange dauert die Dämmung eines Einfamilienhauses?', a: 'Inklusive Gerüst, Dämmung, Putz und Anstrich meist 2–4 Wochen, wetterabhängig.' },
        { q: 'Geht das auch beim Altbau mit Stuck?', a: 'Bei Stuckfassaden ist Außendämmung oft nicht sinnvoll – hier beraten wir zu Alternativen wie Innendämmung oder gezielter Teilsanierung.' },
      ],
      ctaTitle: 'Fassaden-Check anfragen',
      ctaText: 'Wir schauen uns Ihre Fassade an und sagen Ihnen ehrlich, was sich lohnt – kostenlos in Halle und Umgebung.',
      ctaButton: 'Kostenlosen Fassaden-Check anfragen',
      stats: [
        { value: 30, suffix: ' %', label: 'weniger Heizkosten möglich' },
        { value: 20, suffix: ' %', label: 'BEG-Förderung möglich' },
        { value: 3, suffix: ' Wochen', label: 'typische Bauzeit EFH' },
      ],
    },
    ru: {
      metaTitle: 'Утепление фасада в Halle (Saale) — WDVS | Onebbau',
      metaDescription:
        'Утепление фасадов (WDVS) в Halle (Saale): утеплитель, армирование, штукатурка и покраска. До 30 % экономии на отоплении, возможны субсидии BEG.',
      eyebrow: 'Утепление фасада',
      h1: 'Утепление фасада в Halle (Saale) — меньше расходов на отопление',
      directAnswer:
        'Onebbau утепляет фасады в Halle (Saale) системами WDVS: плиты утеплителя, армирующий слой, декоративная штукатурка и покраска за один цикл работ. Утеплённый фасад обычно снижает расходы на отопление на 20–30 % и подпадает под субсидии BEG. Частный дом занимает 2–4 недели.',
      intro:
        'Многие дома в Halle — от грюндерцайта до построек 60-х — теряют большую часть тепла через неутеплённые стены. WDVS решает две задачи сразу: расходы на энергию заметно падают, а фасад выглядит как новый. Мы берём на себя леса, утепление, штукатурку и покраску.',
      benefitsTitle: 'Почему утепление окупается',
      benefits: [
        { title: 'До 30 % экономии', text: 'В зависимости от исходного состояния расход энергии падает ощутимо — при растущих ценах это деньги каждый год.' },
        { title: 'Субсидии BEG', text: 'Утепление фасада субсидируется государством — мы готовим нужные документы к смете.' },
        { title: 'Новый вид фасада', text: 'Штукатурка нужной фактуры и цвета: ремонт и обновление в один шаг.' },
        { title: 'Защита от плесени', text: 'Тёплые стены заметно снижают риск конденсата и плесени внутри.' },
      ],
      processTitle: 'Как мы утепляем фасад',
      steps: [
        { title: 'Анализ на месте', text: 'Состояние штукатурки и основания, расчёт толщины, проверка субсидий.' },
        { title: 'Смета и план', text: 'Фиксированная цена с описанием системы и сроками.' },
        { title: 'Леса и утеплитель', text: 'Приклейка/дюбелирование плит, откосы, примыкания к окнам и цоколю.' },
        { title: 'Армирование и штукатурка', text: 'Сетка, декоративный слой, покраска, приёмка.' },
      ],
      priceTitle: 'Сколько стоит утепление в Halle?',
      priceText:
        'Ориентир для WDVS с лесами, материалом и штукатуркой: ~140–220 €/м² фасада. Для типичного дома (150 м² фасада) это ~21 000–33 000 € минус возможная субсидия BEG 15–20 %.',
      priceRange: '€€€ — WDVS ~140–220 €/м²',
      areaTitle: 'Зона работы',
      areaText: AREA_RU,
      faqTitle: 'Частые вопросы',
      faq: [
        { q: 'Сколько экономит утепление?', a: 'Для неутеплённых домов реалистичны 20–30 % экономии, в связке с новыми окнами и крышей — больше. Точная цифра зависит от исходного состояния.' },
        { q: 'Есть ли субсидии?', a: 'Да, по программе BEG сейчас возможны 15 % (или 20 % с планом санации). Нужен энергоэксперт — подскажем контакты в регионе.' },
        { q: 'Какая толщина утеплителя нужна?', a: 'Обычно 14–16 см EPS или минваты, чтобы выполнить требования GEG и получить субсидию. Рассчитаем под ваш дом.' },
        { q: 'Сколько длится утепление дома?', a: 'С лесами, утеплением, штукатуркой и покраской — обычно 2–4 недели, зависит от погоды.' },
        { q: 'А если фасад с лепниной?', a: 'Для фасадов с лепниной наружное утепление часто нецелесообразно — посоветуем альтернативы: внутреннее утепление или частичную санацию.' },
      ],
      ctaTitle: 'Заказать осмотр фасада',
      ctaText: 'Осмотрим фасад и честно скажем, что имеет смысл — бесплатно в Halle и окрестностях.',
      ctaButton: 'Бесплатный осмотр фасада',
      stats: [
        { value: 30, suffix: ' %', label: 'экономия на отоплении' },
        { value: 20, suffix: ' %', label: 'возможная субсидия BEG' },
        { value: 3, suffix: ' нед.', label: 'типичный срок' },
      ],
    },
  },

  {
    slug: 'hochbeet-nach-mass',
    serviceType: 'Hochbeetbau',
    image: { de: '/images/landings/hochbeet-nach-mass-de.webp', ru: '/images/landings/hochbeet-nach-mass-ru.webp' },
    imageAspect: { de: 1.5, ru: 1.5 },
    imageAlt: {
      de: 'Individuell gefertigtes beleuchtetes Hochbeet auf einer modernen Terrasse',
      ru: 'Высокая грядка индивидуального изготовления с подсветкой на современной террасе',
    },
    keywords: [
      'Hochbeet nach Maß Halle',
      'Hochbeet bauen lassen Halle Saale',
      'Hochbeet Metall nach Maß',
      'Hochbeet Holz maßgefertigt',
    ],
    related: ['terrassenbau-halle', 'gartenpflege-baumschnitt-halle', 'zaunmontage-halle'],
    de: {
      metaTitle: 'Hochbeet nach Maß in Halle (Saale) – Holz & Metall | Onebbau',
      metaDescription:
        'Maßgefertigte Hochbeete aus Holz und Metall in Halle (Saale): geplant, gebaut und vor Ort montiert – inkl. Wühlmausgitter und Befüllung. Lieferung in 2–3 Wochen.',
      eyebrow: 'Hochbeete nach Maß',
      h1: 'Hochbeete nach Maß – gebaut in Halle (Saale)',
      directAnswer:
        'Onebbau fertigt Hochbeete nach Maß aus Lärchenholz oder Metall und montiert sie in Halle (Saale) und Umgebung – in jeder Größe, Höhe und Form, inklusive Wühlmausgitter, Noppenfolie und auf Wunsch fachgerechter Schichtbefüllung. Von der Anfrage bis zum fertigen Beet vergehen meist 2–3 Wochen.',
      intro:
        'Fertig-Hochbeete aus dem Baumarkt passen selten: zu niedrig, zu klein, falsches Material. Wir bauen Hochbeete exakt für Ihren Garten, Ihre Terrasse oder Ihren Innenhof – rückenfreundliche Arbeitshöhe, langlebige Konstruktion und eine Optik, die zum Haus passt. Auch als Serie für Kleingärten und Gemeinschaftsprojekte.',
      benefitsTitle: 'Ihr Hochbeet, Ihre Maße',
      benefits: [
        { title: 'Holz oder Metall', text: 'Sibirische Lärche, Douglasie oder pulverbeschichtetes/verzinktes Metall – langlebig und formstabil.' },
        { title: 'Jede Form', text: 'L-Form für die Ecke, schmal für den Balkon, rollstuhlunterfahrbar – wir zeichnen es vor.' },
        { title: 'Komplett montiert', text: 'Inklusive Wühlmausgitter, Folie und auf Wunsch Schichtbefüllung (Äste, Grünschnitt, Kompost, Erde).' },
        { title: 'Gebaut für Jahre', text: 'Konstruktive Holzschutz-Details und verstärkte Ecken – kein Aufquellen, kein Ausbeulen.' },
      ],
      processTitle: 'Vom Wunschmaß zum fertigen Beet',
      steps: [
        { title: 'Maße & Material', text: 'Sie nennen Platz und Wünsche – per Foto oder vor Ort.' },
        { title: 'Zeichnung & Preis', text: 'Skizze mit Maßen und Festpreis innerhalb weniger Tage.' },
        { title: 'Fertigung', text: 'Bau in unserer Werkstatt, Oberflächenbehandlung inklusive.' },
        { title: 'Montage & Befüllung', text: 'Aufbau bei Ihnen, ausgerichtet und auf Wunsch befüllt – startklar zum Bepflanzen.' },
      ],
      priceTitle: 'Was kostet ein Hochbeet nach Maß?',
      priceText:
        'Richtwerte inkl. Montage: Holz-Hochbeet 200×100×80 cm ab ca. 590 €, Metall-Hochbeet in gleicher Größe ab ca. 790 €. Sonderformen, Sitzkanten oder integrierte Rankgitter kalkulieren wir individuell. Befüllung nach Aufwand ab ca. 90 €.',
      priceRange: '€ – Holz ab ca. 590 €, Metall ab ca. 790 €',
      areaTitle: 'Liefer- und Montagegebiet',
      areaText: AREA_DE,
      faqTitle: 'Häufige Fragen zu Hochbeeten',
      faq: [
        { q: 'Welches Material hält am längsten?', a: 'Verzinktes oder pulverbeschichtetes Metall hält 20+ Jahre praktisch wartungsfrei. Lärche hält bei konstruktivem Holzschutz 10–15 Jahre und lässt sich nachölen. Beides bieten wir an.' },
        { q: 'Wie hoch sollte ein Hochbeet sein?', a: 'Für rückenfreundliches Arbeiten empfehlen wir 75–90 cm, je nach Körpergröße. Für Kinderbeete oder Sitzkanten-Beete sind 40–60 cm sinnvoll.' },
        { q: 'Baut ihr auch auf Terrassen oder gepflasterten Flächen?', a: 'Ja. Auf versiegelten Flächen bauen wir Beete mit geschlossenem Boden und Drainageschicht, damit kein Wasser unkontrolliert austritt.' },
        { q: 'Wie schnell bekomme ich mein Hochbeet?', a: 'Von der Bestellung bis zur Montage meist 2–3 Wochen. Im Frühjahr empfehlen wir frühzeitige Anfrage.' },
        { q: 'Übernehmt ihr auch die Befüllung?', a: 'Ja – klassisch in Schichten: grober Baum-/Strauchschnitt, Grünschnitt, Kompost, hochwertige Pflanzerde. Dann können Sie sofort pflanzen.' },
      ],
      ctaTitle: 'Wunschmaß anfragen',
      ctaText: 'Schreiben Sie uns Länge × Breite × Höhe und das Wunschmaterial – Sie erhalten Skizze und Festpreis.',
      ctaButton: 'Hochbeet-Angebot anfordern',
      stats: [
        { value: 100, suffix: '+', label: 'gefertigte Hochbeete' },
        { value: 3, suffix: ' Wochen', label: 'von Anfrage bis Montage' },
        { value: 20, suffix: '+ Jahre', label: 'Haltbarkeit Metall' },
      ],
    },
    ru: {
      metaTitle: 'Высокие грядки на заказ в Halle (Saale) | Onebbau',
      metaDescription:
        'Высокие грядки (Hochbeet) на заказ из дерева и металла в Halle (Saale): проектируем, изготавливаем и монтируем — с сеткой от грызунов и заполнением. 2–3 недели.',
      eyebrow: 'Грядки на заказ',
      h1: 'Высокие грядки на заказ — производство в Halle (Saale)',
      directAnswer:
        'Onebbau изготавливает высокие грядки (Hochbeet) на заказ из лиственницы или металла и монтирует их в Halle (Saale) и окрестностях — любого размера, высоты и формы, с сеткой от полёвок, плёнкой и по желанию правильным послойным заполнением. От заявки до готовой грядки — обычно 2–3 недели.',
      intro:
        'Готовые грядки из строймаркета редко подходят: слишком низкие, маленькие, не тот материал. Мы делаем грядки точно под ваш сад, террасу или двор — удобная высота для спины, долговечная конструкция и вид, который подходит дому. Также серии для дачных товариществ и общих проектов.',
      benefitsTitle: 'Ваша грядка, ваши размеры',
      benefits: [
        { title: 'Дерево или металл', text: 'Сибирская лиственница, дугласия или оцинкованный/окрашенный металл — надолго и без деформаций.' },
        { title: 'Любая форма', text: 'Г-образная в угол, узкая на балкон, с подъездом для коляски — сначала нарисуем.' },
        { title: 'Полный монтаж', text: 'Сетка от грызунов, плёнка и по желанию послойное заполнение (ветки, компост, земля).' },
        { title: 'На годы', text: 'Конструктивная защита древесины и усиленные углы — без разбухания и выпучивания.' },
      ],
      processTitle: 'От размеров до готовой грядки',
      steps: [
        { title: 'Размеры и материал', text: 'Пришлите место и пожелания — фото или осмотр.' },
        { title: 'Эскиз и цена', text: 'Чертёж с размерами и фиксированная цена за несколько дней.' },
        { title: 'Изготовление', text: 'Сборка в мастерской, обработка поверхности включена.' },
        { title: 'Монтаж и заполнение', text: 'Установка у вас, выравнивание, по желанию заполнение — можно сразу сажать.' },
      ],
      priceTitle: 'Сколько стоит грядка на заказ?',
      priceText:
        'Ориентиры с монтажом: деревянная 200×100×80 см от ~590 €, металлическая того же размера от ~790 €. Нестандартные формы, сидячие борта и шпалеры считаем индивидуально. Заполнение от ~90 €.',
      priceRange: '€ — дерево от ~590 €, металл от ~790 €',
      areaTitle: 'Зона доставки и монтажа',
      areaText: AREA_RU,
      faqTitle: 'Частые вопросы',
      faq: [
        { q: 'Какой материал долговечнее?', a: 'Оцинкованный или окрашенный металл служит 20+ лет без ухода. Лиственница — 10–15 лет, можно обновлять маслом. Делаем и то и другое.' },
        { q: 'Какая высота удобна?', a: 'Для работы без нагрузки на спину — 75–90 см в зависимости от роста. Для детских грядок и грядок с сидячим бортом — 40–60 см.' },
        { q: 'Ставите ли на террасы и плитку?', a: 'Да: на твёрдых покрытиях делаем закрытое дно с дренажным слоем, чтобы вода не уходила бесконтрольно.' },
        { q: 'Как быстро будет готово?', a: 'От заказа до монтажа — обычно 2–3 недели. Весной лучше обращаться заранее.' },
        { q: 'Заполняете ли грядку?', a: 'Да, классическими слоями: крупные ветки, зелёная масса, компост, качественный грунт. Можно сажать сразу.' },
      ],
      ctaTitle: 'Запросить расчёт',
      ctaText: 'Напишите длину × ширину × высоту и материал — пришлём эскиз и фиксированную цену.',
      ctaButton: 'Получить расчёт грядки',
      stats: [
        { value: 100, suffix: '+', label: 'изготовленных грядок' },
        { value: 3, suffix: ' нед.', label: 'от заявки до монтажа' },
        { value: 20, suffix: '+ лет', label: 'срок службы металла' },
      ],
    },
  },

  {
    slug: 'gartenpflege-baumschnitt-halle',
    serviceType: 'Gartenpflege und Baumschnitt',
    image: { de: '/images/landings/gartenpflege-baumschnitt-halle-de.webp', ru: '/images/landings/gartenpflege-baumschnitt-halle-ru.webp' },
    imageAspect: { de: 2, ru: 2 },
    imageAlt: {
      de: 'Gärtner beim fachgerechten Baumschnitt in einem gepflegten Garten in Halle',
      ru: 'Садовник профессионально обрезает дерево в ухоженном саду в Halle',
    },
    keywords: [
      'Gartenpflege Halle Saale',
      'Baumschnitt Halle',
      'Obstbaumschnitt Halle Saale',
      'Heckenschnitt Halle',
    ],
    related: ['hochbeet-nach-mass', 'terrassenbau-halle', 'zaunmontage-halle'],
    de: {
      metaTitle: 'Gartenpflege & Baumschnitt Halle (Saale) | Onebbau',
      metaDescription:
        'Gartenpflege in Halle (Saale): Baumschnitt, Obstbaumschnitt, Heckenschnitt, Gartenreinigung mit Entsorgung. Feste Termine, faire Pauschalen, auch regelmäßige Pflege.',
      eyebrow: 'Gartenpflege & Baumschnitt',
      h1: 'Gartenpflege und Baumschnitt in Halle (Saale)',
      directAnswer:
        'Onebbau übernimmt Gartenpflege in Halle (Saale): fachgerechten Baum- und Obstbaumschnitt, Heckenschnitt, Strauchpflege sowie Gartenreinigung inklusive Abtransport und Entsorgung des Schnittguts. Einzeltermine oder regelmäßige Pflege im Abo – mit fester Terminzusage und Pauschalpreis nach Besichtigung.',
      intro:
        'Ein Garten macht Freude, wenn ihn jemand pflegt. Wir schneiden Obstbäume so, dass sie tragen, Hecken so, dass sie dicht bleiben, und hinterlassen den Garten aufgeräumt – Schnittgut nehmen wir gleich mit. Für Vermieter und Eigentümergemeinschaften bieten wir regelmäßige Pflege mit fester Route.',
      benefitsTitle: 'Was wir im Garten übernehmen',
      benefits: [
        { title: 'Obstbaumschnitt', text: 'Erziehungs-, Erhaltungs- und Verjüngungsschnitt zur richtigen Jahreszeit – für gesunde, tragende Bäume.' },
        { title: 'Hecken & Sträucher', text: 'Formschnitt und Rückschnitt unter Beachtung der Schnittzeiten (Vogelschutz, §39 BNatSchG).' },
        { title: 'Gartenreinigung', text: 'Laub, Wildwuchs, Beete, Wege – einmalig zur Saison oder regelmäßig.' },
        { title: 'Entsorgung inklusive', text: 'Schnittgut und Grünabfälle nehmen wir mit und entsorgen sie fachgerecht.' },
      ],
      processTitle: 'So einfach geht es',
      steps: [
        { title: 'Kurzbesichtigung', text: 'Wir schauen uns Garten, Bäume und Zufahrt an.' },
        { title: 'Pauschalangebot', text: 'Fester Preis pro Einsatz oder als Pflege-Abo.' },
        { title: 'Ausführung', text: 'Zum vereinbarten Termin, mit eigenem Werkzeug und Abtransport.' },
        { title: 'Aufgeräumte Übergabe', text: 'Wege gefegt, Grünschnitt verladen – fertig.' },
      ],
      priceTitle: 'Was kostet Gartenpflege in Halle?',
      priceText:
        'Richtwerte: Obstbaumschnitt ab ca. 60–120 € pro Baum (je nach Größe), Heckenschnitt ab ca. 4–8 €/lfm inkl. Entsorgung, Gartenreinigung nach Aufwand ab ca. 45 €/Std. inkl. Abtransport. Nach der Besichtigung erhalten Sie eine feste Pauschale.',
      priceRange: '€ – Obstbaum ab ca. 60 €, Hecke ab ca. 4 €/lfm',
      areaTitle: 'Einsatzgebiet',
      areaText: AREA_DE,
      faqTitle: 'Häufige Fragen zur Gartenpflege',
      faq: [
        { q: 'Wann ist die beste Zeit für den Obstbaumschnitt?', a: 'Kernobst (Apfel, Birne) idealerweise im Spätwinter (Februar/März), Steinobst wie Kirsche nach der Ernte im Sommer. Wir planen den Schnitt zur passenden Zeit.' },
        { q: 'Darf man Hecken das ganze Jahr schneiden?', a: 'Radikale Rückschnitte sind vom 1. März bis 30. September gesetzlich untersagt (§39 BNatSchG). Form- und Pflegeschnitte sind ganzjährig erlaubt – wir beraten, was bei Ihrer Hecke geht.' },
        { q: 'Nehmt ihr das Schnittgut mit?', a: 'Ja, Abtransport und Entsorgung sind bei uns Teil des Angebots – Sie müssen nichts zur Deponie fahren.' },
        { q: 'Bietet ihr regelmäßige Pflege an?', a: 'Ja, z. B. 4–8 Einsätze pro Jahr mit festem Leistungsumfang – beliebt bei Vermietern und Eigentümern, die den Garten nicht selbst pflegen möchten.' },
        { q: 'Fällt ihr auch Bäume?', a: 'Kleinere Fällungen und starke Rückschnitte übernehmen wir; für Großbäume mit Seilklettertechnik arbeiten wir mit Spezialisten zusammen und organisieren das für Sie.' },
      ],
      ctaTitle: 'Gartentermin anfragen',
      ctaText: 'Schicken Sie ein Foto von Baum, Hecke oder Garten – wir nennen Ihnen schnell eine Pauschale.',
      ctaButton: 'Pauschalangebot anfordern',
      stats: [
        { value: 300, suffix: '+', label: 'geschnittene Bäume & Hecken' },
        { value: 100, suffix: '%', label: 'Entsorgung inklusive' },
        { value: 8, suffix: 'x', label: 'Pflege-Abo bis zu /Jahr' },
      ],
    },
    ru: {
      metaTitle: 'Уход за садом и обрезка деревьев в Halle (Saale) | Onebbau',
      metaDescription:
        'Уход за садом в Halle (Saale): обрезка плодовых деревьев, стрижка живых изгородей, уборка сада с вывозом. Фиксированные цены, разовые и регулярные выезды.',
      eyebrow: 'Сад и деревья',
      h1: 'Уход за садом и обрезка деревьев в Halle (Saale)',
      directAnswer:
        'Onebbau ухаживает за садами в Halle (Saale): профессиональная обрезка плодовых деревьев, стрижка живых изгородей, уборка сада с погрузкой и вывозом обрезков. Разовые выезды или регулярное обслуживание — с фиксированной датой и паушальной ценой после осмотра.',
      intro:
        'Сад радует, когда за ним ухаживают. Мы обрезаем плодовые деревья так, чтобы они плодоносили, изгороди — чтобы оставались плотными, и оставляем участок убранным: обрезки забираем сразу. Для арендодателей и товариществ — регулярное обслуживание по графику.',
      benefitsTitle: 'Что мы берём на себя',
      benefits: [
        { title: 'Обрезка плодовых', text: 'Формирующая, поддерживающая и омолаживающая обрезка в правильный сезон.' },
        { title: 'Изгороди и кусты', text: 'Формовка и обрезка с учётом сроков (защита птиц, §39 BNatSchG).' },
        { title: 'Уборка сада', text: 'Листва, поросль, грядки, дорожки — разово к сезону или регулярно.' },
        { title: 'Вывоз включён', text: 'Обрезки и зелёные отходы забираем и утилизируем сами.' },
      ],
      processTitle: 'Как это работает',
      steps: [
        { title: 'Короткий осмотр', text: 'Смотрим сад, деревья и подъезд.' },
        { title: 'Паушальная цена', text: 'Фиксированная цена за выезд или абонемент.' },
        { title: 'Выполнение', text: 'В согласованную дату, со своим инструментом и вывозом.' },
        { title: 'Чистая сдача', text: 'Дорожки подметены, обрезки погружены — готово.' },
      ],
      priceTitle: 'Сколько стоит уход за садом?',
      priceText:
        'Ориентиры: обрезка плодового дерева от ~60–120 € (по размеру), изгородь от ~4–8 €/пог.м с вывозом, уборка сада от ~45 €/час с вывозом. После осмотра — фиксированная паушальная цена.',
      priceRange: '€ — дерево от ~60 €, изгородь от ~4 €/пог.м',
      areaTitle: 'Зона работы',
      areaText: AREA_RU,
      faqTitle: 'Частые вопросы',
      faq: [
        { q: 'Когда лучше обрезать плодовые?', a: 'Семечковые (яблоня, груша) — в конце зимы (февраль–март), косточковые (вишня) — летом после урожая. Планируем обрезку в правильный срок.' },
        { q: 'Можно ли стричь изгородь круглый год?', a: 'Радикальная обрезка запрещена с 1 марта по 30 сентября (§39 BNatSchG); формовочная стрижка разрешена весь год. Подскажем, что можно у вас.' },
        { q: 'Забираете ли обрезки?', a: 'Да, вывоз и утилизация входят в предложение — вам не нужно ехать на свалку.' },
        { q: 'Есть ли регулярное обслуживание?', a: 'Да, например 4–8 выездов в год с фиксированным объёмом — удобно арендодателям и занятым владельцам.' },
        { q: 'Спиливаете ли деревья?', a: 'Небольшие спилы и сильную обрезку делаем сами; для больших деревьев с промышленным альпинизмом привлекаем специалистов и всё организуем.' },
      ],
      ctaTitle: 'Запросить выезд',
      ctaText: 'Пришлите фото дерева, изгороди или сада — быстро назовём паушальную цену.',
      ctaButton: 'Получить цену',
      stats: [
        { value: 300, suffix: '+', label: 'обрезанных деревьев и изгородей' },
        { value: 100, suffix: '%', label: 'вывоз включён' },
        { value: 8, suffix: 'x', label: 'выездов в год по абонементу' },
      ],
    },
  },
];

export function getLanding(slug: string): Landing | undefined {
  return landings.find((l) => l.slug === slug);
}

export function getLandingContent(landing: Landing, locale: string): LandingContent {
  return locale === 'ru' ? landing.ru : landing.de;
}

export function getLandingImage(landing: Landing, locale: string): string {
  if (typeof landing.image === 'string') return landing.image;
  return locale === 'ru' ? landing.image.ru : landing.image.de;
}

export function getLandingImageAspect(landing: Landing, locale: string): number {
  return landing.imageAspect?.[locale === 'ru' ? 'ru' : 'de'] ?? 4 / 3;
}

export function getLandingImageAlt(landing: Landing, locale: string): string {
  return locale === 'ru' ? landing.imageAlt.ru : landing.imageAlt.de;
}
