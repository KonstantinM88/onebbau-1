import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MarkdownContentProps = {
  content: string;
  compact?: boolean;
  className?: string;
};

function createComponents(compact: boolean): Components {
  const paragraphClass = compact
    ? 'mb-4 leading-7 text-anthracite-600'
    : 'mb-5 leading-[1.8] text-anthracite-600';
  const listClass = compact
    ? 'my-4 ml-5 space-y-2 leading-7 text-anthracite-600'
    : 'my-5 ml-6 space-y-2.5 leading-[1.8] text-anthracite-600';

  return {
    h1: ({ node: _node, ...props }) => (
      <h2
        className={compact
          ? 'mb-3 mt-6 font-heading text-2xl font-bold leading-tight text-anthracite-900'
          : 'mb-4 mt-10 font-heading text-2xl font-bold leading-tight text-anthracite-900 sm:text-3xl'}
        {...props}
      />
    ),
    h2: ({ node: _node, ...props }) => (
      <h2
        className={compact
          ? 'mb-3 mt-6 font-heading text-xl font-bold leading-tight text-anthracite-900'
          : 'mb-4 mt-10 font-heading text-xl font-bold leading-tight text-anthracite-900 sm:text-2xl'}
        {...props}
      />
    ),
    h3: ({ node: _node, ...props }) => (
      <h3
        className={compact
          ? 'mb-2.5 mt-5 font-heading text-lg font-bold leading-tight text-anthracite-900'
          : 'mb-3 mt-8 font-heading text-lg font-bold leading-tight text-anthracite-900 sm:text-xl'}
        {...props}
      />
    ),
    h4: ({ node: _node, ...props }) => (
      <h4 className="mb-2 mt-6 text-base font-bold leading-tight text-anthracite-900" {...props} />
    ),
    p: ({ node: _node, ...props }) => <p className={paragraphClass} {...props} />,
    strong: ({ node: _node, ...props }) => (
      <strong className="font-semibold text-anthracite-900" {...props} />
    ),
    em: ({ node: _node, ...props }) => <em className="italic" {...props} />,
    a: ({ node: _node, href, ...props }) => {
      const isExternal = href?.startsWith('http://') || href?.startsWith('https://');

      return (
        <a
          href={href}
          className="font-semibold text-brand-orange underline decoration-brand-orange/30 underline-offset-4 transition-colors hover:text-brand-orange-dark"
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          {...props}
        />
      );
    },
    ul: ({ node: _node, ...props }) => <ul className={`${listClass} list-disc marker:text-brand-orange`} {...props} />,
    ol: ({ node: _node, ...props }) => <ol className={`${listClass} list-decimal marker:text-brand-orange`} {...props} />,
    li: ({ node: _node, ...props }) => <li className="pl-1" {...props} />,
    blockquote: ({ node: _node, ...props }) => (
      <blockquote
        className={compact
          ? 'my-5 border-l-4 border-brand-orange/40 bg-white px-4 py-3 text-anthracite-600'
          : 'my-7 border-l-4 border-brand-orange/40 bg-anthracite-50 px-5 py-4 text-anthracite-600'}
        {...props}
      />
    ),
    hr: ({ node: _node, ...props }) => (
      <hr className={compact ? 'my-6 border-anthracite-200' : 'my-8 border-anthracite-200'} {...props} />
    ),
    code: ({ node: _node, className, children, ...props }) => (
      <code
        className={`rounded bg-anthracite-100 px-1.5 py-0.5 font-mono text-[0.9em] text-anthracite-800 ${className || ''}`}
        {...props}
      >
        {children}
      </code>
    ),
    pre: ({ node: _node, ...props }) => (
      <pre
        className="my-5 overflow-x-auto rounded-xl bg-anthracite-950 p-4 text-sm leading-6 text-white"
        {...props}
      />
    ),
    table: ({ node: _node, ...props }) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm" {...props} />
      </div>
    ),
    th: ({ node: _node, ...props }) => (
      <th className="border border-anthracite-200 bg-anthracite-50 px-3 py-2 font-semibold text-anthracite-900" {...props} />
    ),
    td: ({ node: _node, ...props }) => (
      <td className="border border-anthracite-200 px-3 py-2 text-anthracite-600" {...props} />
    ),
    img: ({ node: _node, alt, ...props }) => (
      // Markdown images are user-authored article content, so keep them as normal responsive images.
      <img className="my-7 h-auto w-full rounded-2xl" alt={alt || ''} {...props} />
    ),
  };
}

export default function MarkdownContent({ content, compact = false, className = '' }: MarkdownContentProps) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={createComponents(compact)}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
