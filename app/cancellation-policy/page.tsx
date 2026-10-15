import React from 'react';
import Link from 'next/link';
import { ShieldAlert, CheckCircle2, Clock, Calendar, Phone, MessageSquare } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | New Taj Palace Hotel',
  description: 'Understand the booking cancellation, refund, modification, and check-in terms at New Taj Palace Hotel Lahore.',
};

export default function CancellationPolicyPage() {
  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block">
          Guest Protection & Terms
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900">
          Cancellation & Refund Policy
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base max-w-xl mx-auto">
          We strive to provide fair and transparent cancellation guidelines for all visitors reserving rooms at New Taj Palace Hotel, Lahore.
        </p>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-100 shadow-sm space-y-8 text-neutral-700 text-sm sm:text-base leading-relaxed">
        {/* Section 1 */}
        <div className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gold-500" />
            <span>1. Free Cancellation Window</span>
          </h2>
          <p>
            Guests can cancel their room reservation free of charge up to <strong>24 hours prior to the official check-in time</strong> (02:00 PM on the arrival date).
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-neutral-600">
            <li>If you chose <strong>Pay at Hotel</strong>, no charges will be incurred. Simply notify us via phone or WhatsApp.</li>
            <li>If you made an advance bank transfer, your payment will be refunded within 3 to 5 business days after deduction of any interbank transfer fees.</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gold-500" />
            <span>2. Late Cancellations & Same-Day Notices</span>
          </h2>
          <p>
            Cancellations made within 24 hours of check-in time, or on the day of arrival, may be subject to a one-night room charge if rooms were held and unavailable for other travelers arriving at the City Bus Terminal.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-gold-500" />
            <span>3. No-Show Policy</span>
          </h2>
          <p>
            If a guest does not arrive by 09:00 PM on the scheduled check-in date without prior notice, the reservation may be released to accommodate walk-in bus passengers or families seeking accommodation.
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-neutral-900 flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-gold-500" />
            <span>4. Reservation Modifications</span>
          </h2>
          <p>
            Need to change your dates or upgrade your suite? Modifications are accommodated free of charge, subject to room availability for the requested dates. Please inform front desk as early as possible.
          </p>
        </div>

        {/* Section 5: Contact */}
        <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-neutral-900">Have questions about your booking?</h4>
            <p className="text-xs text-neutral-500">Contact front desk directly with your booking reference.</p>
          </div>
          <div className="flex items-center space-x-3">
            <a
              href="https://wa.me/923224845461"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp: 0322 4845461</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
