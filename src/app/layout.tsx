import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://bracket-esports.vercel.app'
  ),
  title: 'Bracket Esports - Premium Tournament Platform',
  description:
    'Join competitive esports tournaments, connect your gaming accounts, and compete for points and rankings.',
  keywords:
    'esports, gaming, tournaments, competition, ranking, gaming platform',
  openGraph: {
    title: 'Bracket Esports - Premium Tournament Platform',
    description:
      'Join competitive esports tournaments and compete for points and rankings.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} gaming-bg min-h-screen`}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f1f5f9',
                border: '1px solid #334155',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
