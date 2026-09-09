import type { Metadata } from 'next';
import '../styles/globals.css';

// Open Graph URLs must be absolute. On Vercel this resolves itself from the
// project's stable production domain; set NEXT_PUBLIC_SITE_URL to override it
// with a custom domain once one is attached.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined);

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: 'Sudhang Sahu — Data Engineer & ML Systems Builder',
  description:
    'Portfolio of Sudhang Sahu — data engineer and ML systems builder working across production data pipelines, applied GenAI, and the embedded layer underneath them. Raipur, India.',
  keywords: [
    'Sudhang Sahu',
    'Data Engineer',
    'Machine Learning',
    'Data Pipelines',
    'Apache Airflow',
    'RAG',
    'Portfolio',
  ],
  authors: [{ name: 'Sudhang Sahu' }],
  openGraph: {
    title: 'Sudhang Sahu — Data Engineer & ML Systems Builder',
    description:
      'Pipelines, telemetry, and applied GenAI — shipped from first principles.',
    type: 'website',
    locale: 'en_IN',
    // og:image comes from app/opengraph-image.tsx, generated at build time.
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sudhang Sahu — Data Engineer & ML Systems Builder',
    description:
      'Pipelines, telemetry, and applied GenAI — shipped from first principles.',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
