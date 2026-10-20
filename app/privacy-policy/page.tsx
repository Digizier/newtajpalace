import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | New Taj Palace Hotel Lahore',
  description: 'How New Taj Palace Hotel, Lahore protects, uses, and safeguards your personal data, contact numbers, and reservation information.',
  alternates: {
    canonical: 'https://newtajpalace.com/privacy-policy',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-neutral-900">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-500">Last updated: October 2026</p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-100 shadow-sm space-y-6 text-sm text-neutral-600 leading-relaxed">
        <h2 className="font-serif text-lg font-bold text-neutral-900">1. Information We Collect</h2>
        <p>
          When you request a room reservation through our website, we collect your name, phone number, email address, arrival dates, and any special requests you provide.
        </p>

        <h2 className="font-serif text-lg font-bold text-neutral-900">2. How We Use Your Information</h2>
        <p>
          Your information is used solely to process your hotel reservation, verify room availability, transmit your booking voucher, and communicate important check-in updates. We do not sell, rent, or share personal information with third-party advertisers.
        </p>

        <h2 className="font-serif text-lg font-bold text-neutral-900">3. Data Security & Storage</h2>
        <p>
          We employ secure, modern database infrastructure to safeguard guest records and reservation details. Access to booking data is strictly limited to authorized hotel management staff.
        </p>

        <h2 className="font-serif text-lg font-bold text-neutral-900">4. Contacting Us About Your Data</h2>
        <p>
          If you wish to update or remove your reservation contact details from our records, please contact us directly at <strong>yasinjimi4u84@gmail.com</strong> or via phone at <strong>+92 322 4845461</strong>.
        </p>
      </div>
    </div>
  );
}
