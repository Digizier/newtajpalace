import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Photo Gallery | Rooms, Suites & Facilities | New Taj Palace Hotel Lahore',
  description:
    'Browse verified photographs of executive suites, bedrooms, private attached bathrooms, reception, and amenities at New Taj Palace Hotel on Bund Road, Lahore.',
  alternates: {
    canonical: 'https://newtajpalace.com/gallery',
  },
  openGraph: {
    title: 'Photo Gallery | New Taj Palace Hotel Lahore',
    description: 'High-resolution photos of our rooms, suites, and facilities in Lahore.',
    url: 'https://newtajpalace.com/gallery',
    images: [{ url: '/images/rooms/room-2.webp', width: 1200, height: 800, alt: 'New Taj Palace Hotel Gallery' }],
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
