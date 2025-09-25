import type { ReactNode } from 'react';
import './globals.css';

import { Inter, Dancing_Script } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const dancing = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      lang="pt-BR"
      className={`${inter.variable} ${dancing.variable}`}
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
