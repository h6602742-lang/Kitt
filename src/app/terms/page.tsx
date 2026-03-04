import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen flex flex-col">
       <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b bg-background/80 backdrop-blur-sm">
        <Button asChild variant="ghost" size="icon" className="mr-4">
          <Link href="/">
            <ArrowLeft className="size-5" />
            <span className="sr-only">Back to home</span>
          </Link>
        </Button>
        <Link href="/" className="font-bold font-headline text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">CreatorKit</Link>
      </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto prose dark:prose-invert text-muted-foreground">
            <h1 className="text-foreground">Terms of Service</h1>
            <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the CreatorKit website (the "Service") operated by us.</p>
            <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service. By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>

            <h2 className="text-foreground">1. Use of Service</h2>
            <p>CreatorKit provides a collection of free, client-side tools for content creators. You are granted a non-exclusive, non-transferable, revocable license to use the Service for your personal and commercial use, subject to these Terms.</p>
            <p>You agree not to use the Service:</p>
            <ul>
                <li>In any way that violates any applicable national or international law or regulation.</li>
                <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm the Company or users of the Service or expose them to liability.</li>
            </ul>

            <h2 className="text-foreground">2. Intellectual Property</h2>
            <p>The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of CreatorKit and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks may not be used in connection with any product or service without the prior written consent of CreatorKit.</p>

            <h2 className="text-foreground">3. User Content and Data</h2>
            <p>Our tools operate primarily on the client side. This means that any files, images, or data you process using our tools (e.g., Image Compressor, Smart Cropper) are handled within your browser and are not uploaded to our servers. We do not claim any ownership rights over the content you create or modify with our tools.</p>

            <h2 className="text-foreground">4. Disclaimer of Warranties</h2>
            <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.</p>
            <p>CreatorKit does not warrant that a) the Service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the Service is free of viruses or other harmful components; or d) the results of using the Service will meet your requirements.</p>

            <h2 className="text-foreground">5. Limitation of Liability</h2>
            <p>In no event shall CreatorKit, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.</p>
            
            <h2 className="text-foreground">6. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the company is established, without regard to its conflict of law provisions.</p>

            <h2 className="text-foreground">7. Changes</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

            <h2 className="text-foreground">8. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us.</p>
        </div>
      </main>
    </div>
  );
}
