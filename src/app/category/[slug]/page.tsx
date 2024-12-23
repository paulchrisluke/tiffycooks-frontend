import { WordPressService } from '@/lib/wordpress-api';
import { notFound } from 'next/navigation';
import PostGrid from '@/components/posts/PostGrid';
import Pagination from '@/components/shared/Pagination';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

async function CategoryPosts({ categoryId, page }: { categoryId: number; page: number }) {
  const posts = await WordPressService.getPostsByCategory(categoryId, page);
  
  if (!posts.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No posts found in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PostGrid posts={posts} />
      <Pagination currentPage={page} totalPages={5} />
    </div>
  );
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const currentPage = Number(searchParams.page) || 1;

  try {
    const category = await WordPressService.getCategoryBySlug(params.slug);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600">{category.description}</p>
          )}
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <CategoryPosts categoryId={category.id} page={currentPage} />
        </Suspense>
      </div>
    );
  } catch (error) {
    notFound();
  }
} 