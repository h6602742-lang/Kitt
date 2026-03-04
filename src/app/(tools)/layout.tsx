import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MonetagAd from '@/components/MonetagAd';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b bg-background/80 backdrop-blur-sm">
        <Button asChild variant="ghost" size="icon" className="mr-4">
          <Link href="/">
            <ArrowLeft className="size-5" />
            <span className="sr-only">Back to home</span>
          </Link>
        </Button>
        <Link href="/" className="font-bold font-headline text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">CreatorKit</Link>
      </header>
      <main className="flex-1 p-4 md:p-8">
        {children}
        <MonetagAd />
      </main>
    </div>
  );
}
