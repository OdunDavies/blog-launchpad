import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.muscleatlas.site'

  const routes = [
    '',
    '/app',
    '/about',
    '/contact',
    '/dashboard',
    '/exercises',
    '/blog',
    '/privacy',
    '/terms',
    '/profile',
  ]

  return routes.map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))
}
