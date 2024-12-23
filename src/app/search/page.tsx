import { WordPressService } from '@/lib/wordpress-api';
import { config } from '@/lib/config';
import { notFound } from 'next/navigation';
import PostGrid from '@/components/posts/PostGrid';
import SearchBar from '@/components/search/SearchBar';

export const revalidate = 0; // Don't cache search results

interface SearchPageProps {
  searchParams: {
    q?: string;
    category?: string;
    tag?: string;
    time?: string;
    difficulty?: string;
    page?: string;
  };
}

async function SearchPage({ searchParams }: SearchPageProps) {
  try {
    // Fetch categories and tags for filters
    const [categories, tags] = await Promise.all([
      WordPressService.getCategories(),
      WordPressService.getTags(),
    ]);

    // Parse search parameters
    const page = Number(searchParams.page) || 1;
    const searchQuery = searchParams.q?.trim();
    const categoryIds = searchParams.category ? [Number(searchParams.category)] : undefined;
    const tagIds = searchParams.tag ? [Number(searchParams.tag)] : undefined;
    const cookingTime = searchParams.time;
    const difficulty = searchParams.difficulty;

    // Fetch posts with filters
    const posts = await WordPressService.searchWithFilters({
      query: searchQuery,
      categories: categoryIds,
      tags: tagIds,
      cookingTime,
      difficulty,
      page,
      perPage: config.pagination.defaultPageSize,
    });

    // Create search description
    const getSearchDescription = () => {
      const parts = [];
      if (searchQuery) parts.push(`matching "${searchQuery}"`);
      if (categoryIds?.length) {
        const category = categories.find(c => c.id === categoryIds[0]);
        if (category) parts.push(`in ${category.name}`);
      }
      if (tagIds?.length) {
        const tag = tags.find(t => t.id === tagIds[0]);
        if (tag) parts.push(`tagged with ${tag.name}`);
      }
      if (cookingTime) {
        const time = Number(cookingTime);
        parts.push(`under ${time} minutes`);
      }
      if (difficulty) {
        parts.push(`with ${difficulty} difficulty`);
      }
      
      return parts.length 
        ? `Showing recipes ${parts.join(' ')}`
        : 'Search our recipes';
    };

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-4">Recipe Search</h1>
          <SearchBar 
            categories={categories} 
            tags={tags}
            className="mb-4"
          />
          <p className="text-muted-foreground">
            {getSearchDescription()}
          </p>
        </div>

        {posts.length > 0 ? (
          <PostGrid posts={posts} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No recipes found</h2>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Search error:', error);
    notFound();
  }
}

export default SearchPage; 