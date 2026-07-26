import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://himalayan.billingapps.online';
  
  const routes = [
    '',
    '/login',
    '/forgot',
    '/enquiries',
    '/quotations',
    '/quotations/new',
    '/bookings',
    '/billing',
    '/vehicles',
    '/drivers',
    '/corporate',
    '/routes',
    '/reports',
    '/users',
    '/settings',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));
}
