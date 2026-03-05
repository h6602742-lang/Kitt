'use client';

import { useState } from 'react';
import { Loader2, Wand2, Copy, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

export default function SocialMediaOptimizerClient() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputText.trim()) {
      toast({ variant: 'destructive', title: 'Input is empty' });
      return;
    }

    setIsLoading(true);
    setOutputText('');

    try {
      const response = await fetch('/api/optimizer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An unknown error occurred.');
      }
      
      setOutputText(data.optimizedText);
      toast({ variant: 'success', title: 'Content Optimized!' });
    } catch (e: any) {
      console.error("Error fetching from API route:", e);
      toast({
        variant: 'destructive',
        title: 'AI Generation Failed',
        description: e.message || 'Could not connect to the AI service.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
      toast({ title: 'Copied to clipboard!' });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <h1 className="font-headline text-2xl font-semibold leading-none tracking-tight">AI Social Media Optimizer</h1>
          <CardDescription>Rewrite your raw text into engaging posts for Facebook, Instagram, or LinkedIn with a single click.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your raw text or draft here..."
              className="text-base min-h-[150px]"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Optimizing...</>
              ) : (
                <><Wand2 className="mr-2 h-4 w-4" /> Optimize with AI</>
              )}
            </Button>
          </form>

          {outputText && (
            <div className="mt-8 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Optimized Post</h2>
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  {copied ? <Check className="mr-2 size-4 text-success" /> : <Copy className="mr-2 size-4" />}
                  Copy
                </Button>
              </div>
              <div className="p-4 border rounded-lg bg-muted/50 whitespace-pre-wrap text-base">
                {outputText}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <article className="prose dark:prose-invert max-w-none space-y-4 text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground">How to Write Better Social Media Posts with AI</h2>
        <p>
          Writing compelling social media content is an art. It needs to be engaging, readable, and tailored to the platform. Our AI Social Media Optimizer, powered by Groq's high-speed Llama3 model, takes your raw ideas and transforms them into polished posts ready to be shared on Instagram, Facebook, or LinkedIn.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 1: Write Your Raw Content</h3>
        <p>
          Start by pasting your draft, bullet points, or even a single sentence into the text box. Don't worry about formatting, emojis, or making it perfect. Just get your core message down. The more context you provide, the better the AI will understand your intent and audience.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 2: Let the AI Work Its Magic</h3>
        <p>
          Click the "Optimize with AI" button. In seconds, our tool will analyze your text and rewrite it. The AI is trained to add strong hooks, use relevant emojis to increase visual appeal, structure the content for easy reading, and maintain a professional yet engaging tone.
        </p>

        <h3 className="text-xl font-semibold text-foreground">Step 3: Copy and Paste</h3>
        <p>
          Your new, optimized post will appear in the output box. Review it, make any final tweaks you see fit, and then click "Copy". The perfectly formatted text is now ready to be pasted directly into your social media scheduler or platform of choice, saving you time and boosting your content's performance.
        </p>
      </article>
    </div>
  );
}
