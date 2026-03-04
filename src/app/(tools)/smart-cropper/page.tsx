import type { Metadata } from 'next';
import SmartCropperClient from './ToolClient';

export const metadata: Metadata = {
  title: 'Smart Cropper',
  description: 'Crop images to fit popular social media aspect ratios like 1:1, 9:16, 16:9, and 4:5 with ease.',
};

export default function SmartCropperPage() {
  return <SmartCropperClient />;
}
