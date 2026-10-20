import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | New Taj Palace Hotel Lahore',
  description: 'Read the terms of service, guest policies, CNIC requirements, and reservation guidelines for New Taj Palace Hotel, Bund Road, Lahore.',
  alternates: {
    canonical: 'https://newtajpalace.com/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
          Terms & Conditions
        </h1>
        <p className="text-xs text-neutral-500">Last updated: October 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-100 shadow-sm space-y-6 text-sm text-neutral-600 leading-relaxed">
        <h2 className="font-serif text-lg font-bold text-neutral-900">1. Acceptance of Terms</h2>
        <p>
          By booking a room or using the services of New Taj Palace Hotel, Lahore (located on Bund Road opposite City Bus Terminal), guests agree to abide by these terms and hotel house rules.
        </p>

        <h2 className="font-serif text-lg font-bold text-neutral-900">2. Guest Identification</h2>
        <p>
          In accordance with Pakistani law and local regulations, every adult guest must present an original, valid Computerized National Identity Card (CNIC) or Passport upon check-in. Photostat or unverified copies may not be accepted.
        </p>

        <h2 className="font-serif text-lg font-bold text-neutral-900">3. Check-In & Check-Out Timings</h2>
        <p>
          Check-in begins from 02:00 PM on the arrival date. Check-out is scheduled by 12:00 PM on the departure date. Late check-out requests are subject to room availability and front desk confirmation.
        </p>

        <h2 className="font-serif text-lg font-bold text-neutral-900">4. Payment & Room Charges</h2>
        <p>
          Guests may settle their charges via Cash upon arrival (Pay at Hotel) or through advance verified bank transfer. All rates are agreed upon at the time of reservation.
        </p>

        <h2 className="font-serif text-lg font-bold text-neutral-900">5. Conduct & Property Rules</h2>
        <p>
          Guests are expected to respect the peaceful atmosphere of the hotel. Illegal activities, firearms, and disruptive behavior are strictly prohibited on hotel premises.
        </p>
      </div>
    </div>
  );
}
