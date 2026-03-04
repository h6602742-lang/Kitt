import type { Metadata } from 'next';
import ImageCompressorClient from './ToolClient';

export const metadata: Metadata = {
  title: 'Image Compressor',
  description: 'Compress and optimize your images. Reduce file size without losing quality for faster web performance.',
};

export default function ImageCompressorPage() {
  return <ImageCompressorClient />;
}
