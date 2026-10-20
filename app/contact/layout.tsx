import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us, Phone & Location Map | New Taj Palace Hotel Lahore',
  description:
    'Get in touch with New Taj Palace Hotel Lahore. Located on Main Bund Road, opposite City Bus Terminal and near Rahber & Bilal Travels. Call +92 322 4845461 or message via WhatsApp.',
  alternates: {
    canonical: 'https://newtajpalace.com/contact',
  },
  openGraph: {
    title: 'Contact New Taj Palace Hotel | Bund Road Lahore',
    description: 'Find our address, Google Maps location, phone numbers, and direct WhatsApp contact for room reservations.',
    url: 'https://newtajpalace.com/contact',
    images: [{ url: '/images/rooms/room-2.webp', width: 1200, height: 800, alt: 'Contact New Taj Palace Hotel Lahore' }],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
