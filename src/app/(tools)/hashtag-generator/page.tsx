import type { Metadata } from 'next';
import HashtagGeneratorClient from './ToolClient';

export const metadata: Metadata = {
  title: 'AI Hashtag Generator',
  description: 'Generate relevant and trending hashtags for your social media posts using AI. Boost your reach and engagement.',
};

export default function HashtagGeneratorPage() {
  return <HashtagGeneratorClient />;
}
