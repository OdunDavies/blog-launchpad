import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.muscleatlas.site'),
  title: {
    default: 'MuscleAtlas — Free Exercise Library, AI Workouts & Diet Planner',
    template: '%s | MuscleAtlas',
  },
  description:
    'Browse 100+ exercises with video demos, AI-powered workout plans, diet planner, and progress tracking. Free fitness app for Nigerian gym-goers.',
  openGraph: {
    title: 'MuscleAtlas — Free Exercise Library, AI Workouts & Diet Planner',
    description:
      'Browse 100+ exercises with video demos, AI-powered workout plans, diet planner, and progress tracking. Free fitness app for every level.',
    url: 'https://www.muscleatlas.site',
    siteName: 'MuscleAtlas',
    locale: 'en_NG',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MuscleAtlas — Free Exercise Library & AI Workouts',
    description: 'Browse 100+ exercises, AI workout plans, diet planner, and progress tracking.',
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/',
  },
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
