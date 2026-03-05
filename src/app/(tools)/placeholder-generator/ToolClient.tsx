'use client';

import { useState, useRef, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function PlaceholderGeneratorClient() {
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);
  const [bgColor, setBgColor] = useState('#cccccc');
  const [textColor, setTextColor] = useState('#888888');
  const [text, setText] = useState('600x400');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = Math.max(width, 1);
    const h = Math.max(height, 1);
    
    canvas.width = w;
    canvas.height = h;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, w, h);

    // Text
    ctx.fillStyle = textColor;
    const fontSize = Math.max(Math.min(w / 10, h / 5, 48), 12);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2);

  }, [width, height, bgColor, textColor, text]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `placeholder-${width}x${height}.png`;
      link.href = url;
      link.click();
      toast({ title: 'Downloaded placeholder as PNG!' });
    }
  };
  
  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let numValue = parseInt(value, 10);
    if (isNaN(numValue)) numValue = 0;

    let newWidth = width;
    let newHeight = height;

    if (name === 'width') {
      newWidth = numValue;
      setWidth(newWidth);
    }
    if (name === 'height') {
      newHeight = numValue;
      setHeight(newHeight);
    }
    
    setText(`${newWidth}x${newHeight}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Image Placeholder Generator',
          description: 'A free online tool to create custom placeholder images for development and design with custom dimensions, colors, and text.',
          applicationCategory: 'DeveloperTool',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        })}}
      />
      <Card>
        <CardHeader>
          <CardTitle>Image Placeholder Generator</CardTitle>
          <CardDescription>Create and download custom placeholder images for your development and design mockups.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (px)</Label>
                  <Input id="width" name="width" type="number" value={width} onChange={handleDimensionChange} min="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (px)</Label>
                  <Input id="height" name="height" type="number" value={height} onChange={handleDimensionChange} min="1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bg-color">Background</Label>
                  <Input id="bg-color" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="p-1 h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text-color">Text Color</Label>
                  <Input id="text-color" type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="p-1 h-10 w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="text">Custom Text</Label>
                <Input id="text" value={text} onChange={(e) => setText(e.target.value)} />
              </div>
              <Button onClick={handleDownload} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                <Download className="mr-2" /> Download PNG
              </Button>
            </div>
            
            <div className="flex flex-col items-center justify-center bg-muted/30 p-4 rounded-lg border border-dashed min-h-[250px] overflow-hidden">
              <canvas ref={canvasRef} className="max-w-full h-auto object-contain rounded-md shadow-md" />
              <p className="text-sm text-muted-foreground mt-4">Live Preview</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <article className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">How to Generate Custom Placeholder Images</h2>
        <p>
          Whether you're a developer building a layout or a designer creating mockups, you often need placeholder images to fill empty space. While you could use a generic service, they often lack customization. This tool lets you create the exact placeholder you need—with your specified dimensions, colors, and text—and download it instantly, for free.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 1: Set the Dimensions</h3>
        <p>
          Start by entering your desired width and height in pixels. As you type, the live preview on the right will update instantly. The custom text field also updates automatically to reflect the new dimensions, but you can override it at any time.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 2: Customize Colors and Text</h3>
        <p>
          Use the color pickers to select a background color and text color that match your design's aesthetic. For best results, choose a text color that has a high contrast with the background. You can also edit the text field to display a custom message, like "Hero Image" or "User Avatar," instead of the dimensions.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 3: Download Your Image</h3>
        <p>
          Once you are satisfied with the preview, click the "Download PNG" button. The placeholder image will be generated and downloaded directly to your computer. The entire process happens in your browser, ensuring it's fast, private, and doesn't rely on any external APIs or servers.
        </p>
      </article>
    </div>
  );
}
