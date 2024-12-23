'use client';

import { WordPressPost } from '@/types/wordpress';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ImageIcon, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Tag from '@/components/shared/Tag';

interface PostCardProps {
  post: WordPressPost;
  className?: string;
}

function PostCard({ post, className }: PostCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Get the featured image from _embedded if available, fallback to yoast
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url 
    || post.yoast_head_json?.og_image?.[0]?.url;

  // Get the author from _embedded
  const author = post._embedded?.author?.[0];
  const authorAvatar = author?.avatar_urls?.['48'] || author?.avatar_urls?.['24'];
  
  // Create a safe excerpt from either the excerpt or content field
  const getExcerpt = () => {
    if (post.excerpt?.rendered) {
      return post.excerpt.rendered;
    }
    if (post.content?.rendered) {
      // Strip HTML and limit to ~150 characters
      const stripped = post.content.rendered.replace(/<[^>]*>/g, '');
      return stripped.length > 150 ? `${stripped.slice(0, 150)}...` : stripped;
    }
    return '';
  };

  // Format the date safely
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  return (
    <article className={cn(
      "bg-card rounded-lg shadow-sm overflow-hidden border border-border",
      className
    )}>
      <div className="relative h-48 w-full bg-muted">
        {!imageError && featuredImage ? (
          <Image
            src={featuredImage}
            alt={post.title?.rendered || 'Blog post image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={() => setImageError(true)}
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary">
            <span dangerouslySetInnerHTML={{ __html: post.title?.rendered || 'Untitled Post' }} />
          </Link>
        </h2>
        {getExcerpt() && (
          <div 
            className="text-muted-foreground line-clamp-3 mb-4"
            dangerouslySetInnerHTML={{ __html: getExcerpt() }}
          />
        )}
        {post._embedded?.['wp:term']?.[1]?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post._embedded['wp:term'][1].map((tag: any) => (
              <Tag key={tag.id} name={tag.name} slug={tag.slug} />
            ))}
          </div>
        )}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            {author && (
              <Link 
                href={`/author/${author.slug}`}
                className="flex items-center gap-2 hover:text-primary"
              >
                {authorAvatar ? (
                  <Image
                    src={authorAvatar}
                    alt={author.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <User className="h-4 w-4" />
                )}
                <span>{author.name}</span>
              </Link>
            )}
            {post.date && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </div>
            )}
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="text-primary hover:text-primary/90"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PostCard; 