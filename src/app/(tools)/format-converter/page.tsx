import type { Metadata } from 'next';
import FormatConverterClient from './ToolClient';

export const metadata: Metadata = {
  title: 'Bulk Image Format Converter',
  description: 'Convert images to modern formats like WebP, AVIF, PNG, or JPG for any use case, from web optimization to compatibility. Supports bulk processing.',
};

export default function FormatConverterPage() {
  return <FormatConverterClient />;
}
