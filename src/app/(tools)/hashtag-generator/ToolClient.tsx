'use client';

import { useState } from 'react';
import { Loader2, Copy, Check, Sparkles, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import AdBanner from '@/components/AdBanner';
import hashtagData from '@/lib/hashtags.json';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const fallbackHashtags = hashtagData.categories.find(c => c.name === 'trending')?.hashtags || [];

export default function HashtagGeneratorClient() {
  const [keywords, setKeywords] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isApiDown, setIsApiDown] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setHashtags([]);
    setIsApiDown(false);

    if (!keywords || keywords.trim().length < 2) {
      toast({
        variant: 'destructive',
        title: 'Input Error',
        description: 'Please provide a keyword to get suggestions.',
      });
      setIsLoading(false);
      return;
    }
    
    try {
        const response = await fetch('/api/hashtags', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyword: keywords }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("API Error Details:", data.error);
            throw new Error(data.error || 'An unknown error occurred.');
        }

        if (!data.hashtags || !Array.isArray(data.hashtags)) {
             throw new Error('Invalid data format from server.');
        }

        const result = data.hashtags;
        setHashtags(result);
        toast({
            variant: 'success',
            title: 'Success!',
            description: `${result.length} AI-powered hashtags suggested.`,
        });

    } catch (e: any) {
        console.error("Error fetching from API route:", e);

        toast({
            variant: 'destructive',
            title: 'AI Generation Failed',
            description: e.message || 'Could not connect to the AI service. Using fallback tags.',
            duration: 9000,
        });
        setHashtags(fallbackHashtags);
        setIsApiDown(true);
    } finally {
        setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (hashtags.length > 0) {
      navigator.clipboard.writeText(hashtags.join(' '));
      setCopied(true);
      toast({ title: 'Copied to clipboard!' });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'AI Hashtag Generator',
          description: 'Generate relevant and trending hashtags for your social media posts using AI. Boost your reach and engagement.',
          applicationCategory: 'DesignApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        })}}
      />
      {isApiDown && (
         <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>AI Service Unavailable</AlertTitle>
            <AlertDescription>
                The AI hashtag generator is currently down. This could be due to server configuration or high traffic. Please try again later. We've provided fallback hashtags for now.
            </AlertDescription>
         </Alert>
       )}
      <Card>
        <CardHeader>
          <h1 className="font-headline text-2xl font-semibold leading-none tracking-tight flex items-center gap-2">
            <Sparkles className="text-accent" /> AI Hashtag Generator
          </h1>
          <CardDescription>
            Enter a keyword and let our AI generate trending and relevant hashtags for your content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., sustainable fashion, landscape photography..."
              className="text-base"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate with AI
                </>
              )}
            </Button>
          </form>

          {hashtags.length > 0 && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Suggested Hashtags</h2>
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  {copied ? <Check className="mr-2 size-4 text-success" /> : <Copy className="mr-2 size-4" />}
                  Copy All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-muted/50">
                {hashtags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-base px-3 py-1 bg-secondary/20 border-secondary/50 text-secondary-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {hashtags.length > 0 && <AdBanner dataAdSlot="YOUR_AD_SLOT_ID_HERE" />}

      <article className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
          <h2 className="text-2xl font-semibold text-foreground">Boost Your Social Media with the Right Hashtags</h2>
          <p>In today's fast-paced social media landscape, visibility is key. Hashtags are one of the most powerful tools at your disposal to cut through the noise, reach a wider audience, and increase engagement. The right combination of hashtags can connect your content with users who are actively looking for what you offer, whether it's a product, a service, or a unique perspective. However, manually researching and selecting the most effective hashtags is time-consuming and often based on guesswork. This is where our AI Hashtag Generator comes in.</p>

          <h3 className="text-xl font-semibold text-foreground">How Does AI Revolutionize Hashtag Strategy?</h3>
          <p>Our tool leverages the power of artificial intelligence to analyze your target keyword and generate a curated list of relevant and trending hashtags in seconds. Instead of just suggesting broad, generic tags, our AI understands context and semantics. It identifies a mix of popular, niche, and long-tail hashtags to maximize your reach. Popular tags get you in front of a large audience, while niche tags connect you with a more targeted, engaged community that is more likely to convert. This balanced approach ensures your content doesn't just get seen—it gets seen by the right people.</p>

          <h3 className="text-xl font-semibold text-foreground">A Data-Driven Approach to Engagement</h3>
          <p>Stop throwing hashtags at the wall and hoping they stick. Our AI Hashtag Generator provides a data-driven strategy to elevate your social media game. By simply entering a keyword related to your post, you'll receive a diverse set of suggestions that are optimized for platforms like Instagram, TikTok, X (formerly Twitter), and LinkedIn. Whether you're a small business owner, a content creator, or a marketing professional, this free tool will save you valuable time and provide the insights you need to grow your online presence, foster a community, and achieve your social media goals.</p>

          <h2 className="text-2xl font-semibold text-foreground">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                  <AccordionTrigger>Is the AI Hashtag Generator free?</AccordionTrigger>
                  <AccordionContent>
                      Yes, our tool is 100% free to use. Our goal is to provide creators and businesses with powerful, accessible tools to help them succeed. There are no hidden fees or usage limits.
                  </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                  <AccordionTrigger>How many hashtags should I use on my posts?</AccordionTrigger>
                  <AccordionContent>
                      The optimal number varies by platform. For Instagram, it's common to use between 10 and 30 hashtags. For platforms like X or Facebook, 2-3 highly relevant hashtags are often more effective. Our tool provides a generous list so you can pick the most relevant ones for your specific post and platform.
                  </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                  <AccordionTrigger>Does the AI suggest hashtags for different languages?</AccordionTrigger>
                  <AccordionContent>
                      Currently, our AI is optimized for English keywords and hashtags. However, it can often recognize popular brand names or terms from other languages. We are working on expanding our multilingual capabilities in the future.
                  </AccordionContent>
              </AccordionItem>
          </Accordion>
      </article>
    </div>
  );
}
