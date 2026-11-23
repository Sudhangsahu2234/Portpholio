import type { Metadata, Viewport } from "next";
import { profile } from "@/lib/profile";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const TITLE = `${profile.name} — ${profile.targetRole}`;
const DESCRIPTION =
  "Explore Sudhang Sahu’s work in software and data engineering, from industrial telemetry pipelines and applied AI to web applications and robotics.";

export const metadata: Metadata = {
  metadataBase: siteUrl ?? new URL("http://localhost:3000"),
  title: { default: TITLE, template: `%s · ${profile.name}` },
  description: DESCRIPTION,
  applicationName: profile.name,
  authors: [{ name: profile.name, url: profile.contact.linkedin }],
  creator: profile.name,
  alternates: siteUrl ? { canonical: "./" } : undefined,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl ? "./" : undefined,
    siteName: profile.name,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#16488b",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.targetRole,
  email: `mailto:${profile.contact.email}`,
  url: siteUrl?.origin,
  sameAs: [profile.contact.linkedin, profile.contact.github],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Raipur",
    addressRegion: "Chhattisgarh",
    addressCountry: "IN",
  },
  knowsAbout: Object.values(profile.skills).flat(),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema).replace(/</g, "\\u003c") }} />
        <a href="#main-content" className="skip-link">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
