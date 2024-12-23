import './globals.css';
import { cookies } from 'next/headers';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/Sidebar';
import { WordPressService } from '@/lib/wordpress-api';
import { Suspense } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TiffyCooks',
  description: 'Delicious recipes and cooking tips by Tiffy',
};

async function getSidebarData() {
  try {
    const [categories, recentPosts] = await Promise.all([
      WordPressService.getCategories(),
      WordPressService.getRecentPosts(5),
    ]);
    return { categories, recentPosts };
  } catch (error) {
    console.error('Error fetching sidebar data:', error);
    return { categories: [], recentPosts: [] };
  }
}

function LoadingSidebar() {
  return (
    <div className="p-6">
      <div className="animate-pulse space-y-6">
        <div className="h-6 bg-muted rounded w-3/4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded w-full"></div>
          ))}
        </div>
        <div className="h-6 bg-muted rounded w-1/2 mt-8"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 bg-muted rounded w-full"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  const { categories, recentPosts } = await getSidebarData();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SidebarProvider defaultOpen={defaultOpen}>
          <div className="flex min-h-screen">
            <Suspense fallback={<LoadingSidebar />}>
              <AppSidebar categories={categories} recentPosts={recentPosts} />
            </Suspense>
            <main className="flex-1 relative">
              <SidebarTrigger className="p-4" />
              <div className="container mx-auto px-4 py-8 relative">
                {children}
              </div>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
