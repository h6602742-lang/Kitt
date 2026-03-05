'use client';

import { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Palette, Link as LinkIcon, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function QrGeneratorClient() {
  const [value, setValue] = useState('https://creatorkit.dev');
  const [fgColor, setFgColor] = useState('#16181C'); // Dark Charcoal
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        value || ' ',
        {
          width: 256,
          margin: 4,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          errorCorrectionLevel: 'L',
        },
        (error) => {
          if (error) {
            console.error('QR Code Generation Error:', error);
            toast({
              variant: 'destructive',
              title: 'QR Code Error',
              description: 'Could not generate QR code.',
            });
          }
        }
      );
    }
  }, [value, fgColor, bgColor, toast]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `qrcode.png`;
        link.href = url;
        link.click();
        toast({ title: 'Downloaded QR Code as PNG!' });
    }
  };

  const handleReset = () => {
    setValue('https://creatorkit.dev');
    setFgColor('#16181C');
    setBgColor('#FFFFFF');
    toast({ title: 'Settings reset!' });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Free QR Code Generator',
          description: 'A free online tool to generate and customize QR codes with different colors and download them as high-quality PNG files.',
          applicationCategory: 'DesignApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        })}}
      />
      <Card>
        <CardHeader>
          <CardTitle>QR Code Generator</CardTitle>
          <CardDescription>Create your custom QR code. Enter text or a URL, customize colors, and download it instantly.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left side: Controls */}
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="qr-input" className="flex items-center gap-2">
                    <LinkIcon className="size-4" /> Enter URL or Text
                </Label>
                <Input
                  id="qr-input"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="https://example.com"
                  className="text-base"
                />
              </div>

              <div className="space-y-4">
                 <Label className="flex items-center gap-2"><Palette className="size-4" /> Customization</Label>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fg-color">QR Color</Label>
                        <Input id="fg-color" type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="p-1 h-10"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bg-color">Background</Label>
                        <Input id="bg-color" type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="p-1 h-10"/>
                    </div>
                 </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                  <Button onClick={handleDownload} className="w-full sm:w-auto flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                    <Download className="mr-2" /> Download PNG
                  </Button>
                   <Button onClick={handleReset} variant="outline" className="w-full sm:w-auto">
                    <RotateCcw className="mr-2" /> Reset
                  </Button>
              </div>

            </div>

            {/* Right side: Preview */}
            <div className="flex flex-col items-center justify-center bg-muted/30 p-4 rounded-lg border border-dashed">
                <div className="p-4 rounded-lg shadow-md" style={{ backgroundColor: bgColor }}>
                     <canvas ref={canvasRef} />
                </div>
                <p className="text-sm text-muted-foreground mt-4">Live Preview</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <article className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">How to Create a Custom QR Code</h2>
        <p>
          QR codes are a powerful way to connect the physical world to the digital. Whether you're linking to a website, a menu, a social media profile, or just sharing text, a custom QR code makes it easy. This free tool helps you create a personalized QR code in seconds, with no server-side processing, ensuring your data remains private.
        </p>
        
        <h3 className="text-xl font-semibold text-foreground">Step 1: Enter Your Content</h3>
        <p>
          Start by typing or pasting your desired content into the input field. This can be a website URL (like https://your-business.com), a piece of text, a phone number, or an email address. The QR code in the live preview on the right will update instantly as you type.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 2: Customize the Colors</h3>
        <p>
          Make your QR code stand out by customizing its appearance. Use the color pickers to select a color for the QR code itself (the foreground) and the background. For best scannability, ensure there is strong contrast between your chosen foreground and background colors. A dark foreground on a light background is the most reliable combination.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 3: Download Your QR Code</h3>
        <p>
          Once you're happy with your design, click the "Download PNG" button. Your high-resolution QR code will be saved directly to your device, ready to be used in print materials, on business cards, on websites, or anywhere else you need it. The entire process is secure and happens directly in your browser.
        </p>
      </article>
    </div>
  );
}
