import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Himalayan Fleet Enterprise — Transport & Quotation Management',
    template: '%s | Himalayan Fleet Enterprise',
  },
  description:
    'Enterprise-grade transport, fleet management, multi-day itinerary builder, automated billing, and quotation portal for Himalayan Vintage Holidays.',
  keywords: [
    'Himalayan Taxi',
    'Fleet Management',
    'Transport ERP',
    'Sikkim Darjeeling Taxi',
    'Quotation Builder',
    'Billing Apps',
  ],
  authors: [{ name: 'Himalayan Vintage Holidays' }],
  openGraph: {
    title: 'Himalayan Fleet Enterprise Portal',
    description: '100% production-ready transport and quotation system.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        {children}
      </body>
    </html>
  );
}
