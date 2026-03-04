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

            <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the https://kitt-kappa.vercel.app website (the "Service") operated by CreatorKit ("us", "we", or "our").</p>
            <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service. By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>

            <h2 className="text-foreground">1. Use of Service</h2>
            <p>CreatorKit provides a collection of free, client-side tools for content creators. You are granted a non-exclusive, non-transferable, revocable license to use the Service for your personal and commercial use, subject to these Terms.</p>
            <p>You agree not to use the Service:</p>
            <ul>
                <li>In any way that violates any applicable national or international law or regulation.</li>
                <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm the Company or users of the Service or expose them to liability.</li>
            </ul>

            <h2 className="text-foreground">2. Advertisements</h2>
            <p>This Service is supported by advertisements, which may be served by third-party advertising partners like Google AdSense. By using the Service, you agree that we may place such advertising. The manner, mode, and extent of advertising by CreatorKit on the Service are subject to change without specific notice to you.</p>

            <h2 className="text-foreground">3. Intellectual Property</h2>
            <p>The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of CreatorKit and its licensors. The Service is protected by copyright, trademark, and other laws.</p>

            <h2 className="text-foreground">4. User Content and Data</h2>
            <p>Our tools operate primarily on the client side. This means that any files, images, or data you process using our tools are handled within your browser and are not uploaded to our servers. We do not claim any ownership rights over the content you create or modify with our tools.</p>

            <h2 className="text-foreground">5. Disclaimer of Warranties</h2>
            <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.</p>
            
            <h2 className="text-foreground">6. Limitation of Liability</h2>
            <p>In no event shall CreatorKit, nor its directors, employees, partners, or agents, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
            
            <h2 className="text-foreground">7. Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of the applicable jurisdiction, without regard to its conflict of law provisions.</p>

            <h2 className="text-foreground">8. Changes</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

            <h2 className="text-foreground">9. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us.</p>
        </div>
      </main>
    </div>
  );
}
