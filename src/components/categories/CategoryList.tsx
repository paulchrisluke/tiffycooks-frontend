import { WordPressCategory } from '@/types/wordpress';
import Link from 'next/link';

interface CategoryListProps {
  categories: WordPressCategory[];
}

function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Categories</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/category/${category.slug}`}
              className="flex items-center justify-between text-gray-600 hover:text-blue-600"
            >
              <span>{category.name}</span>
              <span className="text-sm text-gray-400">({category.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList; 