import React from 'react';
import BookingVoucherClient from '@/components/BookingVoucherClient';
import type { Metadata } from 'next';

interface BookingStatusProps {
  params: Promise<{ reference: string }>;
}

export async function generateStaticParams() {
  return [
    { reference: 'NTP-2026-PREVIEW' }
  ];
}

export const metadata: Metadata = {
  title: 'Booking Voucher & Status | New Taj Palace Hotel Lahore',
};

export default async function BookingVoucherPage({ params }: BookingStatusProps) {
  const { reference } = await params;
  return <BookingVoucherClient initialReference={reference} />;
}
