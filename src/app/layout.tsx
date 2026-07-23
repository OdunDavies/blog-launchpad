import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://muscleatlas.site'),
  title: {
    default: 'MuscleAtlas - Free Exercise Library & AI Workout Generator',
    template: '%s | MuscleAtlas',
  },
  description:
    'Browse 100+ exercises with video demos, AI-powered workout plans, and progress tracking. Free fitness app for Nigerian gym-goers.',
  openGraph: {
    title: 'MuscleAtlas - Free Exercise Library & AI Workout Generator',
    description:
      'Browse 100+ exercises with video demos, AI-powered workout plans, and progress tracking.',
    url: 'https://muscleatlas.site',
    siteName: 'MuscleAtlas',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MuscleAtlas',
    description: 'Free Exercise Library & AI Workout Generator',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
