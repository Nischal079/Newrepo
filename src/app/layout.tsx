import type { Metadata } from 'next';
import { AppProviders } from '@/components/providers/AppProviders';
import { AppLayout } from '@/components/AppLayout';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

export const metadata: Metadata = {
  title: 'NightHub Assets',
  description: 'Discover, like, and chat about your next asset.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <AppProviders>
          <AppLayout>{children}</AppLayout>
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
