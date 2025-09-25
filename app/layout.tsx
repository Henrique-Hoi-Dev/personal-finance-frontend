import type { Metadata } from 'next';
import { Inter, Dancing_Script } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
});

export const metadata: Metadata = {
  title: 'FinanceApp',
  description: 'Aplicativo de finanças pessoais',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} ${dancingScript.variable}`}>
        {children}
      </body>
    </html>
  );
}
