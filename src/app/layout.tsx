import type {Metadata} from 'next';
import './globals.css';

const FAVICON_VERSION = '20260223';

export const metadata: Metadata = {
  icons: {
    icon: [{url: `/favicon.ico?v=${FAVICON_VERSION}`, type: 'image/x-icon'}],
    shortcut: [`/favicon.ico?v=${FAVICON_VERSION}`],
    apple: [{url: `/favicon.ico?v=${FAVICON_VERSION}`}]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
