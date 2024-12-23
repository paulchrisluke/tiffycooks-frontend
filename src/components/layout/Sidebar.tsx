'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
} from '@/components/ui/sidebar';
import { Home, Search, Book, Tag, Clock, Utensils, Coffee } from 'lucide-react';

// Main Navigation section
function MainNavigation() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/blog">
                <Book className="h-4 w-4" />
                <span>All Recipes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// Recipe Categories section
function RecipeCategories({ categories }: { categories: Array<{ id: number; name: string; slug: string }> }) {
  // Group categories by first letter
  const groupedCategories = categories.reduce((acc, category) => {
    const firstLetter = category.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(category);
    return acc;
  }, {} as Record<string, typeof categories>);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recipe Categories</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/categories">
                <Utensils className="h-4 w-4" />
                <span>All Categories</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {Object.entries(groupedCategories)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, cats]) => (
              <SidebarMenuItem key={letter}>
                <SidebarMenuButton className="font-semibold">
                  {letter}
                </SidebarMenuButton>
                <div className="pl-4">
                  <SidebarMenu>
                    {cats.map((category) => (
                      <SidebarMenuItem key={category.id}>
                        <SidebarMenuButton asChild>
                          <Link href={`/category/${category.slug}`}>
                            <span>{category.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </div>
              </SidebarMenuItem>
            ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

// Recent Recipes section
function RecentRecipes({ recentPosts }: { recentPosts: Array<{ id: number; title: { rendered: string }; slug: string }> }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Recent Recipes</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {recentPosts.map((post) => (
            <SidebarMenuItem key={post.id}>
              <SidebarMenuButton asChild>
                <Link href={`/blog/${post.slug}`}>
                  <Coffee className="h-4 w-4" />
                  <span>{post.title.rendered}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar({
  categories,
  recentPosts
}: {
  categories?: Array<{ id: number; name: string; slug: string }>;
  recentPosts?: Array<{ id: number; title: { rendered: string }; slug: string }>;
}) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4">
          <Link href="/" className="text-xl font-bold">
            TiffyCooks
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <MainNavigation />
        
        {categories && categories.length > 0 && (
          <RecipeCategories categories={categories} />
        )}

        {recentPosts && recentPosts.length > 0 && (
          <RecentRecipes recentPosts={recentPosts} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/search">
                <Search className="h-4 w-4" />
                <span>Search Recipes</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
} 