'use client';

import { useState } from 'react';
import { Loader2, Download, Repeat, RotateCcw, Archive } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import NextImage from 'next/image';
import { FileUploader } from '@/components/FileUploader';
import { formatBytes, pluralize } from '@/lib/utils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Progress } from '@/components/ui/progress';

type ProcessedResult = {
  id: string;
  originalFile: File;
  resultUrl: string;
  resultBlob: Blob;
  originalSize: number;
  newSize: number;
};

type Format = 'image/webp' | 'image/png' | 'image/jpeg' | 'image/avif';

export default function FormatConverterClient() {
  const [originalFiles, setOriginalFiles] = useState<File[]>([]);
  const [processedResults, setProcessedResults] = useState<ProcessedResult[]>([]);
  const [targetFormat, setTargetFormat] = useState<Format>('image/webp');
  const [isLoading, setIsLoading] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = (files: File[]) => {
    setOriginalFiles(files);
    setProcessedResults([]);
    setProgress(0);
  };

  const handleConvert = async () => {
    if (originalFiles.length === 0) return;

    setIsLoading(true);
    setProcessedResults([]);
    setProgress(0);

    const results: ProcessedResult[] = [];
    for (let i = 0; i < originalFiles.length; i++) {
      const file = originalFiles[i];
      const originalUrl = URL.createObjectURL(file);

      const conversionPromise = new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.src = originalUrl;
        image.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = image.width;
          canvas.height = image.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Failed to get canvas context'));
          
          ctx.drawImage(image, 0, 0);
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Canvas to Blob conversion failed'));
            
            results.push({
              id: file.name + i,
              originalFile: file,
              resultUrl: URL.createObjectURL(blob),
              resultBlob: blob,
              originalSize: file.size,
              newSize: blob.size,
            });
            resolve();
          }, targetFormat, 0.9); // Quality for jpeg/webp/avif
        };
        image.onerror = () => reject(new Error('Failed to load image.'));
      });

      try {
        await conversionPromise;
        setProcessedResults([...results]);
      } catch (error: any) {
        toast({ variant: 'destructive', title: `Failed to convert ${file.name}`, description: error.message });
      }
      setProgress(((i + 1) / originalFiles.length) * 100);
    }
    
    toast({ variant: 'success', title: 'Conversion Complete!', description: `${results.length} ${pluralize(results.length, 'image', 'images')} converted.` });
    setIsLoading(false);
  };

  const handleDownloadZip = async () => {
    if (processedResults.length === 0) return;
    setIsZipping(true);
    const zip = new JSZip();
    const fileExtension = targetFormat.split('/')[1];

    processedResults.forEach(result => {
      const originalName = result.originalFile.name;
      const baseName = originalName.slice(0, originalName.lastIndexOf('.'));
      const newName = `${baseName}.${fileExtension}`;
      zip.file(newName, result.resultBlob);
    });

    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `CreatorKit_Converted_${fileExtension.toUpperCase()}.zip`);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to create ZIP file' });
    } finally {
      setIsZipping(false);
    }
  };
  
  const handleReset = () => {
    setOriginalFiles([]);
    setProcessedResults([]);
    setIsLoading(false);
    setIsZipping(false);
    setProgress(0);
  };
  
  const hasFiles = originalFiles.length > 0;
  const hasResults = processedResults.length > 0;
  
  const totalOriginalSize = processedResults.reduce((acc, r) => acc + r.originalSize, 0);
  const totalNewSize = processedResults.reduce((acc, r) => acc + r.newSize, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Image Format Converter',
          description: 'A free online tool to convert images to modern formats like WebP, AVIF, PNG, or JPG for web optimization and compatibility.',
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        })}}
      />
      <Card>
        <CardHeader>
          <h1 className="font-headline text-2xl font-semibold leading-none tracking-tight">Image Format Converter</h1>
          <CardDescription>Convert your images to WebP, AVIF, PNG, or JPG formats. Process up to 20 images at once.</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasFiles ? (
            <FileUploader onFileSelect={handleFileSelect} />
          ) : (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <Select value={targetFormat} onValueChange={(v) => setTargetFormat(v as Format)} disabled={isLoading}>
                  <SelectTrigger className="md:col-span-1">
                    <SelectValue placeholder="Select a format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image/webp">WebP</SelectItem>
                    <SelectItem value="image/avif">AVIF</SelectItem>
                    <SelectItem value="image/png">PNG</SelectItem>
                    <SelectItem value="image/jpeg">JPG</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleConvert} disabled={isLoading || isZipping} className="w-full md:col-span-1 bg-accent text-accent-foreground hover:bg-accent/90">
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Converting...</> : <><Repeat className="mr-2 h-4 w-4" /> Convert</>}
                </Button>
                {hasResults && (
                   <Button onClick={handleDownloadZip} disabled={isZipping || isLoading} className="w-full md:col-span-1">
                    {isZipping ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Zipping...</> : <><Archive className="mr-2 h-4 w-4" /> Download as ZIP</>}
                  </Button>
                )}
                 <Button onClick={handleReset} variant="outline" className="w-full md:col-span-1">
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
              </div>
              {isLoading && <Progress value={progress} className="w-full" />}
            </div>
          )}
        </CardContent>
      </Card>
      
      {hasResults && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Processing Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-around text-center">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Images</p>
                <p className="text-2xl font-bold">{processedResults.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Original Size</p>
                <p className="text-2xl font-bold">{formatBytes(totalOriginalSize)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">New Size</p>
                <p className="text-2xl font-bold">{formatBytes(totalNewSize)}</p>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {processedResults.map((result, index) => (
              <Card key={result.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <NextImage src={result.resultUrl} alt={`Converted ${result.originalFile.name}`} width={200} height={200} className="w-full h-auto object-contain aspect-square" />
                  <div className="p-2 text-xs border-t">
                    <p className="text-muted-foreground truncate">{result.originalFile.name}</p>
                    <p>{formatBytes(result.originalSize)} &rarr; {formatBytes(result.newSize)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <article className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">How to Convert Images to WebP & AVIF for Better Performance</h2>
        <p>
          In the competitive digital landscape, website speed is paramount. Large image files are a primary cause of slow load times, which can negatively affect user experience and SEO rankings. Converting your images to a modern format like WebP or AVIF can drastically reduce file size without a noticeable loss in quality. This guide will walk you through how to use our free online tool to do just that.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 1: Select Your Image Files</h3>
        <p>
          Begin by dragging and dropping your image files (PNG, JPG, etc.) into the upload area, or simply click to select files from your computer. Our tool is entirely browser-based, meaning your files are never uploaded to a server. This ensures your data remains private and secure throughout the entire process.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 2: Choose Your Target Format (WebP/AVIF)</h3>
        <p>
          Next, use the dropdown menu to select your desired output format. For web use, we highly recommend choosing 'WebP' for broad compatibility or 'AVIF' for the absolute best compression. These next-generation formats provide superior compression, resulting in significantly smaller file sizes compared to traditional formats. This is a key factor in improving your Google PageSpeed Insights score.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 3: Convert and Download in Bulk</h3>
        <p>
          Click the 'Convert' button. Our tool will process all the images instantly. You'll see the results appear below, showing the new, smaller file size for each image. To save time, click 'Download as ZIP' to save all the optimized images to your device in a single, convenient archive, ready to be uploaded to your website.
        </p>
      </article>
    </div>
  );
}
