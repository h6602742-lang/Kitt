import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPolicyPage() {
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
            <h1 className="text-foreground">Privacy Policy</h1>
            <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <p>Welcome to CreatorKit ("us", "we", or "our"). We operate the https://kitt-kappa.vercel.app website (the "Service"). We respect your privacy and are committed to protecting it through our compliance with this policy. This policy describes the types of information we may collect from you or that you may provide when you visit our website and our practices for collecting, using, maintaining, protecting, and disclosing that information.</p>
            
            <h2 className="text-foreground">1. Information We Collect and Use</h2>
            <p>Our website is designed to be a client-side toolkit. This means that all the core functionalities, such as image compression, format conversion, and cropping, happen directly in your web browser. We do not upload, process, or store your images or files on our servers.</p>
            <ul>
                <li><strong>Log Data:</strong> Like many site operators, we may collect information that your browser sends whenever you visit our Site ("Log Data"). This Log Data may include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the pages of our Site that you visit, the time and date of your visit, and other statistics. This data is used for analytics purposes to improve our service.</li>
                <li><strong>AI Hashtag Generator:</strong> When you use the AI Hashtag Generator, the keyword you provide is sent to a third-party AI service to generate hashtags. We do not store this keyword, and it is processed ephemerally to provide you with the service.</li>
                <li><strong>Cookies and Advertising:</strong> We use cookies to store certain information on your browser. We also use third-party advertising companies, including Google AdSense, to serve ads when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you. Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
            </ul>

            <h2 className="text-foreground">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
                <li>Present our Website and its contents to you.</li>
                <li>Provide, maintain, and improve our services.</li>
                <li>Monitor and analyze usage and trends to improve your experience.</li>
                <li>Serve advertisements through our third-party partners like Google AdSense.</li>
            </ul>
            
            <h2 className="text-foreground">3. User Choices Regarding Advertising</h2>
            <p>You may opt out of personalized advertising by visiting Google's Ad Settings. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting www.aboutads.info.</p>

            <h2 className="text-foreground">4. Data Security and Privacy</h2>
            <p>Since the core functionality of our tools is client-side, your personal files and data are not at risk of being stored on our servers. The processing happens on your own device. We are committed to ensuring that our website is secure, but we cannot guarantee the security of information transmitted to our Site. Any transmission of personal information is at your own risk.</p>

            <h2 className="text-foreground">5. Changes to Our Privacy Policy</h2>
            <p>It is our policy to post any changes we make to our privacy policy on this page. If we make material changes to how we treat our users' personal information, we will notify you through a notice on the website home page.</p>

            <h2 className="text-foreground">6. Contact Information</h2>
            <p>To ask questions or comment about this privacy policy and our privacy practices, please contact us through a method provided on our website.</p>
        </div>
      </main>
    </div>
  );
}
