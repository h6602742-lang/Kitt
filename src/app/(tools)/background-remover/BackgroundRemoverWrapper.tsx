'use client';

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

export default function BackgroundRemoverWrapper() {
  return <BackgroundRemoverClient />;
}
