'use client';

import { useState } from 'react';
import ColorThief from 'colorthief';
import { Loader2, Copy, Check, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/FileUploader';
import { useToast } from '@/hooks/use-toast';

export default function ColorExtractorClient() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [palette, setPalette] = useState<number[][] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImageSrc(result);
      setIsLoading(true);
      setPalette(null);

      const img = new Image();
      img.onload = () => {
        try {
          const colorThief = new ColorThief();
          const colors = colorThief.getPalette(img, 5);
          setPalette(colors);
        } catch (error) {
          toast({
            variant: 'destructive',
            title: 'Extraction Failed',
            description: 'Could not extract colors from this image format.',
          });
        } finally {
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        setIsLoading(false);
        toast({
          variant: 'destructive',
          title: 'Image Load Error',
          description: 'Could not load the selected file. Please try a different image.',
        });
      }
      img.src = result;
    };
    reader.readAsDataURL(file);
  };
  
  const rgbToHex = (r: number, g: number, b: number) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    toast({ title: `Copied ${color} to clipboard!` });
    setTimeout(() => setCopiedColor(null), 2000);
  };
  
  const handleReset = () => {
    setImageSrc(null);
    setPalette(null);
    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Image Color Palette Extractor',
          description: 'A free online tool to extract the dominant colors from any image to generate a color palette.',
          applicationCategory: 'DesignApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        })}}
      />
      <Card>
        <CardHeader>
          <CardTitle>Image Color Palette Extractor</CardTitle>
          <CardDescription>Upload an image to automatically generate a palette of the 5 most dominant colors.</CardDescription>
        </CardHeader>
        <CardContent>
          {!imageSrc ? (
            <FileUploader onFileSelect={handleFileSelect} accept={{ 'image/*': ['.jpeg', '.png', '.jpg'] }} />
          ) : (
             <div className="space-y-4">
                <div className="flex justify-center rounded-lg overflow-hidden border p-2 bg-muted/20">
                    <img src={imageSrc} alt="Uploaded for color extraction" className="max-h-80 w-auto object-contain rounded-md" />
                </div>
                <Button onClick={handleReset} variant="outline" className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset and Upload New Image
                </Button>
            </div>
          )}

          {isLoading && (
            <div className="flex justify-center items-center mt-8 space-x-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
              <p className="text-lg">Extracting Colors...</p>
            </div>
          )}

          {palette && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-center mb-4">Extracted Color Palette</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {palette.map((rgb, index) => {
                  const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 group">
                      <div className="w-full h-24 rounded-lg border shadow-inner" style={{ backgroundColor: hex }} />
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(hex)} className="w-full">
                        {copiedColor === hex ? <Check className="mr-2 size-4 text-success" /> : <Copy className="mr-2 size-4 text-muted-foreground group-hover:text-primary" />}
                        {hex.toUpperCase()}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <article className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">How to Generate a Color Palette from an Image</h2>
        <p>
          Creating a cohesive color scheme is fundamental to great design. But where do you start? Inspiration is often found in the world around us—captured in photographs. Our Color Palette Extractor helps you turn any image into a practical, five-color palette, giving you the hex codes you need for your web design, branding, or creative projects.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 1: Upload Your Image</h3>
        <p>
          Drag and drop an image file (PNG or JPG) into the upload area, or click to select one from your device. The tool works entirely within your browser, meaning your image is never uploaded to a server. This ensures your privacy and provides instant results without any server lag.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 2: Let the Tool Analyze the Colors</h3>
        <p>
          Once you upload the image, the tool immediately analyzes the pixels to identify the most prominent colors. In just a moment, it will generate a palette of five dominant colors that represent the overall mood and tone of your image. This process is automatic and requires no manual input.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 3: Copy Your Color Codes</h3>
        <p>
          Your generated color palette will be displayed as a series of swatches, each with its corresponding hexadecimal (hex) code. Simply click on a color's hex code to instantly copy it to your clipboard. You can then paste these codes directly into your CSS, Figma, Canva, or any other design tool to start using your new palette.
        </p>
      </article>
    </div>
  );
}
