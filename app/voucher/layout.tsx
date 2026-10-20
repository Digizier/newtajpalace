import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discount Vouchers & Promo Codes | New Taj Palace Hotel Lahore',
  description:
    'Claim promo codes and discount vouchers for your hotel stay at New Taj Palace Hotel, Lahore. Enjoy special savings on family suites and executive rooms.',
  alternates: {
    canonical: 'https://newtajpalace.com/voucher',
  },
  openGraph: {
    title: 'Hotel Vouchers & Discounts | New Taj Palace Hotel Lahore',
    description: 'Save on your next stay with exclusive promo vouchers at New Taj Palace Hotel Lahore.',
    url: 'https://newtajpalace.com/voucher',
    images: [{ url: '/images/rooms/room-2.webp', width: 1200, height: 800, alt: 'New Taj Palace Hotel Vouchers' }],
  },
};

export default function VoucherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
