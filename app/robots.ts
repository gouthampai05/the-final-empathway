import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://empathway.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/blogs/', '/login', '/register'],
        disallow: [
          '/dashboard',
          '/therapist',
          '/email_list',
          '/api/',
          '/_next/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
