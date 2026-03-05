import type { Metadata } from 'next';
import QrGeneratorClient from './ToolClient';

export const metadata: Metadata = {
  title: 'QR Code Generator',
  description: 'Create and customize QR codes for free. Change colors and download as a high-quality PNG file.',
};

export default function QrGeneratorPage() {
  return <QrGeneratorClient />;
}
