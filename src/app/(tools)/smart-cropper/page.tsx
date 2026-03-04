'use client';

import type { Metadata } from 'next';
import { useState, useCallback } from 'react';
import Cropper, { Point, Area } from 'react-easy-crop';
import { Loader2, Download, Crop, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileUploader } from '@/components/FileUploader';
import { getCroppedImg } from './canvasUtils';
import 'react-easy-crop/react-easy-crop.css';
import AdBanner from '@/components/AdBanner';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Smart Cropper',
  description: 'Crop images to fit popular social media aspect ratios like 1:1, 9:16, 16:9, and 4:5 with ease.',
};

const aspectRatios = [
  { value: 1 / 1, text: '1:1' },
  { value: 4 / 5, text: '4:5' },
  { value: 9 / 16, text: '9:16' },
  { value: 16 / 9, text: '16:9' },
];

export default function SmartCropperPage() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(aspectRatios[3].value);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileSelect = (file: File) => {
    setImageSrc(URL.createObjectURL(file));
    setCroppedImage(null);
  };

  const showCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsLoading(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      setCroppedImage(croppedImage);
      toast({
        variant: 'success',
        title: 'Crop Successful!',
        description: 'Your image has been cropped.',
      });
    } catch (e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Crop Failed',
        description: 'Something went wrong while cropping the image.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [imageSrc, croppedAreaPixels, rotation, toast]);
  
  const handleDownload = () => {
    if (croppedImage) {
      const link = document.createElement('a');
      link.href = croppedImage;
      link.download = `cropped-image.jpeg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleReset = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setAspect(aspectRatios[3].value);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Smart Cropper',
          description: 'Crop images to fit popular social media aspect ratios like 1:1, 9:16, 16:9, and 4:5 with ease.',
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        })}}
      />
      <Card>
        <CardHeader>
          <h1 className="font-headline text-2xl font-semibold leading-none tracking-tight">Smart Cropper</h1>
          <CardDescription>Upload an image, choose an aspect ratio, and crop it for your needs.</CardDescription>
        </CardHeader>
        <CardContent>
          {!imageSrc ? (
            <FileUploader onFileSelect={handleFileSelect} />
          ) : (
            <div className="space-y-6">
              <div className="relative w-full h-[50vh] bg-muted/20 rounded-lg">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Zoom</Label>
                    <Slider value={[zoom]} min={1} max={3} step={0.1} onValueChange={([val]) => setZoom(val)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Rotation</Label>
                    <Slider value={[rotation]} min={0} max={360} step={1} onValueChange={([val]) => setRotation(val)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Aspect Ratio</Label>
                  <div className="flex flex-wrap gap-2">
                    {aspectRatios.map(ratio => (
                      <Button key={ratio.text} variant={aspect === ratio.value ? 'secondary' : 'outline'} onClick={() => setAspect(ratio.value)}>
                        {ratio.text}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button onClick={showCroppedImage} disabled={isLoading} className="w-full sm:w-auto flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Cropping...</> : <><Crop className="mr-2 h-4 w-4" /> Crop Image</>}
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

      {croppedImage && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold leading-none tracking-tight">Cropped Result</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-2 bg-muted/20 overflow-hidden">
                <img src={croppedImage} alt="Cropped" className="w-full h-auto object-contain rounded-md" />
            </div>
            <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2 h-4 w-4" /> Download Cropped Image
            </Button>
             <AdBanner dataAdSlot="YOUR_AD_SLOT_ID_HERE" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
