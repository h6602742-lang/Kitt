'use client';

import { useState } from 'react';
import { Loader2, Download, Scissors, RotateCcw, Archive } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import NextImage from 'next/image';
import { FileUploader } from '@/components/FileUploader';
import { formatBytes, pluralize } from '@/lib/utils';
import removeBackground from '@imgly/background-removal';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Progress } from '@/components/ui/progress';

type ProcessedResult = {
  originalFile: File;
  originalUrl: string;
  resultUrl: string;
  resultBlob: Blob;
};

export default function BackgroundRemoverClient() {
  const [originalFiles, setOriginalFiles] = useState<File[]>([]);
  const [processedResults, setProcessedResults] = useState<ProcessedResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleFileSelect = (files: File[]) => {
    setOriginalFiles(files);
    setProcessedResults([]);
    setProgress(0);
  };

  const handleProcessing = async () => {
    if (originalFiles.length === 0) return;

    setIsLoading(true);
    setProcessedResults([]);
    setProgress(0);

    const results: ProcessedResult[] = [];
    for (let i = 0; i < originalFiles.length; i++) {
      const file = originalFiles[i];
      try {
        const resultBlob = await removeBackground(file);
        const originalUrl = URL.createObjectURL(file);
        const resultUrl = URL.createObjectURL(resultBlob);
        results.push({ originalFile: file, originalUrl, resultUrl, resultBlob });
        setProcessedResults([...results]);
      } catch (error) {
        console.error('Background removal failed for a file:', error);
        toast({ variant: 'destructive', title: `Failed to process ${file.name}` });
      }
      setProgress(((i + 1) / originalFiles.length) * 100);
    }

    toast({ variant: 'success', title: 'Processing Complete!', description: `${results.length} ${pluralize(results.length, 'image', 'images')} processed.` });
    setIsLoading(false);
  };

  const handleDownloadZip = async () => {
    if (processedResults.length === 0) return;
    setIsZipping(true);
    const zip = new JSZip();
    processedResults.forEach(result => {
      const originalName = result.originalFile.name;
      const fileExtension = originalName.slice(originalName.lastIndexOf('.'));
      const newName = originalName.replace(fileExtension, '_bg_removed.png');
      zip.file(newName, result.resultBlob);
    });
    try {
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, 'CreatorKit_Background_Removed.zip');
    } catch (error) {
      console.error('Failed to create ZIP file', error);
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <h1 className="font-headline text-2xl font-semibold leading-none tracking-tight">AI Background Remover</h1>
          <CardDescription>Remove the background from up to 20 images at once with a single click.</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasFiles ? (
            <FileUploader onFileSelect={handleFileSelect} />
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-muted/20">
                <p className="text-sm text-muted-foreground">{originalFiles.length} {pluralize(originalFiles.length, 'file', 'files')} selected.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleProcessing} disabled={isLoading || isZipping} className="w-full sm:w-auto flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : <><Scissors className="mr-2 h-4 w-4" /> Remove Backgrounds</>}
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
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold leading-none tracking-tight">Processed Results</h2>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedResults.map((result, index) => (
              <div key={index} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="border rounded-lg p-1 bg-muted/20 overflow-hidden">
                    <NextImage src={result.originalUrl} alt={`Original ${index + 1}`} width={200} height={200} className="w-full h-auto object-contain rounded-md" />
                  </div>
                  <div className="border rounded-lg p-1 bg-muted/20 overflow-hidden">
                    <NextImage src={result.resultUrl} alt={`Result ${index + 1}`} width={200} height={200} className="w-full h-auto object-contain rounded-md" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground truncate">{result.originalFile.name}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <article className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">How to Instantly Remove Image Backgrounds for Free</h2>
        <p>
          Whether you're creating product shots for an e-commerce store, designing a thumbnail for YouTube, or just making a fun sticker, a clean, transparent background is essential. Our AI Background Remover tool makes this process instantaneous and free. It runs entirely in your browser, so your images remain 100% private.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 1: Upload Your Image(s)</h3>
        <p>
          Drag and drop up to 20 images (JPG, PNG, WebP) into the upload area. The tool is designed for bulk processing, so you can batch-edit an entire folder of photos at once. Your files are not uploaded to a server; all the magic happens locally on your computer.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 2: Start the AI Processing</h3>
        <p>
          Click the "Remove Backgrounds" button. Our AI model will analyze each image, identify the main subject, and intelligently remove the background. You'll see the results appear in real-time, showing a side-by-side comparison of the original and the new transparent version.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 3: Download Your Results</h3>
        <p>
          Once the processing is complete, you can download all your new images (now in PNG format to preserve transparency) conveniently packaged in a single ZIP file. This saves you the time of downloading each image individually and keeps your workflow efficient. It's the perfect solution for creators who need to process images in bulk.
        </p>
      </article>
    </div>
  );
}
