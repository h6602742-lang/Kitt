'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type AdBannerProps = {
  className?: string;
  dataAdSlot: string;
  dataAdFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  dataFullWidthResponsive?: 'true' | 'false';
};

declare global {
  interface Window {
    adsbygoogle?: { [key: string]: unknown }[];
  }
}

const AdBanner = ({
  className,
  dataAdSlot,
  dataAdFormat = 'auto',
  dataFullWidthResponsive = 'true',
}: AdBannerProps) => {
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const pathname = usePathname();
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (adClient && adRef.current) {
        // Strict null check and status check to prevent duplicate push
        if (adRef.current.innerHTML === "" && adRef.current.getAttribute("data-ad-status") !== "filled") {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                // Mark as filled
                adRef.current.setAttribute("data-ad-status", "filled");
            } catch (err) {
                console.error('AdSense push error:', err);
            }
        }
    }
  }, [pathname, adClient]);

  if (!adClient || !dataAdSlot) {
    return (
      <div
        className={cn(
          // Ensure consistent min-height to prevent CLS
          "flex items-center justify-center min-h-[100px] w-full bg-muted/20 border border-dashed border-border rounded-lg text-muted-foreground",
          className
        )}
      >
        <p>Ad Placeholder (Ad not configured)</p>
      </div>
    );
  }

  return (
    <div
      // Using pathname as a key ensures a fresh component on route change
      key={pathname}
      className={cn(
        "flex items-center justify-center w-full min-h-[100px] bg-muted/20 text-muted-foreground overflow-hidden rounded-lg",
        className
      )}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={adClient}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive}
      ></ins>
    </div>
  );
};

export default AdBanner;
