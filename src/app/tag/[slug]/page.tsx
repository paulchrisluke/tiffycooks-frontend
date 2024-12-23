import { WordPressService } from '@/lib/wordpress-api';
import { config } from '@/lib/config';
import { notFound } from 'next/navigation';
import PostGrid from '@/components/posts/PostGrid';
import Tag from '@/components/shared/Tag';

export const revalidate = config.revalidateTime;

interface TagPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

export async function generateMetadata({ params }: TagPageProps) {
  try {
    const tags = await WordPressService.getTags();
    const tag = tags.find(t => t.slug === params.slug);
    
    if (!tag) {
      return {
        title: 'Tag Not Found',
        description: 'The requested tag could not be found.',
      };
    }

    return {
      title: `${tag.name} - TiffyCooks`,
      description: `Browse all recipes tagged with ${tag.name}`,
    };
  } catch (error) {
    return {
      title: 'Tag Not Found',
      description: 'The requested tag could not be found.',
    };
  }
}

async function TagPage({ params, searchParams }: TagPageProps) {
  try {
    const tags = await WordPressService.getTags();
    const tag = tags.find(t => t.slug === params.slug);
    
    if (!tag) {
      notFound();
    }

    const page = Number(searchParams.page) || 1;
    const posts = await WordPressService.getPostsByTag(tag.id, page);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Tag name={tag.name} slug={tag.slug} count={tag.count} showIcon className="text-base px-4 py-1.5" />
          <p className="mt-4 text-muted-foreground">
            Browse all recipes tagged with {tag.name}
          </p>
        </div>
        <PostGrid posts={posts} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}

export default TagPage; 