import type { Metadata } from 'next';
import FormatConverterClient from './ToolClient';

export const metadata: Metadata = {
  title: 'Image Format Converter',
  description: 'Convert images to modern formats like WebP, PNG, or JPG for any use case, from web optimization to compatibility.',
};

export default function FormatConverterPage() {
  return <FormatConverterClient />;
}
