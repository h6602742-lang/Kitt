import type { MetadataRoute } from 'next';

// IMPORTANT: Replace with your actual domain
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://creatorkit.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
