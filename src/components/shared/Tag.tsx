import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Tag as TagIcon } from 'lucide-react';

interface TagProps {
  name: string;
  slug: string;
  count?: number;
  className?: string;
  showIcon?: boolean;
}

function Tag({ name, slug, count, className, showIcon = false }: TagProps) {
  return (
    <Link
      href={`/tag/${slug}`}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full",
        "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
        "transition-colors duration-200",
        className
      )}
    >
      {showIcon && <TagIcon className="h-3 w-3" />}
      <span>{name}</span>
      {typeof count === 'number' && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </Link>
  );
}

export default Tag; 