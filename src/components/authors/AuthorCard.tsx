'use client';

import { WordPressAuthor } from '@/types/wordpress';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { UserCircle } from 'lucide-react';

interface AuthorCardProps {
  author: WordPressAuthor;
  postCount?: number;
}

function AuthorCard({ author, postCount }: AuthorCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Safely get the avatar URL
  const getAvatarUrl = () => {
    if (!author.avatar_urls) return null;
    return author.avatar_urls['96'] || author.avatar_urls['48'] || author.avatar_urls['24'] || null;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <div className="flex items-center space-x-4 mb-4">
        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
          {!imageError && avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={author.name || 'Author avatar'}
              fill
              sizes="64px"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <UserCircle className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{author.name || 'Anonymous Author'}</h2>
          {typeof postCount === 'number' && (
            <p className="text-muted-foreground text-sm">
              {postCount} {postCount === 1 ? 'post' : 'posts'}
            </p>
          )}
        </div>
      </div>
      {author.description && (
        <p className="text-muted-foreground mb-4">{author.description}</p>
      )}
      {author.slug && (
        <Link
          href={`/author/${author.slug}`}
          className="text-primary hover:text-primary/90"
        >
          View all posts →
        </Link>
      )}
    </div>
  );
}

export default AuthorCard; 