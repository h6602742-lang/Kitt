'use client';

import type { Metadata } from 'next';
import { useState, useRef, useCallback } from 'react';
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

export const metadata: Metadata = {
  title: 'Image Compressor',
  description: 'Compress and optimize your images. Reduce file size without losing quality for faster web performance.',
};

type CompressedResult = {
  file: File;
  url: string;
  size: number;
};

export default function ImageCompressorPage() {
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
      {compressedResult && <AdBanner dataAdSlot="YOUR_AD_SLOT_ID_HERE" />}
    </div>
  );
}
