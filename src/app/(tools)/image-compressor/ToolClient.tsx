'use client';

import { useState } from 'react';
import { Loader2, Download, Image as ImageIcon, RotateCcw, Archive } from 'lucide-react';
import imageCompression from 'browser-image-compression';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import NextImage from 'next/image';
import { FileUploader } from '@/components/FileUploader';
import { formatBytes, pluralize } from '@/lib/utils';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Progress } from '@/components/ui/progress';

type CompressedResult = {
  id: string;
  originalFile: File;
  compressedFile: File;
  compressedUrl: string;
  originalSize: number;
  newSize: number;
};

export default function ImageCompressorClient() {
  const [originalFiles, setOriginalFiles] = useState<File[]>([]);
  const [compressedResults, setCompressedResults] = useState<CompressedResult[]>([]);
  const [quality, setQuality] = useState(70);
  const [isLoading, setIsLoading] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = (files: File[]) => {
    setOriginalFiles(files);
    setCompressedResults([]);
    setProgress(0);
  };

  const handleCompress = async () => {
    if (originalFiles.length === 0) return;

    setIsLoading(true);
    setCompressedResults([]);
    setProgress(0);

    const results: CompressedResult[] = [];
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      quality: quality / 100,
    };

    for (let i = 0; i < originalFiles.length; i++) {
      const file = originalFiles[i];
      try {
        const compressedFile = await imageCompression(file, options);
        results.push({
          id: file.name + i,
          originalFile: file,
          compressedFile: compressedFile,
          compressedUrl: URL.createObjectURL(compressedFile),
          originalSize: file.size,
          newSize: compressedFile.size,
        });
        setCompressedResults([...results]);
      } catch (error) {
        console.error(error);
        toast({ variant: 'destructive', title: `Compression failed for ${file.name}` });
      }
      setProgress(((i + 1) / originalFiles.length) * 100);
    }
    
    toast({ variant: 'success', title: 'Compression Complete!', description: `${results.length} ${pluralize(results.length, 'image', 'images')} compressed.` });
    setIsLoading(false);
  };

  const handleDownloadZip = async () => {
    if (compressedResults.length === 0) return;
    setIsZipping(true);
    const zip = new JSZip();
    compressedResults.forEach(result => {
      zip.file(`compressed-${result.originalFile.name}`, result.compressedFile);
    });
    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'CreatorKit_Compressed_Images.zip');
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to create ZIP file' });
    } finally {
      setIsZipping(false);
    }
  };

  const handleReset = () => {
    setOriginalFiles([]);
    setCompressedResults([]);
    setIsLoading(false);
    setIsZipping(false);
    setQuality(70);
    setProgress(0);
  };

  const hasFiles = originalFiles.length > 0;
  const hasResults = compressedResults.length > 0;

  const totalOriginalSize = compressedResults.reduce((acc, r) => acc + r.originalSize, 0);
  const totalCompressedSize = compressedResults.reduce((acc, r) => acc + r.newSize, 0);
  const totalReduction = totalOriginalSize > 0 ? Math.round(100 - (totalCompressedSize / totalOriginalSize) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Free Image Compressor',
          description: 'A free online tool to compress and optimize images in bulk, reducing file size for faster web performance without losing quality.',
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        })}}
      />
      <Card>
        <CardHeader>
          <h1 className="font-headline text-2xl font-semibold leading-none tracking-tight">Image Compressor</h1>
          <CardDescription>Upload up to 20 images to reduce their file size. Adjust the quality for the perfect balance.</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasFiles ? (
            <FileUploader onFileSelect={handleFileSelect} />
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="quality">Quality: {quality}</Label>
                <Slider id="quality" min={1} max={100} step={1} value={[quality]} onValueChange={(value) => setQuality(value[0])} disabled={isLoading} />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleCompress} disabled={isLoading || isZipping} className="w-full sm:w-auto flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Compressing...</> : 'Compress Images'}
                </Button>
                {hasResults && (
                  <Button onClick={handleDownloadZip} disabled={isZipping || isLoading} className="w-full sm:w-auto">
                    {isZipping ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Zipping...</> : <><Archive className="mr-2 h-4 w-4" /> Download as ZIP</>}
                  </Button>
                )}
                <Button onClick={handleReset} variant="outline" className="w-full sm:w-auto">
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
              <CardTitle>Compression Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-around text-center">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Space Saved</p>
                <p className="text-2xl font-bold text-success">{formatBytes(totalOriginalSize - totalCompressedSize)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Avg. Reduction</p>
                <p className="text-2xl font-bold">{totalReduction}%</p>
              </div>
               <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Images Processed</p>
                <p className="text-2xl font-bold">{compressedResults.length}</p>
              </div>
            </CardContent>
          </Card>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {compressedResults.map((result) => (
              <Card key={result.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <NextImage src={result.compressedUrl} alt={`Compressed ${result.originalFile.name}`} width={200} height={200} className="w-full h-auto object-contain aspect-square" />
                  <div className="p-2 text-xs border-t">
                    <p className="text-muted-foreground truncate">{result.originalFile.name}</p>
                    <p>{formatBytes(result.originalSize)} &rarr; <span className="font-semibold">{formatBytes(result.newSize)}</span></p>
                     <p className="text-success font-semibold">-{Math.round(100 - (result.newSize / result.originalSize) * 100)}%</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <article className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">How to Reduce Image Size for the Web</h2>
        <p>
          Page speed is a critical ranking factor for Google and essential for keeping users engaged. Large images are the number one cause of slow websites. Compressing your images before uploading them can dramatically improve performance. This guide shows you how to use this free tool to reduce image file sizes quickly and effectively in bulk.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 1: Upload Your Images</h3>
        <p>
          Drag and drop up to 20 JPG, PNG, or WebP files into the upload box, or click to select them from your device. The entire process happens in your browser, so your images are never sent to a server. This guarantees your privacy.
        </p>
        
        <h3 className="text-xl font-semibold text-foreground">Step 2: Adjust the Compression Quality</h3>
        <p>
          Use the 'Quality' slider to find the perfect balance between file size and visual quality. A lower number (e.g., 60) will result in a much smaller file, while a higher number (e.g., 85) will preserve more detail. For web use, a quality setting between 70 and 80 is often the sweet spot, offering significant size reduction with almost no perceptible loss in quality. This setting will apply to all images.
        </p>
        
        <h3 className="text-xl font-semibold text-foreground">Step 3: Compress and Download All</h3>
        <p>
          Click the 'Compress' button. The tool will process all your images in seconds, and previews of the compressed versions will appear below. You can instantly see the new file size and the percentage of reduction for each. Once finished, click 'Download as ZIP' to save all the optimized images in a single archive.
        </p>
      </article>
    </div>
  );
}
