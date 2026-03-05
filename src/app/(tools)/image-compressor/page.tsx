import type { Metadata } from 'next';
import ImageCompressorClient from './ToolClient';

export const metadata: Metadata = {
  title: 'Bulk Image Compressor',
  description: 'Compress and optimize your images in bulk. Reduce file size without losing quality for faster web performance.',
};

export default function ImageCompressorPage() {
  return <ImageCompressorClient />;
}
