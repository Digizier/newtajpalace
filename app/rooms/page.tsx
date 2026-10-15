"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, BedDouble, ChevronRight, Filter, Sparkles, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { getRoomCategories } from '@/lib/db';
import type { RoomCategory } from '@/lib/types';
import { RoomCardSkeleton } from '@/components/Shimmer';

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomCategory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOccupancy, setFilterOccupancy] = useState('all');

  const PAGE_SIZE = 8; // Strictly 8 items per page for minimum egress and zero Cloudflare load

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data, count } = await getRoomCategories(currentPage, PAGE_SIZE);
        setRooms(data);
        setTotalCount(count);
      } catch (err) {
        console.error('Failed to load rooms:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentPage]);

  // Filter client-side for immediate responsive feel
  const filteredRooms = rooms.filter((r) => {
    if (filterOccupancy === 'all') return true;
    if (filterOccupancy === 'couple') return r.max_adults <= 2;
    if (filterOccupancy === 'family') return r.max_adults >= 3;
    return true;
  });

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  return (
    <div className="pt-28 sm:pt-36 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-gold-600 font-bold block mb-2">
          New Taj Palace Accommodation
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-neutral-900 leading-tight">
          Rooms & Executive Suites
        </h1>
        <p className="text-neutral-600 text-sm sm:text-base mt-3">
          Explore clean, fully air-conditioned rooms and family suites on Bund Road, Lahore. All suites feature attached private bathrooms, free Wi-Fi, and 24/7 room service.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
        <div className="flex items-center space-x-2 text-xs font-bold text-neutral-500 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-gold-500" />
          <span>Filter by Guests:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterOccupancy('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterOccupancy === 'all'
                ? 'bg-charcoal text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All Suites ({totalCount})
          </button>
          <button
            onClick={() => setFilterOccupancy('couple')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterOccupancy === 'couple'
                ? 'bg-charcoal text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Couples & Solo (1-2 Adults)
          </button>
          <button
            onClick={() => setFilterOccupancy('family')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterOccupancy === 'family'
                ? 'bg-charcoal text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            Family & Groups (3+ Adults)
          </button>
        </div>

        <div className="text-xs text-neutral-400 font-medium">
          Showing 8 items per page
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: PAGE_SIZE }).map((_, i) => <RoomCardSkeleton key={i} />)
        ) : filteredRooms.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-neutral-100 p-8">
            <BedDouble className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-bold text-neutral-800">No rooms match your filter</h3>
            <p className="text-xs text-neutral-500 mt-1">Try resetting the filter to view all suites.</p>
            <button
              onClick={() => setFilterOccupancy('all')}
              className="mt-4 px-5 py-2 bg-gold-500 text-white rounded-xl text-xs font-bold hover:bg-gold-600 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <div
              key={room.id}
              className="group bg-white rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Image & Price Tag */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={room.featured_image || '/images/rooms/room-2.webp'}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-charcoal/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gold-300 shadow-sm">
                  Rs. {room.base_price.toLocaleString()} / night
                </div>
                {room.is_featured && (
                  <div className="absolute top-3 left-3 bg-gold-500 text-charcoal font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Popular</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-neutral-900 group-hover:text-gold-700 transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {room.short_desc}
                  </p>

                  <div className="flex items-center space-x-3 text-xs text-neutral-600 mt-3 pt-3 border-t border-neutral-100">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-gold-600" />
                      <span>{room.max_adults} Adults</span>
                    </div>
                    <span className="text-neutral-300">•</span>
                    <span>{room.bed_type}</span>
                  </div>

                  {/* Amenities Preview */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {room.amenities.slice(0, 3).map((am) => (
                      <span
                        key={am}
                        className="text-[10px] bg-neutral-50 text-neutral-600 px-2 py-0.5 rounded-md border border-neutral-100"
                      >
                        {am}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="text-[10px] text-neutral-400 font-medium">
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
                  <Link
                    href={`/rooms/${room.slug}`}
                    className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold py-2 px-3 rounded-xl text-xs text-center transition-colors"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/book?room=${room.slug}`}
                    prefetch={false}
                    className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-2 px-3 rounded-xl text-xs text-center flex items-center justify-center space-x-1 shadow-sm active:scale-95 transition-all"
                  >
                    <span>Book</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls (Strict 8 items per page) */}
      {totalPages > 1 && (
        <div className="mt-14 flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-2.5 rounded-xl border border-neutral-200 text-neutral-700 disabled:opacity-30 disabled:pointer-events-none hover:bg-white transition-colors"
            aria-label="Previous Page"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNum = index + 1;
            const isCurrent = currentPage === pageNum;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                  isCurrent
                    ? 'bg-gold-500 text-white shadow-md shadow-gold-500/20'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2.5 rounded-xl border border-neutral-200 text-neutral-700 disabled:opacity-30 disabled:pointer-events-none hover:bg-white transition-colors"
            aria-label="Next Page"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
