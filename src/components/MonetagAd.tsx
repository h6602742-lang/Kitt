'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';

// Replace with your actual Monetag Banner/In-Page Push Zone ID
const MONETAG_ZONE_ID = 'YOUR_BANNER_ZONE_ID';

const MonetagAd = ({ className }: { className?: string }) => {

  useEffect(() => {
    // The Monetag MultiTag script in layout.tsx will automatically find
    // divs with the 'monetag' class and 'data-zoneid' attribute.
    // We just need to ensure the component is client-side rendered.
    // This useEffect hook ensures that.
  }, []);

  return (
    <div
      className={cn(
        'monetag mx-auto my-4 flex items-center justify-center min-h-[90px] w-full max-w-[728px]',
        'bg-muted/20 border border-dashed border-border rounded-lg text-muted-foreground',
        className
      )}
      data-zoneid={MONETAG_ZONE_ID}
    >
        {/* Fallback content in case ad doesn't load */}
        <p>Advertisement</p>
    </div>
  );
};

export default MonetagAd;
