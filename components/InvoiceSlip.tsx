"use client";

import React from 'react';
import type { Booking, HotelSettings } from '@/lib/types';

interface InvoiceSlipProps {
  booking: Booking;
  hotelSettings?: HotelSettings | null;
}

export default function InvoiceSlip({ booking, hotelSettings }: InvoiceSlipProps) {
  const issueDate = booking.created_at
    ? new Date(booking.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  const hotelName = hotelSettings?.hotel_name || 'New Taj Palace Hotel';
  const hotelAddress = hotelSettings?.address || 'Near Rahber Travel, Opp City Bus Terminal, Bund Road, Dholanwal, Lahore, Pakistan';
  const hotelPhone = hotelSettings?.phone || '+92 322 4845461';
  const hotelWhatsapp = hotelSettings?.whatsapp || '923224845461';

  return (
    <div
      id="printable-invoice"
      className="bg-white text-neutral-900 p-4 sm:p-8 rounded-2xl border border-neutral-300 shadow-sm w-full max-w-2xl mx-auto space-y-5 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none text-left"
    >
      {/* 1. Official Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-neutral-800 pb-5">
        <div className="flex items-start space-x-3.5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-neutral-200 flex items-center justify-center p-1 bg-neutral-50 flex-shrink-0">
            <img
              src="/logo.png"
              alt={hotelName}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-2xl font-black tracking-tight text-neutral-950 uppercase leading-tight">
              {hotelName}
            </h2>
            <p className="text-[11px] sm:text-xs text-neutral-600 font-medium leading-snug max-w-sm mt-0.5">
              {hotelAddress}
            </p>
            <p className="text-[11px] text-neutral-600 mt-1">
              <span className="font-semibold">Helpline:</span> {hotelPhone} • <span className="font-semibold">WhatsApp:</span> +{hotelWhatsapp}
            </p>
          </div>
        </div>

        <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100 flex sm:flex-col justify-between items-center sm:items-end">
          <span className="inline-block bg-neutral-950 text-gold-400 font-bold text-[10px] sm:text-xs uppercase px-2.5 py-1 rounded tracking-wider mb-0.5">
            Reservation Voucher
          </span>
          <div className="font-mono font-bold text-sm sm:text-base text-neutral-950">
            {booking.reference}
          </div>
          <div className="text-[10px] sm:text-[11px] text-neutral-500">
            Date: {issueDate}
          </div>
        </div>
      </div>

      {/* 2. Guest & Reservation Schedule */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Guest Name</span>
          <span className="font-bold text-neutral-900 text-xs sm:text-sm">{booking.guest_name}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Phone / WhatsApp</span>
          <span className="font-bold text-neutral-900">{booking.guest_phone}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Check-In</span>
          <span className="font-bold text-neutral-900">{booking.check_in} (02:00 PM)</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Check-Out</span>
          <span className="font-bold text-neutral-900">{booking.check_out} (12:00 PM)</span>
        </div>

        <div className="pt-2 border-t border-neutral-200 col-span-2">
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Room Suite</span>
          <span className="font-bold text-neutral-900">{booking.room_category_name}</span>
        </div>
        <div className="pt-2 border-t border-neutral-200">
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Stay Duration</span>
          <span className="font-bold text-neutral-900">{booking.nights} Night{booking.nights > 1 ? 's' : ''}</span>
        </div>
        <div className="pt-2 border-t border-neutral-200">
          <span className="text-[10px] uppercase font-bold text-neutral-500 block">Guests</span>
          <span className="font-bold text-neutral-900">{booking.adults} Adults, {booking.children} Kids</span>
        </div>
      </div>

      {/* 3. Itemized Financial Breakdown Table */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 border-b border-neutral-200 pb-1">
          Itemized Charges & Billing Folio
        </h3>
        <table className="w-full text-xs text-neutral-800">
          <thead>
            <tr className="border-b border-neutral-200 text-neutral-500 text-[10px] uppercase tracking-wider text-left">
              <th className="py-1.5 font-bold">Item Description</th>
              <th className="py-1.5 text-center font-bold">Quantity / Duration</th>
              <th className="py-1.5 text-right font-bold">Amount (PKR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            <tr>
              <td className="py-2">
                <span className="font-semibold text-neutral-900">{booking.room_category_name}</span>
                <span className="block text-[10px] text-neutral-500">Accommodation room stay</span>
              </td>
              <td className="py-2 text-center text-neutral-600">{booking.nights} Night{booking.nights > 1 ? 's' : ''}</td>
              <td className="py-2 text-right font-semibold">Rs. {Number(booking.room_total || 0).toLocaleString()}</td>
            </tr>

            {Number(booking.addons_total || 0) > 0 && (
              <tr>
                <td className="py-2">
                  <span className="font-semibold text-neutral-900">Meal Add-ons & Amenities</span>
                  <span className="block text-[10px] text-neutral-500">
                    {booking.meal_addons_selected && booking.meal_addons_selected.length > 0
                      ? booking.meal_addons_selected.map(m => m.name).join(', ')
                      : 'Selected dining & transport extras'}
                  </span>
                </td>
                <td className="py-2 text-center text-neutral-600">Included</td>
                <td className="py-2 text-right font-semibold">Rs. {Number(booking.addons_total).toLocaleString()}</td>
              </tr>
            )}

            {Number(booking.extra_charges || 0) > 0 && (
              <tr>
                <td className="py-2">
                  <span className="font-semibold text-neutral-900">Additional Surcharges / Customized Services</span>
                  <span className="block text-[10px] text-neutral-500">Special service or customized facility charges</span>
                </td>
                <td className="py-2 text-center text-neutral-600">Extra</td>
                <td className="py-2 text-right font-semibold text-neutral-900">+ Rs. {Number(booking.extra_charges).toLocaleString()}</td>
              </tr>
            )}

            {Number(booking.discount_total || 0) > 0 && (
              <tr>
                <td className="py-2">
                  <span className="font-semibold text-emerald-700">Promotional Discount / Special Concession</span>
                  <span className="block text-[10px] text-emerald-600">Applied concession code or management waiver</span>
                </td>
                <td className="py-2 text-center text-emerald-700">Deduction</td>
                <td className="py-2 text-right font-semibold text-emerald-700">- Rs. {Number(booking.discount_total).toLocaleString()}</td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-neutral-900 font-bold text-neutral-950">
              <td colSpan={2} className="pt-3 text-sm font-serif">Grand Total Payable:</td>
              <td className="pt-3 text-right font-serif text-base text-neutral-950">
                Rs. {Number(booking.grand_total || 0).toLocaleString()}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 4. Payment Method & Status Banner */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3.5 space-y-2 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Payment Mode</span>
            <span className="font-bold text-neutral-900 uppercase">
              {booking.payment_method === 'pay_at_hotel' ? 'Pay at Hotel (Cash on Arrival)' : 'Advance Bank Transfer / Mobile Wallet'}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-500 block text-right">Payment Status</span>
            <span className={`inline-block font-bold text-[10px] uppercase px-2 py-0.5 rounded ${
              booking.payment_status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
              booking.payment_status === 'under_review' ? 'bg-amber-100 text-amber-800' :
              'bg-neutral-200 text-neutral-800'
            }`}>
              {booking.payment_status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* If Bank Transfer, show distinct accounts */}
        {booking.payment_method === 'bank_transfer' && hotelSettings && (
          <div className="pt-2 border-t border-neutral-200 text-[11px] text-neutral-700 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="bg-white p-2 rounded border border-neutral-200">
              <strong className="block text-neutral-900">{hotelSettings.bank_name || 'Bank Account'}</strong>
              <span>Title: {hotelSettings.bank_account_title}</span><br />
              <span>A/C: {hotelSettings.bank_account_number}</span><br />
              <span className="text-[9px] text-neutral-500">IBAN: {hotelSettings.bank_iban}</span>
            </div>
            <div className="bg-white p-2 rounded border border-neutral-200">
              <strong className="block text-red-700">JazzCash</strong>
              <span>Title: {hotelSettings.jazzcash_title}</span><br />
              <span>Mobile: {hotelSettings.jazzcash_number}</span>
            </div>
            <div className="bg-white p-2 rounded border border-neutral-200">
              <strong className="block text-emerald-700">EasyPaisa</strong>
              <span>Title: {hotelSettings.easypaisa_title}</span><br />
              <span>Mobile: {hotelSettings.easypaisa_number}</span>
            </div>
          </div>
        )}
      </div>

      {/* 5. Admin Note / Special Instructions (if any) */}
      {(booking.admin_notes || booking.special_requests) && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
          <span className="font-bold block text-[10px] uppercase tracking-wider text-amber-800">
            Booking Remarks & Instructions:
          </span>
          <p className="text-neutral-700 leading-relaxed">
            {booking.admin_notes || booking.special_requests}
          </p>
        </div>
      )}

      {/* 6. Guest Check-In Terms & Guidelines */}
      <div className="border-t border-neutral-200 pt-3 text-[10px] text-neutral-500 space-y-1 leading-normal">
        <p>• <strong>Identification:</strong> An original valid CNIC / Passport is required for all adult guests at the time of check-in.</p>
        <p>• <strong>Timing:</strong> Standard check-in begins at 02:00 PM. Check-out time is strictly 12:00 PM.</p>
        <p>• <strong>Location:</strong> Near Rahber Travel, Opposite City Bus Terminal, Bund Road, Dholanwal, Lahore, Pakistan.</p>
        <p className="text-[9px] text-neutral-400 pt-1 text-center italic">
          This is an official system-generated reservation voucher slip issued by New Taj Palace Hotel Lahore.
        </p>
      </div>
    </div>
  );
}
