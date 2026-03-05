import { ArrowRight, Image, Hash, Crop, Repeat, QrCode } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tools = [
  {
    title: "Bulk Image Compressor",
    href: "/image-compressor",
    icon: <Image className="size-8" />,
    description: "Reduce image file sizes in bulk without losing quality. Perfect for web optimization."
  },
  {
    title: "Bulk Format Converter",
    href: "/format-converter",
    icon: <Repeat className="size-8" />,
    description: "Convert images to modern formats like WebP, AVIF, PNG, or JPG in bulk."
  },
  {
    title: "AI Hashtag Generator",
    href: "/hashtag-generator",
    icon: <Hash className="size-8" />,
    description: "Generate relevant and trending hashtags for your social media posts using AI."
  },
  {
    title: "Smart Cropper",
    href: "/smart-cropper",
    icon: <Crop className="size-8" />,
    description: "Crop images to fit social media aspect ratios like 1:1, 9:16, and more."
  },
  {
    title: "QR Code Generator",
    href: "/qr-generator",
    icon: <QrCode className="size-8" />,
    description: "Create and customize QR codes for URLs, text, and more. Download as a high-quality PNG."
  },
];

export default function Home() {
  return (
    <>
      <header className="p-4 border-b border-border/50">
        {/* Ad space can be placed here if needed in the future */}
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-center bg-clip-text text-transparent bg-gradient-to-br from-primary via-accent to-secondary">
            CreatorKit
          </h1>
          <p className="mt-4 text-center text-lg text-muted-foreground">
            A micro-toolkit for modern creators. Fast, free, and in your browser.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {tools.map((tool, index) => (
              <ToolCard key={tool.title} {...tool} index={index} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

function ToolCard({ title, href, icon, description, index }: (typeof tools)[0] & { index: number }) {
  const colors = [
    "primary",
    "secondary",
    "accent",
    "destructive",
    "yellow-500",
    "blue-500"
  ];
  
   const bgClass = `bg-${colors[index % colors.length]}/10`;
   const textClass = `text-${colors[index % colors.length]}`;

  return (
    <Link href={href} className="group block">
      <Card className="h-full transition-all duration-300 ease-in-out hover:border-primary hover:shadow-lg hover:shadow-primary/10 bg-card">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className={cn("p-3 rounded-lg", 
             {
              'bg-primary/10 text-primary': index === 0,
              'bg-secondary/10 text-secondary': index === 1,
              'bg-accent/10 text-accent': index === 2,
              'bg-destructive/10 text-destructive': index === 3,
              'bg-yellow-500/10 text-yellow-500': index === 4,
              'bg-blue-500/10 text-blue-500': index === 5,
            }
          )}>
            {icon}
          </div>
          <CardTitle className="font-headline text-xl">{title}</CardTitle>
          <ArrowRight className="ml-auto size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
