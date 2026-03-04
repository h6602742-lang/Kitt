import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Link from 'next/link';

// IMPORTANT: Replace with your actual domain and social media handle.
const siteConfig = {
  name: 'CreatorKit',
  description: 'A free micro-toolkit for modern creators. Compress images, generate AI hashtags, crop photos, and convert formats—all in your browser.',
  url: 'https://kitt-kappa.vercel.app',
  ogImage: 'https://kitt-kappa.vercel.app/og.png', // Create this image and place it in the /public folder
  twitterHandle: '@yourhandle',
};


export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Free Tools for Modern Creators`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  manifest: '/manifest.json',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.twitterHandle,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#16181C" />
         {/* Google AdSense Script. The client ID is set in the .env file. */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="font-body antialiased">
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">{children}</main>
            <footer className="p-4 text-center text-sm text-muted-foreground border-t">
               <div className="flex justify-center gap-4">
                  <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
                  <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
                </div>
                <p className="mt-2">Built with ❤️ for the creator community.</p>
            </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
