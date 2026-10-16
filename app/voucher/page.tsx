"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BookingVoucherClient from '@/components/BookingVoucherClient';

function VoucherContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || searchParams.get('reference') || 'NTP-2026-PREVIEW';
  return <BookingVoucherClient initialReference={ref} />;
}

export default function VoucherPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-sand-light py-20 px-4 flex items-center justify-center">
        <div className="p-8 bg-white rounded-3xl shadow-md text-center max-w-sm">
          <div className="w-8 h-8 border-3 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Loading Official Reservation Voucher...</p>
        </div>
      </div>
    }>
      <VoucherContent />
    </Suspense>
  );
}
