'use client';

import { Refrigerator } from 'lucide-react';
import Link from 'next/link';

export function Header({ freezerName }: { freezerName: string }) {

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <Refrigerator className="h-7 w-7 text-primary" />
            <span className="font-headline text-xl font-bold">FreezerFriend</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
            <h1 className="text-lg font-semibold text-muted-foreground">{freezerName}</h1>
        </div>
        <div className="w-16 h-10"></div>
      </div>
    </header>
  );
}
