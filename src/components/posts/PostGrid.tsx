import { WordPressPost } from '@/types/wordpress';
import PostCard from './PostCard';

interface PostGridProps {
  posts: WordPressPost[];
  columns?: 2 | 3 | 4;
}

function PostGrid({ posts, columns = 3 }: PostGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

export default PostGrid; 