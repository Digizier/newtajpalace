import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Room Rates & Tariff 2026 | New Taj Palace Hotel Lahore',
  description:
    'View transparent room prices, meal extras, and promo discounts at New Taj Palace Hotel, Lahore. Budget-friendly rates from PKR 3,500/night with no hidden charges.',
  alternates: {
    canonical: 'https://newtajpalace.com/pricing',
  },
  openGraph: {
    title: 'Room Rates & Tariff | New Taj Palace Hotel Lahore',
    description: 'Affordable hotel room pricing in Lahore. Free Wi-Fi, air-conditioning, and 24/7 front desk included with all stays.',
    url: 'https://newtajpalace.com/pricing',
    images: [{ url: '/images/rooms/room-2.webp', width: 1200, height: 800, alt: 'New Taj Palace Hotel Pricing' }],
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
