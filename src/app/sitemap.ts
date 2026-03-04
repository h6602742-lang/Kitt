import type { MetadataRoute } from 'next';

// IMPORTANT: Replace with your actual domain
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://creatorkit.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/image-compressor',
    '/smart-cropper',
    '/format-converter',
    '/hashtag-generator',
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }));
}
