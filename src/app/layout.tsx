import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ArticlO | Automated Cold Email & Article Outreach with Google & Gemini AI',
  description: 'Scale personalized cold outreach safely. High deliverability via Gmail API, AI personalization with Gemini, and BullMQ rate-limited queue.',
  keywords: ['cold email', 'outreach', 'SaaS', 'Gmail API', 'Gemini AI', 'BullMQ', 'email automation', 'ArticlO'],
  authors: [{ name: 'ArticlO Team' }],
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('artiapply_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-poppins bg-[#f8fafc] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased min-h-screen selection:bg-slate-900 selection:text-white transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
