export const config = {
  wordpressApi: {
    baseUrl: 'https://tiffycooks.com/wp-json/wp/v2',
    endpoints: {
      posts: '/posts/',
      pages: '/pages/',
      media: '/media/',
      categories: '/categories/',
      tags: '/tags/',
      comments: '/comments/',
      users: '/users/',
      search: '/search/',
      menus: '/menus/',
      menuItems: '/menu-items/',
      menuLocations: '/menu-locations/',
      navigation: '/navigation/',
      navigationItems: '/navigation-items/'
    }
  },
  pagination: {
    defaultPageSize: 12,
    maxPageSize: 100
  },
  revalidateTime: 3600 // 1 hour
} as const; 