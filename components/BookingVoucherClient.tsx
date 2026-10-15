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

      {/* Printable Invoice & Voucher Container (#printable-invoice) */}
      <div id="printable-invoice" className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200 shadow-md space-y-6">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 gap-4">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="Logo" className="w-14 h-14 object-contain" />
            <div>
              <h2 className="font-serif text-xl font-bold text-neutral-900">NEW TAJ PALACE HOTEL</h2>
              <p className="text-xs text-neutral-500">Bund Road, Dholanwal (Opp. City Bus Terminal), Lahore</p>
              <p className="text-xs text-neutral-500">Phone: +92 322 4845461 | Email: yasinjimi4u84@gmail.com</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider block">Booking Status</span>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mt-1 ${
              booking.booking_status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
              booking.booking_status === 'pending_review' ? 'bg-amber-100 text-amber-800' :
              booking.booking_status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {booking.booking_status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Guest & Reservation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm text-neutral-700 py-2">
          <div className="space-y-1">
            <span className="text-neutral-400 block text-[11px] font-bold uppercase tracking-wider">Primary Guest</span>
            <p className="font-bold text-neutral-900 text-base">{booking.guest_name}</p>
            <p className="text-neutral-500">{booking.guest_phone}</p>
            <p className="text-neutral-500">{booking.guest_email}</p>
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="text-neutral-400 block text-[11px] font-bold uppercase tracking-wider">Stay Dates</span>
            <p className="font-bold text-neutral-900">
              {booking.check_in} (02:00 PM) ➔ {booking.check_out} (12:00 PM)
            </p>
            <p className="text-neutral-500">{booking.nights} Night{booking.nights > 1 ? 's' : ''} Stay</p>
            <p className="text-neutral-500">{booking.adults} Adults, {booking.children} Children</p>
          </div>
        </div>

        {/* Room & Payment Details */}
        <div className="border-t border-neutral-200 pt-4 space-y-3">
          <div className="flex justify-between text-sm py-1.5 border-b border-neutral-100">
            <span className="font-bold text-neutral-900">{booking.room_category_name}</span>
            <span className="font-semibold text-neutral-800">Rs. {booking.room_total.toLocaleString()}</span>
          </div>

          {booking.addons_total > 0 && (
            <div className="flex justify-between text-xs py-1 text-neutral-600">
              <span>Optional Meal & Transit Services</span>
              <span>Rs. {booking.addons_total.toLocaleString()}</span>
            </div>
          )}

          {booking.discount_total > 0 && (
            <div className="flex justify-between text-xs py-1 text-emerald-600 font-semibold">
              <span>Promotional Discount Applied</span>
              <span>- Rs. {booking.discount_total.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between items-baseline pt-3 border-t border-neutral-200">
            <span className="font-serif text-base font-bold text-neutral-900">Total Payable:</span>
            <span className="font-serif text-2xl font-bold text-neutral-900">
              Rs. {booking.grand_total.toLocaleString()}
            </span>
          </div>

          <div className="p-3 bg-neutral-50 rounded-xl flex items-center justify-between text-xs font-semibold">
            <span className="text-neutral-600">Payment Mode:</span>
            <span className="text-neutral-900 uppercase">
              {booking.payment_method === 'pay_at_hotel' ? 'Pay at Hotel (Cash on Arrival)' : 'Bank Transfer'}
            </span>
          </div>
        </div>

        {/* Important Hotel Instructions */}
        <div className="border-t border-neutral-200 pt-4 space-y-2 text-xs text-neutral-600 leading-relaxed">
          <h4 className="font-bold text-neutral-900 text-sm">Check-in Instructions & House Rules:</h4>
          <p>• <strong>Original CNIC / Passport:</strong> In accordance with local law, all adult guests must present valid identification at check-in.</p>
          <p>• <strong>Directions:</strong> Located directly on Bund Road near Rahber Travels, right opposite the City Bus Terminal in Dholanwal, Lahore.</p>
          <p>• <strong>Contact:</strong> For questions, late arrivals, or cancellations, call front desk at <strong>+92 322 4845461</strong>.</p>
        </div>
      </div>
    </div>
  );
}
