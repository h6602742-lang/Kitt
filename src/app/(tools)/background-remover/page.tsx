import type { Metadata } from 'next';
import BackgroundRemoverWrapper from './BackgroundRemoverWrapper';

export const metadata: Metadata = {
  title: 'AI Background Remover',
  description: 'Instantly remove the background from any image with a single click. Free, private, and supports bulk processing.',
};

export default function BackgroundRemoverPage() {
  return <BackgroundRemoverWrapper />;
}
