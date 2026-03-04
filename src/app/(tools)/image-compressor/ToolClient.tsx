'use client';

import { useState } from 'react';
import { Loader2, Download, Image as ImageIcon, RotateCcw } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import NextImage from 'next/image';
import { FileUploader } from '@/components/FileUploader';
import { formatBytes } from '@/lib/utils';
import AdBanner from '@/components/AdBanner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


type CompressedResult = {
  file: File;
  url: string;
  size: number;
};

export default function ImageCompressorClient() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string>('');
  const [compressedResult, setCompressedResult] = useState<CompressedResult | null>(null);
  const [quality, setQuality] = useState(70);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    setCompressedResult(null);
  };

  const handleCompress = async () => {
    if (!originalFile) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload an image first.',
      });
      return;
    }

    setIsLoading(true);
    setCompressedResult(null);

    try {
      const options = {
        maxSizeMB: 1, // This is just a base, quality is the main factor
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        quality: quality / 100,
      };
      
      const compressedFile = await imageCompression(originalFile, options);

      setCompressedResult({
        file: compressedFile,
        url: URL.createObjectURL(compressedFile),
        size: compressedFile.size,
      });

      toast({
        variant: 'success',
        title: 'Compression successful!',
        description: `Image size reduced by ${Math.round(100 - (compressedFile.size / originalFile.size) * 100)}%.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Compression failed',
        description: 'Something went wrong. Please try a different image or quality setting.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (compressedResult) {
      const link = document.createElement('a');
      link.href = compressedResult.url;
      link.download = `compressed-${originalFile?.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setOriginalFile(null);
    setOriginalUrl('');
    setCompressedResult(null);
    setIsLoading(false);
    setQuality(70);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Image Compressor',
          description: 'Compress and optimize your images. Reduce file size without losing quality for faster web performance.',
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        })}}
      />
      <Card>
        <CardHeader>
          <h1 className="font-headline text-2xl font-semibold leading-none tracking-tight">Image Compressor</h1>
          <CardDescription>Upload an image to reduce its file size. Adjust the quality for the perfect balance.</CardDescription>
        </CardHeader>
        <CardContent>
          {!originalFile ? (
            <FileUploader onFileSelect={handleFileSelect} />
          ) : (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">Original Image</h3>
                  <div className="border rounded-lg p-2 bg-muted/20 overflow-hidden">
                    <NextImage src={originalUrl} alt="Original" width={400} height={400} className="w-full h-auto object-contain rounded-md" />
                  </div>
                  <p className="text-sm text-muted-foreground">Size: {formatBytes(originalFile.size)}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Compressed Image</h3>
                  {isLoading ? (
                    <div className="w-full h-[200px] flex items-center justify-center border rounded-lg bg-muted/20">
                      <Loader2 className="size-8 animate-spin text-primary" />
                    </div>
                  ) : compressedResult ? (
                    <>
                      <div className="border rounded-lg p-2 bg-muted/20 overflow-hidden">
                        <NextImage src={compressedResult.url} alt="Compressed" width={400} height={400} className="w-full h-auto object-contain rounded-md" />
                      </div>
                      <p className="text-sm text-muted-foreground">Size: {formatBytes(compressedResult.size)}
                        <span className="text-success ml-2">
                          (-{Math.round(100 - (compressedResult.size / originalFile.size) * 100)}%)
                        </span>
                      </p>
                    </>
                  ) : (
                    <div className="w-full h-[200px] flex items-center justify-center border-dashed border-2 rounded-lg bg-muted/20 text-muted-foreground">
                      <ImageIcon className="size-8" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="quality">Quality: {quality}</Label>
                  <Slider
                    id="quality"
                    min={1}
                    max={100}
                    step={1}
                    value={[quality]}
                    onValueChange={(value) => setQuality(value[0])}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={handleCompress} disabled={isLoading} className="w-full sm:w-auto flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Compressing...</> : 'Compress'}
                  </Button>
                  <Button onClick={handleDownload} disabled={!compressedResult || isLoading} className="w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                  <Button onClick={handleReset} variant="outline" className="w-full sm:w-auto">
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {compressedResult && <AdBanner />}

      <article className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">Optimize Your Web Vitals with Smart Image Compression</h2>
        <p>In the digital age, website speed is not a luxury—it's a necessity. Large, unoptimized images are one of the biggest culprits behind slow-loading pages, leading to poor user experience, high bounce rates, and lower search engine rankings. Our free Image Compressor tool is designed to solve this problem by intelligently reducing the file size of your images without sacrificing visual quality. By finding the perfect balance between size and quality, you can significantly improve your site's performance and Core Web Vitals, providing a faster, smoother experience for your visitors.</p>
        
        <h3 className="text-xl font-semibold text-foreground">How Does Image Compression Work?</h3>
        <p>Our tool uses advanced lossy compression algorithms to analyze your image and discard redundant data that is imperceptible to the human eye. You have full control over the level of compression via a simple quality slider. A lower quality setting will result in a smaller file size, but may introduce minor artifacts, while a higher quality setting will preserve more detail at the cost of a larger file. This allows you to make informed decisions based on your specific needs, whether you're optimizing a hero image for your homepage or a gallery of product photos. The entire process happens in your browser, ensuring your images remain private and secure.</p>
        
        <h3 className="text-xl font-semibold text-foreground">The Impact on SEO and User Engagement</h3>
        <p>Search engines like Google use page speed as a key ranking factor. A faster website is more likely to rank higher in search results, driving more organic traffic. Furthermore, a quick-loading site keeps users engaged. Studies have shown that even a one-second delay in page load time can lead to a significant drop in conversions. By using our Image Compressor, you're not just making files smaller; you're investing in better SEO, higher user engagement, and a more professional online presence. It's a simple, free step with a massive return on investment for any website owner, blogger, or e-commerce store.</p>

        <h2 className="text-2xl font-semibold text-foreground">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>What is the maximum file size I can upload?</AccordionTrigger>
                <AccordionContent>
                    Our tool is designed to handle most common image sizes. While there isn't a strict limit, performance may vary with extremely large files (e.g., over 20MB). For best results, we recommend using images under 10MB.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Does compressing an image reduce its quality?</AccordionTrigger>
                <AccordionContent>
                    Our tool uses "lossy" compression, which means some data is removed to reduce file size. However, you have control over the quality setting. At a high quality setting (e.g., 70-90), the difference in visual quality is often imperceptible to the human eye, while the file size reduction can be substantial.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>Are my images stored on your server?</AccordionTrigger>
                <AccordionContent>
                    No. All compression is performed locally in your web browser. Your images are never uploaded to our servers, ensuring your data remains 100% private and secure. You can use our tool with complete peace of mind.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </article>
    </div>
  );
}
