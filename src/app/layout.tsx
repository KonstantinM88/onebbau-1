import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  icons: {
    icon: [{url: '/favicon.ico', type: 'image/x-icon'}],
    shortcut: ['/favicon.ico'],
    apple: [{url: '/favicon.ico'}]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}
