import { WordPressService } from '@/lib/wordpress-api';
import { config } from '@/lib/config';
import Link from 'next/link';
import PostGrid from '@/components/posts/PostGrid';
import CategoryList from '@/components/categories/CategoryList';
import SearchBar from '@/components/search/SearchBar';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Suspense } from 'react';

export const revalidate = config.revalidateTime;

async function BlogPosts() {
  try {
    const [posts, categories] = await Promise.all([
      WordPressService.getPosts(1, 12),
      WordPressService.getCategories(),
    ]);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <PostGrid posts={posts} />
        </div>
        <aside>
          <CategoryList categories={categories} />
        </aside>
      </div>
    );
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Unable to load blog posts
        </h2>
        <p className="text-gray-600 mb-6">
          We're having trouble connecting to our content server. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }
}

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="mb-8">
        <SearchBar />
      </div>
      <Suspense fallback={<LoadingSpinner />}>
        <BlogPosts />
      </Suspense>
    </div>
  );
} 