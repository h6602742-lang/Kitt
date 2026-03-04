'use client';

import { useState } from 'react';
import { Loader2, Download, Repeat, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import NextImage from 'next/image';
import { FileUploader } from '@/components/FileUploader';
import { formatBytes } from '@/lib/utils';
import AdBanner from '@/components/AdBanner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

type ConvertedResult = {
  url: string;
  size: number;
  format: string;
};

type Format = 'image/webp' | 'image/png' | 'image/jpeg';

export default function FormatConverterClient() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [convertedResult, setConvertedResult] = useState<ConvertedResult | null>(null);
  const [targetFormat, setTargetFormat] = useState<Format>('image/webp');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setConvertedResult(null);
  };

  const handleConvert = async () => {
    if (!originalFile) return;

    setIsLoading(true);
    setConvertedResult(null);

    const image = new Image();
    image.src = originalUrl;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        toast({ variant: 'destructive', title: 'Conversion Failed' });
        setIsLoading(false);
        return;
      }
      ctx.drawImage(image, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) {
          toast({ variant: 'destructive', title: 'Conversion Failed' });
          setIsLoading(false);
          return;
        }
        setConvertedResult({
          url: URL.createObjectURL(blob),
          size: blob.size,
          format: targetFormat,
        });
        toast({ variant: 'success', title: 'Conversion Successful!' });
        setIsLoading(false);
      }, targetFormat, 0.9); // Quality for jpeg/webp
    };
    image.onerror = () => {
      toast({ variant: 'destructive', title: 'Failed to load image.' });
      setIsLoading(false);
    };
  };

  const handleDownload = () => {
    if (convertedResult) {
      const fileExtension = convertedResult.format.split('/')[1];
      const link = document.createElement('a');
      link.href = convertedResult.url;
      link.download = `converted-${originalFile?.name.split('.')[0]}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl('');
    setConvertedResult(null);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Image Format Converter',
          description: 'Convert images to modern formats like WebP, PNG, or JPG for any use case, from web optimization to compatibility.',
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        })}}
      />
      <Card>
        <CardHeader>
          <h1 className="font-headline text-2xl font-semibold leading-none tracking-tight">Image Format Converter</h1>
          <CardDescription>Convert your images to WebP, PNG, or JPG formats with a single click.</CardDescription>
        </CardHeader>
        <CardContent>
          {!originalFile ? (
            <FileUploader onFileSelect={handleFileSelect} />
          ) : (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="space-y-2">
                  <h3 className="font-semibold">Original Image</h3>
                  <div className="border rounded-lg p-2 bg-muted/20 overflow-hidden">
                    <NextImage src={originalUrl} alt="Original" width={400} height={400} className="w-full h-auto object-contain rounded-md" />
                  </div>
                  <p className="text-sm text-muted-foreground">Size: {formatBytes(originalFile.size)}</p>
                </div>
                 <div className="space-y-4 pt-8">
                  <Select value={targetFormat} onValueChange={(v) => setTargetFormat(v as Format)} disabled={isLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image/webp">WebP</SelectItem>
                      <SelectItem value="image/png">PNG</SelectItem>
                      <SelectItem value="image/jpeg">JPG</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={handleConvert} disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting...</> : <><Repeat className="mr-2 h-4 w-4" /> Convert</>}
                  </Button>
                   <Button onClick={handleReset} variant="outline" className="w-full">
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {convertedResult && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold leading-none tracking-tight">Converted Result</h2>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="border rounded-lg p-2 bg-muted/20 overflow-hidden">
              <NextImage src={convertedResult.url} alt="Converted" width={400} height={400} className="w-full h-auto object-contain rounded-md" />
            </div>
            <p className="text-sm text-muted-foreground">New Size: {formatBytes(convertedResult.size)}</p>
            <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <AdBanner />
          </CardContent>
        </Card>
      )}

      <article className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">Why Convert Image Formats?</h2>
        <p>In the digital world, images are everything. They capture attention, convey messages, and enhance user experience. However, not all image formats are created equal. The format you choose can significantly impact your website’s performance, loading speed, and overall visual quality. Our Image Format Converter is a powerful, free tool designed to help you optimize your images for any use case by converting them to modern, efficient formats like WebP, PNG, or the universally compatible JPG.</p>
        
        <h3 className="text-xl font-semibold text-foreground">The Power of WebP</h3>
        <p>WebP is a next-generation image format developed by Google that offers both lossless and lossy compression. This means you can achieve significantly smaller file sizes—often 25-35% smaller than JPEGs—without a noticeable drop in quality. For web developers and content creators, this is a game-changer. Smaller images lead to faster page load times, which directly improves user experience and search engine rankings (SEO). Our converter makes it simple to switch your existing JPEGs and PNGs to WebP, giving your website an instant performance boost.</p>

        <h3 className="text-xl font-semibold text-foreground">When to Use PNG and JPG</h3>
        <p>While WebP is excellent for the web, PNG and JPG still have their places. PNG (Portable Network Graphics) is the go-to format for images that require transparency, such as logos, icons, and graphics with non-rectangular shapes. Its lossless compression ensures that every pixel is preserved, making it ideal for detailed graphics. JPG (or JPEG) remains the universal standard for photographs. Its lossy compression algorithm is incredibly effective at reducing the file size of complex images with many colors, making it perfect for sharing photos online or via email where compatibility is key.</p>
        
        <h2 className="text-2xl font-semibold text-foreground">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Is this image converter tool free to use?</AccordionTrigger>
                <AccordionContent>
                    Yes, absolutely. Our image format converter is completely free to use with no limits. You can convert as many images as you need, directly in your browser.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Is it safe to upload my images here?</AccordionTrigger>
                <AccordionContent>
                    Yes, your privacy is our priority. All image processing happens directly in your browser. Your files are never uploaded to our servers, ensuring your data remains private and secure.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>What is the best format for my website?</AccordionTrigger>
                <AccordionContent>
                    For most web use cases, WebP is the best choice due to its superior compression and quality. It leads to faster load times, which is great for SEO and user experience. Use PNG for images requiring transparency (like logos) and JPG for universal compatibility with older devices.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </article>
    </div>
  );
}
