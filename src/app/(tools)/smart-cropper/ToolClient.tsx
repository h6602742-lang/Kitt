'use client';

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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const aspectRatios = [
  { value: 1 / 1, text: '1:1' },
  { value: 4 / 5, text: '4:5' },
  { value: 9 / 16, text: '9:16' },
  { value: 16 / 9, text: '16:9' },
];

export default function SmartCropperClient() {
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

      <article className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">Perfectly Frame Your Content with the Smart Cropper</h2>
        <p>In a world dominated by visual content, presentation matters. Every social media platform has its own preferred image dimensions, and a poorly framed photo can ruin the impact of your message. Our Smart Cropper tool empowers you to take control of your visual narrative. Whether you're preparing a post for Instagram's square feed, a vertical story, a wide banner for X (formerly Twitter), or a professional LinkedIn update, our tool makes it effortless to crop your images to the perfect aspect ratio. Stop letting algorithms awkwardly crop your photos and start framing them exactly as you intended.</p>
        
        <h3 className="text-xl font-semibold text-foreground">Intuitive Controls for Precision Editing</h3>
        <p>Our Smart Cropper is designed for both speed and precision. Simply upload your image and select from a list of popular aspect ratios, including 1:1 (square), 9:16 (stories), 16:9 (widescreen), and 4:5 (portrait). The intuitive interface allows you to easily pan, zoom, and rotate the image within the crop area to find the perfect composition. You have full creative control to highlight the most important parts of your image, ensuring your subject is perfectly centered and your message is clear. The entire process is handled within your browser, meaning your images are never uploaded to a server, guaranteeing your privacy and security.</p>

        <h3 className="text-xl font-semibold text-foreground">Why Aspect Ratios are Crucial for Engagement</h3>
        <p>Using the correct aspect ratio for each platform is not just about aesthetics; it's about maximizing engagement. Images that are optimized for a specific feed take up more screen real estate, are more visually appealing, and are more likely to be favored by platform algorithms. A perfectly cropped image captures attention and stops the scroll, encouraging likes, comments, and shares. By using our free Smart Cropper tool, you are ensuring your content is presented in the most professional and effective way possible, helping you grow your audience and boost your online presence with every post.</p>
        
        <h2 className="text-2xl font-semibold text-foreground">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
                <AccordionTrigger>Is the Smart Cropper tool free?</AccordionTrigger>
                <AccordionContent>
                    Yes, absolutely. Our Smart Cropper is a 100% free online tool. There are no watermarks, sign-ups, or usage limits. Crop as many images as you like, whenever you need to.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>Are my images safe?</AccordionTrigger>
                <AccordionContent>
                    Your privacy is guaranteed. All cropping is done in your local browser using JavaScript. Your images are never uploaded to our servers, so you retain full control and ownership of your files at all times.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                <AccordionTrigger>What does 'aspect ratio' mean?</AccordionTrigger>
                <AccordionContent>
                    An aspect ratio describes the proportional relationship between the width and height of an image. For example, a 1:1 aspect ratio is a perfect square, while a 16:9 ratio is a wide rectangle, commonly used for video thumbnails and desktop wallpapers. Choosing the right aspect ratio ensures your image looks its best on different social platforms.
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </article>
    </div>
  );
}
