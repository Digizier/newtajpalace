import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Room Online | Best Rate Guarantee | New Taj Palace Hotel Lahore',
  description:
    'Reserve your room or suite online at New Taj Palace Hotel Lahore. Instant booking, transparent pricing, flexible payment options, and 24/7 confirmation.',
  alternates: {
    canonical: 'https://newtajpalace.com/book',
  },
  openGraph: {
    title: 'Book Room Online | New Taj Palace Hotel Lahore',
    description: 'Instant online hotel room reservation on Bund Road, Lahore. Secure bookings with best rates guaranteed.',
    url: 'https://newtajpalace.com/book',
    images: [{ url: '/images/rooms/room-2.webp', width: 1200, height: 800, alt: 'Book New Taj Palace Hotel Online' }],
  },
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
