import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ArticleApply | Automated Cold Email Outreach with Google & Gemini AI',
  description: 'Scale personalized cold outreach safely. High deliverability via Gmail API, AI personalization with Gemini, and BullMQ rate-limited queue.',
  keywords: ['cold email', 'outreach', 'SaaS', 'Gmail API', 'Gemini AI', 'BullMQ', 'email automation'],
  authors: [{ name: 'ArticleApply Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased min-h-screen selection:bg-primary/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
