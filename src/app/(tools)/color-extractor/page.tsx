import type { Metadata } from 'next';
import ColorExtractorClient from './ToolClient';

export const metadata: Metadata = {
  title: 'Image Color Palette Extractor',
  description: 'A free tool to extract the dominant colors from any image. Get a color palette for your design projects instantly.',
};

export default function ColorExtractorPage() {
  return <ColorExtractorClient />;
}
