import { config } from './config';
import {
  WordPressPost,
  WordPressPage,
  WordPressMedia,
  WordPressCategory,
  WordPressTag,
  WordPressComment,
  WordPressAuthor,
  WordPressMenu,
  WordPressMenuLocation,
  WordPressNavigation,
  WordPressNavigationItem
} from '../types/wordpress';

class ApiError extends Error {
  constructor(public status: number, message: string, public url?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const REQUIRED_POST_FIELDS = [
  'id',
  'title',
  'slug',
  'excerpt',
  'date',
  'featured_media',
  'categories',
  'tags',
  'author',
  '_links',
  '_embedded',
  'acf.cooking_time',
  'acf.difficulty'
];

const REQUIRED_CATEGORY_FIELDS = [
  'id',
  'name',
  'slug',
  'count'
];

const REQUIRED_TAG_FIELDS = [
  'id',
  'name',
  'slug',
  'count'
];

export class WordPressService {
  private static async fetchAPI<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const queryString = new URLSearchParams(params).toString();
    const url = `${config.wordpressApi.baseUrl}${endpoint}${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await fetch(url, {
        next: {
          revalidate: config.revalidateTime,
          tags: [endpoint.split('/')[1]], // Add cache tags based on endpoint type
        }
      });

      if (!response.ok) {
        throw new ApiError(
          response.status,
          `WordPress API error: ${response.statusText}`,
          url
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(500, 'Failed to fetch data from WordPress API', url);
    }
  }

  // Posts with optimized fields
  static async getPosts(page = 1, perPage = config.pagination.defaultPageSize): Promise<WordPressPost[]> {
    try {
      return await this.fetchAPI<WordPressPost[]>(config.wordpressApi.endpoints.posts, {
        page: page.toString(),
        per_page: Math.min(perPage, config.pagination.maxPageSize).toString(),
        _embed: 'author,wp:featuredmedia,wp:term',
        _fields: REQUIRED_POST_FIELDS.join(','),
        orderby: 'date',
        order: 'desc',
      });
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  // Get post by slug with recipe data
  static async getPostBySlug(slug: string): Promise<WordPressPost> {
    try {
      const posts = await this.fetchAPI<WordPressPost[]>(config.wordpressApi.endpoints.posts, {
        slug,
        _embed: 'author,wp:featuredmedia,wp:term',
        _fields: REQUIRED_POST_FIELDS.join(','),
      });

      if (!posts.length) {
        throw new ApiError(404, `Post with slug "${slug}" not found`);
      }

      return posts[0];
    } catch (error) {
      console.error(`Error fetching post with slug ${slug}:`, error);
      throw error;
    }
  }

  // Recipe-specific methods
  static async getRecipeDetails(postId: number): Promise<{
    recipe_details?: unknown;
    cooking_time?: string;
    difficulty?: string;
    servings?: string;
    ingredients?: string[];
    instructions?: string[];
  }> {
    return this.fetchAPI(`${config.wordpressApi.endpoints.posts}/${postId}`, {
      _fields: 'acf.recipe_details,acf.cooking_time,acf.difficulty,acf.servings,acf.ingredients,acf.instructions',
    });
  }

  // Advanced search with filters
  static async searchWithFilters(params: {
    query?: string;
    categories?: number[];
    tags?: number[];
    cookingTime?: string;
    difficulty?: string;
    page?: number;
    perPage?: number;
  }): Promise<WordPressPost[]> {
    const searchParams: Record<string, string> = {
      search: params.query || '',
      page: params.page?.toString() || '1',
      per_page: (params.perPage || config.pagination.defaultPageSize).toString(),
      _embed: 'author,wp:featuredmedia,wp:term',
      _fields: REQUIRED_POST_FIELDS.join(','),
    };

    if (params.categories?.length) {
      searchParams.categories = params.categories.join(',');
    }
    if (params.tags?.length) {
      searchParams.tags = params.tags.join(',');
    }

    // Add meta queries for recipe-specific filters
    if (params.cookingTime || params.difficulty) {
      searchParams.meta_query = JSON.stringify({
        relation: 'AND',
        ...(params.cookingTime && {
          cooking_time: {
            key: 'cooking_time',
            value: params.cookingTime,
            compare: '=',
          },
        }),
        ...(params.difficulty && {
          difficulty: {
            key: 'difficulty',
            value: params.difficulty,
            compare: '=',
          },
        }),
      });
    }

    return this.fetchAPI<WordPressPost[]>(config.wordpressApi.endpoints.posts, searchParams);
  }

  // Categories with optimized fields
  static async getCategories(): Promise<WordPressCategory[]> {
    try {
      return await this.fetchAPI<WordPressCategory[]>(config.wordpressApi.endpoints.categories, {
        per_page: '100',
        _fields: REQUIRED_CATEGORY_FIELDS.join(','),
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Tags with optimized fields
  static async getTags(): Promise<WordPressTag[]> {
    try {
      return await this.fetchAPI<WordPressTag[]>(config.wordpressApi.endpoints.tags, {
        per_page: '100',
        _fields: REQUIRED_TAG_FIELDS.join(','),
        hide_empty: 'true',
      });
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  }

  // Pages
  static async getPages(page = 1, perPage = config.pagination.defaultPageSize): Promise<WordPressPage[]> {
    return this.fetchAPI<WordPressPage[]>(config.wordpressApi.endpoints.pages, {
      page: page.toString(),
      per_page: Math.min(perPage, config.pagination.maxPageSize).toString(),
      _embed: 'true',
    });
  }

  static async getPageBySlug(slug: string): Promise<WordPressPage> {
    const pages = await this.fetchAPI<WordPressPage[]>(config.wordpressApi.endpoints.pages, {
      slug,
      _embed: 'true',
    });

    if (!pages.length) {
      throw new ApiError(404, `Page with slug "${slug}" not found`);
    }

    return pages[0];
  }

  // Posts by Category
  static async getPostsByCategory(
    categoryId: number,
    page = 1,
    perPage = config.pagination.defaultPageSize
  ): Promise<WordPressPost[]> {
    return this.fetchAPI<WordPressPost[]>(config.wordpressApi.endpoints.posts, {
      categories: categoryId.toString(),
      page: page.toString(),
      per_page: Math.min(perPage, config.pagination.maxPageSize).toString(),
      _embed: 'true',
    });
  }

  // Tags
  static async getPostsByTag(
    tagId: number,
    page = 1,
    perPage = config.pagination.defaultPageSize
  ): Promise<WordPressPost[]> {
    try {
      return await this.fetchAPI<WordPressPost[]>(config.wordpressApi.endpoints.posts, {
        tags: tagId.toString(),
        page: page.toString(),
        per_page: Math.min(perPage, config.pagination.maxPageSize).toString(),
        _embed: 'wp:featuredmedia,wp:term,author',
      });
    } catch (error) {
      console.error(`Error fetching posts for tag ${tagId}:`, error);
      throw error;
    }
  }

  // Media
  static async getMedia(mediaId: number): Promise<WordPressMedia> {
    return this.fetchAPI<WordPressMedia>(`${config.wordpressApi.endpoints.media}/${mediaId}`);
  }

  // Comments
  static async getComments(postId: number): Promise<WordPressComment[]> {
    return this.fetchAPI<WordPressComment[]>(config.wordpressApi.endpoints.comments, {
      post: postId.toString(),
      _embed: 'true',
    });
  }

  // Authors
  static async getAuthor(authorId: number): Promise<WordPressAuthor> {
    return this.fetchAPI<WordPressAuthor>(`${config.wordpressApi.endpoints.users}/${authorId}`, {
      _embed: 'true',
    });
  }

  static async getAuthorBySlug(slug: string): Promise<WordPressAuthor> {
    const users = await this.fetchAPI<WordPressAuthor[]>(config.wordpressApi.endpoints.users, {
      slug,
      _embed: 'true',
    });

    if (!users.length) {
      throw new ApiError(404, `Author with slug "${slug}" not found`);
    }

    return users[0];
  }

  // Search
  static async search(
    query: string,
    page = 1,
    perPage = config.pagination.defaultPageSize
  ): Promise<WordPressPost[]> {
    return this.fetchAPI<WordPressPost[]>(config.wordpressApi.endpoints.posts, {
      search: query,
      page: page.toString(),
      per_page: Math.min(perPage, config.pagination.maxPageSize).toString(),
      _embed: 'true',
      orderby: 'relevance'
    });
  }

  // Menus
  static async getMenus(): Promise<WordPressMenu[]> {
    return this.fetchAPI<WordPressMenu[]>(config.wordpressApi.endpoints.menus);
  }

  static async getMenuLocations(): Promise<Record<string, WordPressMenuLocation>> {
    return this.fetchAPI(config.wordpressApi.endpoints.menuLocations);
  }

  static async getMenuByLocation(location: string): Promise<WordPressNavigationItem[]> {
    return this.fetchAPI<WordPressNavigationItem[]>(
      `${config.wordpressApi.endpoints.menuLocations}/${location}`
    );
  }

  static async getNavigation(id: number): Promise<WordPressNavigation> {
    return this.fetchAPI<WordPressNavigation>(
      `${config.wordpressApi.endpoints.navigation}/${id}`
    );
  }

  static async getNavigationItems(navigationId: number): Promise<WordPressNavigationItem[]> {
    return this.fetchAPI<WordPressNavigationItem[]>(
      `${config.wordpressApi.endpoints.navigationItems}?navigation=${navigationId}`
    );
  }

  // Advanced Queries
  static async getPostsByAuthor(
    authorId: number,
    page = 1,
    perPage = config.pagination.defaultPageSize
  ): Promise<WordPressPost[]> {
    return this.fetchAPI<WordPressPost[]>(config.wordpressApi.endpoints.posts, {
      author: authorId.toString(),
      page: page.toString(),
      per_page: Math.min(perPage, config.pagination.maxPageSize).toString(),
      _embed: 'true',
    });
  }

  static async getRecentPosts(limit = 5): Promise<WordPressPost[]> {
    return this.fetchAPI<WordPressPost[]>(config.wordpressApi.endpoints.posts, {
      per_page: limit.toString(),
      _fields: 'id,title,slug',
      orderby: 'date',
      order: 'desc',
    });
  }

  static async getRelatedPosts(postId: number, categoryIds: number[], limit = 3): Promise<WordPressPost[]> {
    return this.fetchAPI<WordPressPost[]>(config.wordpressApi.endpoints.posts, {
      categories: categoryIds.join(','),
      exclude: postId.toString(),
      per_page: limit.toString(),
      _embed: 'true',
    });
  }

  // Advanced Queries
  static async getPopularPosts(limit = 5): Promise<WordPressPost[]> {
    return this.fetchAPI<WordPressPost[]>(config.wordpressApi.endpoints.posts, {
      orderby: 'comment_count',
      order: 'desc',
      per_page: limit.toString(),
      _embed: 'true',
    });
  }

  static async getFeaturedPosts(): Promise<WordPressPost[]> {
    return this.fetchAPI<WordPressPost[]>(config.wordpressApi.endpoints.posts, {
      sticky: 'true',
      _embed: 'true',
    });
  }

  static async getPostsByDate(year: number, month?: number): Promise<WordPressPost[]> {
    const after = month 
      ? new Date(year, month - 1, 1).toISOString()
      : new Date(year, 0, 1).toISOString();
    
    const before = month
      ? new Date(year, month, 0).toISOString()
      : new Date(year + 1, 0, 0).toISOString();

    return this.fetchAPI<WordPressPost[]>(config.wordpressApi.endpoints.posts, {
      after,
      before,
      _embed: 'true',
    });
  }

  // Meta Queries
  static async getTotalPosts(): Promise<number> {
    const response = await fetch(`${config.wordpressApi.baseUrl}${config.wordpressApi.endpoints.posts}?per_page=1`);
    const totalPosts = response.headers.get('X-WP-Total');
    return totalPosts ? parseInt(totalPosts, 10) : 0;
  }

  static async getTotalPages(): Promise<number> {
    const response = await fetch(`${config.wordpressApi.baseUrl}${config.wordpressApi.endpoints.posts}?per_page=1`);
    const totalPages = response.headers.get('X-WP-TotalPages');
    return totalPages ? parseInt(totalPages, 10) : 0;
  }

  // Custom Post Types (if your WordPress site uses them)
  static async getCustomPosts(postType: string, page = 1, perPage = config.pagination.defaultPageSize): Promise<WordPressPost[]> {
    return this.fetchAPI(`/${postType}`, {
      page: page.toString(),
      per_page: Math.min(perPage, config.pagination.maxPageSize).toString(),
      _embed: 'true',
    });
  }

  // Advanced Filtering
  static async getPostsByTaxonomy(taxonomy: string, term: string): Promise<WordPressPost[]> {
    return this.fetchAPI<WordPressPost[]>(config.wordpressApi.endpoints.posts, {
      [taxonomy]: term,
      _embed: 'true',
    });
  }

  static async searchPostsByKeyword(keyword: string, type: string = 'post'): Promise<WordPressPost[]> {
    return this.fetchAPI<WordPressPost[]>(config.wordpressApi.endpoints.search, {
      search: keyword,
      type,
      _embed: 'true',
    });
  }

  // Archive Methods
  static async getArchiveMonths(): Promise<Array<{ year: number; month: number; count: number }>> {
    return this.fetchAPI('/archives', {
      type: 'monthly',
    });
  }

  static async getPostsByArchive(year: number, month?: number): Promise<WordPressPost[]> {
    const after = month 
      ? new Date(year, month - 1, 1).toISOString()
      : new Date(year, 0, 1).toISOString();
    
    const before = month
      ? new Date(year, month, 0).toISOString()
      : new Date(year + 1, 0, 0).toISOString();

    return this.fetchAPI<WordPressPost[]>(config.wordpressApi.endpoints.posts, {
      after,
      before,
      _embed: 'true',
    });
  }

  // Taxonomy Methods
  static async getTaxonomies(): Promise<Array<{ name: string; slug: string; }>> {
    return this.fetchAPI('/taxonomies');
  }

  static async getTermsByTaxonomy(taxonomy: string): Promise<Array<{ id: number; name: string; slug: string; }>> {
    return this.fetchAPI(`/${taxonomy}`);
  }

  // Settings and Site Info
  static async getSiteInfo(): Promise<{
    name: string;
    description: string;
    url: string;
    home: string;
    gmt_offset: number;
    timezone_string: string;
  }> {
    return this.fetchAPI('');
  }

  // Post Types
  static async getPostTypes(): Promise<Array<{ 
    name: string; 
    slug: string;
    description: string;
    hierarchical: boolean;
  }>> {
    return this.fetchAPI('/types');
  }

  // Comments
  static async getRecentComments(limit = 5): Promise<WordPressComment[]> {
    return this.fetchAPI<WordPressComment[]>(config.wordpressApi.endpoints.comments, {
      per_page: limit.toString(),
      _embed: 'true',
    });
  }

  static async submitComment(postId: number, comment: {
    author_name: string;
    author_email: string;
    content: string;
    parent?: number;
  }): Promise<WordPressComment> {
    const response = await fetch(`${config.wordpressApi.baseUrl}${config.wordpressApi.endpoints.comments}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post: postId,
        ...comment,
      }),
    });

    if (!response.ok) {
      throw new ApiError(
        response.status,
        `Failed to submit comment: ${response.statusText}`
      );
    }

    return response.json();
  }

  // Navigation
  static async getNextPost(postId: number): Promise<WordPressPost | null> {
    const posts = await this.fetchAPI<WordPressPost[]>(config.wordpressApi.endpoints.posts, {
      after: new Date(postId).toISOString(),
      order: 'asc',
      per_page: '1',
      _embed: 'true',
    });
    return posts[0] || null;
  }

  static async getPreviousPost(postId: number): Promise<WordPressPost | null> {
    const posts = await this.fetchAPI<WordPressPost[]>(config.wordpressApi.endpoints.posts, {
      before: new Date(postId).toISOString(),
      per_page: '1',
      _embed: 'true',
    });
    return posts[0] || null;
  }
} 