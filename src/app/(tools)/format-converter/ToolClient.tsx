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
          description: 'A free online tool to convert images to modern formats like WebP, PNG, or JPG for web optimization and compatibility.',
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
          </CardContent>
        </Card>
      )}

      <article className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">How to Convert Images to WebP for Better Performance</h2>
        <p>
          In the competitive digital landscape, website speed is paramount. Large image files are a primary cause of slow load times, which can negatively affect user experience and SEO rankings. Converting your images to a modern format like WebP can drastically reduce file size without a noticeable loss in quality. This guide will walk you through how to use our free online tool to do just that.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 1: Select Your Image File</h3>
        <p>
          Begin by dragging and dropping your image file (PNG, JPG, etc.) into the upload area, or simply click to select a file from your computer. Our tool is entirely browser-based, meaning your file is never uploaded to a server. This ensures your data remains private and secure throughout the entire process. You’ll instantly see a preview of your original image and its file size.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 2: Choose Your Target Format (WebP)</h3>
        <p>
          Next, use the dropdown menu to select your desired output format. For web use, we highly recommend choosing 'WebP'. This next-generation format developed by Google provides superior compression, resulting in significantly smaller file sizes compared to traditional formats. This is a key factor in improving your Google PageSpeed Insights score.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 3: Convert and Download</h3>
        <p>
          Click the 'Convert' button. Our tool will process the image instantly. A preview of the newly converted image will appear, along with its new, smaller file size. You'll often see a size reduction of 25-50% or more. Click 'Download' to save the optimized image to your device, ready to be uploaded to your website for a faster, better user experience.
        </p>
      </article>
    </div>
  );
}
