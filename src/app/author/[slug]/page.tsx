import { WordPressService } from '@/lib/wordpress-api';
import { notFound } from 'next/navigation';
import PostGrid from '@/components/posts/PostGrid';
import AuthorCard from '@/components/authors/AuthorCard';
import Pagination from '@/components/shared/Pagination';
import { Suspense } from 'react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface AuthorPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

async function AuthorPosts({ authorId, page }: { authorId: number; page: number }) {
  const posts = await WordPressService.getPostsByAuthor(authorId, page);
  
  if (!posts.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No posts found by this author.</p>
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

export default async function AuthorPage({ params, searchParams }: AuthorPageProps) {
  const currentPage = Number(searchParams.page) || 1;

  try {
    // Note: We'll need to implement getAuthorBySlug in WordPressService
    const author = await WordPressService.getAuthorBySlug(params.slug);
    const posts = await WordPressService.getPostsByAuthor(author.id, 1);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <AuthorCard author={author} postCount={posts.length} />
        </div>

        <h2 className="text-2xl font-bold mb-6">Posts by {author.name}</h2>
        
        <Suspense fallback={<LoadingSpinner />}>
          <AuthorPosts authorId={author.id} page={currentPage} />
        </Suspense>
      </div>
    );
  } catch (error) {
    notFound();
  }
} 