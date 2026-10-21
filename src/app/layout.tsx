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
  title: 'ArticlO | Your Articleship Hunt Ends Here • Reach Hundreds of HRs in a Click',
  description: 'Reach out to hundreds of HR in a click. Get ATS-free resume templates and active mail IDs of HR for CA articleship outreach with authentic Gmail delivery and AI.',
  keywords: ['CA articleship', 'articleship outreach', 'HR email list', 'ATS resume templates', 'Chartered Accountant articleship', 'cold email', 'Gmail API', 'ArticlO'],
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
