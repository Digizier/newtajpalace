"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Printer, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';
import { getBookingByReference } from '@/lib/db';
import type { Booking } from '@/lib/types';
import { Shimmer } from '@/components/Shimmer';
import InvoiceSlip from '@/components/InvoiceSlip';

interface BookingVoucherClientProps {
  initialReference: string;
}

export default function BookingVoucherClient({ initialReference }: BookingVoucherClientProps) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!initialReference) return;

    if (initialReference === 'NTP-2026-PREVIEW') {
      setBooking({
        id: 'preview',
        reference: 'NTP-2026-PREVIEW',
        room_category_id: 'sample',
        room_category_name: 'Executive Suite',
        check_in: '2026-10-20',
        check_out: '2026-10-21',
        nights: 1,
        adults: 2,
        children: 0,
        num_rooms: 1,
        guest_name: 'Valued Guest',
        guest_phone: '+92 322 4845461',
        guest_email: 'guest@example.com',
        meal_addons_selected: [],
        room_total: 6500,
        addons_total: 0,
        discount_total: 0,
        tax_total: 0,
        grand_total: 6500,
        payable_now: 0,
        due_at_checkin: 6500,
        payment_method: 'pay_at_hotel',
        payment_status: 'unpaid',
        booking_status: 'confirmed',
      });
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const res = await getBookingByReference(initialReference);
        if (res) {
          setBooking(res);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error('Error fetching booking voucher:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [initialReference]);

  if (loading) {
    return (
      <div className="pt-36 pb-24 max-w-xl mx-auto px-4 text-center space-y-4">
        <Shimmer className="h-40 w-full rounded-3xl" />
        <p className="text-xs text-neutral-500 font-semibold">Loading official booking voucher...</p>
      </div>
    );
  }

  if (notFound || !booking) {
    return (
      <div className="pt-36 pb-24 max-w-xl mx-auto px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-neutral-800">Booking Reference Not Found</h2>
        <p className="text-sm text-neutral-600">
          We could not locate any reservation matching reference &quot;{initialReference}&quot;. Please verify the reference number or contact reception.
        </p>
        <Link href="/" className="inline-block mt-4 px-6 py-2.5 bg-gold-500 text-white font-bold rounded-xl text-xs">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 no-print">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block">
            Official Booking Voucher
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900">
            Reservation #{booking.reference}
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="bg-charcoal hover:bg-neutral-800 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Voucher</span>
          </button>
          <a
            href={`https://wa.me/923224845461?text=${encodeURIComponent(`Hello New Taj Palace Hotel, I am checking my booking reference ${booking.reference}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Printable Invoice Slip Component */}
      <InvoiceSlip booking={booking} />
    </div>
  );
}
