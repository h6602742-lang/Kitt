import type { MetadataRoute } from 'next';

const siteUrl = 'https://kitt-kappa.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '/',
    '/image-compressor',
    '/smart-cropper',
    '/format-converter',
    '/hashtag-generator',
    '/background-remover',
    '/social-media-optimizer',
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }));
}
