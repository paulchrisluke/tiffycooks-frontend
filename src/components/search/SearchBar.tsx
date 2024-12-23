'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Loader2, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SearchBarProps {
  className?: string;
}

function SearchBar({ className }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  // Get initial values from URL
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [cookingTime, setCookingTime] = useState(searchParams.get('time') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');

  const handleSearch = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (cookingTime) params.set('time', cookingTime);
      if (difficulty) params.set('difficulty', difficulty);

      router.push(`/search?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setQuery('');
    setCookingTime('');
    setDifficulty('');
    router.push('/search');
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <div className="relative flex-1">
        <Input
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-full"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3"
          onClick={handleSearch}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Recipes</SheetTitle>
            <SheetDescription>
              Refine your search with these filters
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cooking Time</label>
              <select
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                className="w-full rounded-md border p-2"
              >
                <option value="">Any time</option>
                <option value="15">Under 15 mins</option>
                <option value="30">Under 30 mins</option>
                <option value="45">Under 45 mins</option>
                <option value="60">Under 1 hour</option>
                <option value="90">Under 1.5 hours</option>
                <option value="120">Under 2 hours</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-md border p-2"
              >
                <option value="">Any difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSearch} className="flex-1">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Apply Filters
              </Button>
              <Button onClick={handleReset} variant="outline">
                Reset
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default SearchBar; 