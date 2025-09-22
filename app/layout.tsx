import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

import './globals.css';

import { ThemeProvider } from '@/components/custom/theme-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'FILMORA dashboard',
  description: 'FILMORA dashbaord next.js',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ThemeProvider
            defaultTheme="dark"
            attribute="class"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
