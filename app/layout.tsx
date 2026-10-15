import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNavBar from '@/components/MobileNavBar';
import WhatsAppFloating from '@/components/WhatsAppFloating';
import ScrollToTop from '@/components/ScrollToTop';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#11202A',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://newtajpalace.com'),
  title: {
    default: 'New Taj Palace Hotel | Affordable & Comfortable Hotel in Lahore',
    template: '%s | New Taj Palace Hotel Lahore',
  },
  description:
    'Welcome to New Taj Palace Hotel, Lahore. Comfortable and affordable accommodation on Bund Road, near Rahber Travels and opposite the City Bus Terminal. Air-conditioned rooms, free Wi-Fi, and 24/7 room service.',
  keywords: [
    'New Taj Palace Hotel',
    'Hotel in Lahore',
    'Bund Road Hotel',
    'City Bus Terminal Lahore Hotel',
    'Budget Hotel Lahore',
    'Rahber Travels Hotel',
    'Family Hotel Lahore',
    'Room Booking Lahore'
  ],
  authors: [{ name: 'New Taj Palace Hotel' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'New Taj Palace Hotel | Lahore Pakistan',
    description: 'Affordable, clean, and comfortable hotel accommodation on Bund Road opposite City Bus Terminal, Lahore.',
    url: 'https://newtajpalace.com',
    siteName: 'New Taj Palace Hotel',
    images: [
      {
        url: '/images/rooms/room-2.webp',
        width: 1200,
        height: 800,
        alt: 'New Taj Palace Hotel Executive Suite',
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="min-h-screen flex flex-col bg-ivory text-neutral-900 selection:bg-gold-500 selection:text-white">
        <ScrollToTop />
        <Header />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
        <MobileNavBar />
        <WhatsAppFloating />
      </body>
    </html>
  );
}
