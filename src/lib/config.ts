export const config = {
  wordpressApi: {
    baseUrl: 'https://tiffycooks.com/wp-json',
    endpoints: {
      posts: '/wp/v2/posts',
      pages: '/wp/v2/pages',
      media: '/wp/v2/media',
      categories: '/wp/v2/categories',
      tags: '/wp/v2/tags',
      comments: '/wp/v2/comments',
      users: '/wp/v2/users',
      search: '/wp/v2/search',
      menus: '/menus/v1/menus',
      menuItems: '/menus/v1/menus'
    }
  },
  siteConfig: {
    domain: process.env.NEXT_PUBLIC_SITE_DOMAIN || 'tiffycooks.com',
    title: 'TiffyCooks',
    description: 'Delicious recipes and cooking tips'
  },
  // ISR default revalidation time (in seconds)
  revalidateTime: 3600, // 1 hour
  // Default pagination settings
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 100
  }
} 