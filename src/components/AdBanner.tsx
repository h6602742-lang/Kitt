'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

// This is a placeholder for your real Adsterra banner key
const ADSTERRA_BANNER_KEY = 'YOUR_BANNER_KEY_HERE';

const AdBanner = ({ className }: { className?: string }) => {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const banner = bannerRef.current;
    // Ensure the script only runs once and on the client
    if (banner && banner.children.length === 0 && typeof window !== 'undefined') {
        const confScript = document.createElement('script');
        confScript.type = 'text/javascript';
        confScript.innerHTML = `
          atOptions = {
            'key' : '${ADSTERRA_BANNER_KEY}',
            'format' : 'iframe',
            'height' : 90,
            'width' : 728,
            'params' : {}
          };
        `;

        const adScript = document.createElement('script');
        adScript.type = 'text/javascript';
        adScript.src = `//www.effectivecreativeformat.com/${ADSTERRA_BANNER_KEY}/invoke.js`;
        
        banner.appendChild(confScript);
        banner.appendChild(adScript);
    }
  }, []);

  return (
    <div
        ref={bannerRef}
        className={cn(
            "mx-auto my-4 flex items-center justify-center min-h-[90px] w-full max-w-[728px]",
            "bg-muted/20 border border-dashed border-border rounded-lg text-muted-foreground",
            className
        )}
    >
      {/* Ad will be injected here by the script */}
      <p>Advertisement</p>
    </div>
  );
};

export default AdBanner;
