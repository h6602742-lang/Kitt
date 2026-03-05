import type { Metadata } from 'next';
import SocialMediaOptimizerClient from './ToolClient';

export const metadata: Metadata = {
  title: 'AI Social Media Post Optimizer',
  description: 'Use AI to rewrite your text into engaging, professional posts for Facebook, Instagram, and LinkedIn. Powered by Groq.',
};

export default function SocialMediaOptimizerPage() {
  return <SocialMediaOptimizerClient />;
}
