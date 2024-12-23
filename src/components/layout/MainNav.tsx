'use client';

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/search/SearchBar";

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-6 md:gap-10">
      <Link href="/" className="hidden md:block">
        <span className="font-bold">TiffyCooks</span>
      </Link>
      <nav className={cn("flex items-center gap-6", className)}>
        <Link
          href="/blog"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/blog"
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          Blog
        </Link>
        <Link
          href="/categories"
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === "/categories"
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          Categories
        </Link>
      </nav>
      <SearchBar />
    </div>
  );
} 