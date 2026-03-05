import type { Metadata } from 'next';
import PlaceholderGeneratorClient from './ToolClient';

export const metadata: Metadata = {
  title: 'Image Placeholder Generator',
  description: 'A free tool to create custom placeholder images for development and design mockups with custom dimensions, colors, and text.',
};

export default function PlaceholderGeneratorPage() {
  return <PlaceholderGeneratorClient />;
}
