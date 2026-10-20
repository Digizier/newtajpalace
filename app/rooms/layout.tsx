import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Luxury Suites & Budget Rooms | New Taj Palace Hotel Lahore',
  description:
    'Explore air-conditioned executive suites, deluxe king rooms, and family quad suites at New Taj Palace Hotel, Bund Road, Lahore. Best rates guaranteed with free Wi-Fi and 24/7 service.',
  alternates: {
    canonical: 'https://newtajpalace.com/rooms',
  },
  openGraph: {
    title: 'Room Suites & Categories | New Taj Palace Hotel Lahore',
    description: 'Browse our full catalog of hotel rooms and executive suites in Lahore. Clean, comfortable, and affordable accommodation opposite City Bus Terminal.',
    url: 'https://newtajpalace.com/rooms',
    images: [{ url: '/images/rooms/room-2.webp', width: 1200, height: 800, alt: 'New Taj Palace Hotel Rooms & Suites' }],
  },
};

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
