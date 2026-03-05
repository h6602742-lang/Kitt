import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const BackgroundRemoverClient = dynamic(() => import('./ToolClient'), {
  ssr: false,
  loading: () => (
    <div className="max-w-6xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  ),
});

export const metadata: Metadata = {
  title: 'AI Background Remover',
  description: 'Instantly remove the background from any image with a single click. Free, private, and supports bulk processing.',
};

export default function BackgroundRemoverPage() {
  return <BackgroundRemoverClient />;
}
