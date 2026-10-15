"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BedDouble, Check, ShieldCheck, ArrowRight, HelpCircle } from 'lucide-react';
import { getAllAdminRoomCategories, getActiveMealAddons } from '@/lib/db';
import type { RoomCategory, MealAddon } from '@/lib/types';
import { Shimmer } from '@/components/Shimmer';

export default function PricingPage() {
  const [rooms, setRooms] = useState<RoomCategory[]>([]);
  const [meals, setMeals] = useState<MealAddon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [rData, mData] = await Promise.all([
          getAllAdminRoomCategories(),
          getActiveMealAddons()
        ]);
        setRooms(rData);
        setMeals(mData);
      } catch (err) {
        console.error('Pricing error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block mb-2">
          Transparent Rates
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 leading-tight">
          Hotel Room Rates & Service Pricing
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base mt-3">
          Honest, budget-friendly rates with zero hidden charges. All room rates include free high-speed Wi-Fi, air-conditioning, and 24/7 front desk support.
        </p>
      </div>

      {/* Room Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-4">
              <Shimmer className="h-6 w-3/4 rounded-md" />
              <Shimmer className="h-10 w-1/2 rounded-md" />
              <Shimmer className="h-24 w-full rounded-md" />
              <Shimmer className="h-10 w-full rounded-xl" />
            </div>
          ))
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                room.is_featured
                  ? 'border-gold-500 shadow-xl ring-2 ring-gold-500/10'
                  : 'border-neutral-200/80 shadow-sm hover:shadow-md'
              }`}
            >
              <div>
                {room.is_featured && (
                  <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-gold-700 bg-gold-100 px-2.5 py-1 rounded-full mb-3">
                    Most Popular Suite
                  </span>
                )}
                <h3 className="font-serif text-xl font-bold text-neutral-900">{room.name}</h3>
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{room.short_desc}</p>

                <div className="my-6">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xs font-bold text-neutral-400">Rs.</span>
                    <span className="font-serif text-3xl font-bold text-neutral-900">
                      {room.base_price.toLocaleString()}
                    </span>
                    <span className="text-xs text-neutral-500">/ night</span>
                  </div>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    Free Cancellation (24h prior)
                  </p>
                </div>

                <ul className="space-y-2.5 text-xs text-neutral-600 border-t border-neutral-100 pt-4">
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                    <span>Occupancy: Up to {room.max_adults} Adults</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                    <span>Bed: {room.bed_type}</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                    <span>Free High-Speed Wi-Fi</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="w-3.5 h-3.5 text-gold-600 flex-shrink-0" />
                    <span>Attached Private Bathroom</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  href={`/book?room=${room.slug}`}
                  prefetch={false}
                  className="w-full bg-charcoal hover:bg-gold-500 text-white hover:text-charcoal font-bold py-3 rounded-xl text-xs text-center flex items-center justify-center space-x-2 transition-colors shadow-sm"
                >
                  <span>Book at this Rate</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dining & Optional Service Rates Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-100 shadow-sm max-w-4xl mx-auto space-y-6">
        <div>
          <span className="text-xs uppercase tracking-wider text-gold-600 font-bold block mb-1">
            Optional Add-On Services
          </span>
          <h2 className="font-serif text-2xl font-bold text-neutral-900">
            Dining & Transportation Rates
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            You can add any of these services to your room reservation during the booking flow.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="pb-3">Service / Meal Option</th>
                <th className="pb-3 text-right">Adult Rate</th>
                <th className="pb-3 text-right">Child Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {meals.map((m) => (
                <tr key={m.id} className="hover:bg-neutral-50/50">
                  <td className="py-3.5">
                    <span className="font-bold text-neutral-900 block">{m.name}</span>
                    <span className="text-xs text-neutral-500">{m.description}</span>
                  </td>
                  <td className="py-3.5 text-right font-semibold text-neutral-900 whitespace-nowrap">
                    Rs. {m.price_adult.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-right text-neutral-500 whitespace-nowrap">
                    {m.price_child > 0 ? `Rs. ${m.price_child.toLocaleString()}` : 'Free / N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
