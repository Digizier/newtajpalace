"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Users, BedDouble, Search, ChevronLeft, ChevronRight, ShieldCheck, MapPin } from 'lucide-react';
import { getHeroBanners } from '@/lib/db';
import type { HeroBanner } from '@/lib/types';
import { Shimmer } from './Shimmer';

export default function HeroBannerSection() {
  const router = useRouter();
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Search Widget State
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');
  const [roomSlug, setRoomSlug] = useState('any');

  useEffect(() => {
    async function load() {
      try {
        const data = await getHeroBanners();
        if (data && data.length > 0) {
          setBanners(data);
        } else {
          // Default initial banners
          setBanners([
            {
              id: '1',
              title: 'Comfort & Luxury at Affordable Rates in Lahore',
              subtitle: 'Conveniently located on Bund Road opposite City Bus Terminal. Air-conditioned rooms, free Wi-Fi, and 24/7 service.',
              image_url: '/images/rooms/room-2.webp',
              cta_text: 'Book Your Stay',
              cta_link: '/book',
              display_order: 1,
              is_active: true
            },
            {
              id: '2',
              title: 'Your Peaceful Retreat Near Lahore Transport Hubs',
              subtitle: 'Spacious suites and family quad rooms designed for families, tourists, and transit travelers.',
              image_url: '/images/rooms/room-9.webp',
              cta_text: 'Explore Suites',
              cta_link: '/rooms',
              display_order: 2,
              is_active: true
            }
          ]);
        }
      } catch (err) {
        console.error('Failed to load hero banners:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Auto rotate banner every 6 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      checkIn,
      checkOut,
      adults,
      children,
      ...(roomSlug !== 'any' ? { room: roomSlug } : {})
    });
    router.push(`/book?${params.toString()}`);
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative w-full bg-charcoal-deep flex flex-col justify-between">
      {/* Background Banner Slides Container */}
      <div className="absolute inset-0 overflow-hidden">
        {loading ? (
          <Shimmer className="absolute inset-0 w-full h-full" />
        ) : (
          banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Background Image with Responsive Sizing */}
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000"
              />
              {/* Dark & Gold Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-deep via-charcoal/80 to-charcoal/50" />
              <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/40 to-black/75" />
            </div>
          ))
        )}
      </div>

      {/* Slide Navigation Buttons */}
      {banners.length > 1 && (
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 z-20 flex justify-between pointer-events-none hidden sm:flex">
          <button
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="w-11 h-11 rounded-full bg-black/50 hover:bg-gold-500 hover:text-charcoal text-white flex items-center justify-center backdrop-blur-md transition-all pointer-events-auto"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next Slide"
            className="w-11 h-11 rounded-full bg-black/50 hover:bg-gold-500 hover:text-charcoal text-white flex items-center justify-center backdrop-blur-md transition-all pointer-events-auto"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-6 sm:pb-8 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-black/50 backdrop-blur-md border border-gold-400/30 px-3.5 py-1.5 rounded-full text-gold-300 text-xs font-semibold tracking-wide">
            <MapPin className="w-3.5 h-3.5 text-gold-400" />
            <span>Opposite City Bus Terminal, Bund Road, Lahore</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight drop-shadow-md">
            {banners[currentSlide]?.title || 'Comfortable & Affordable Stays in Lahore'}
          </h1>

          <p className="text-neutral-200 text-base sm:text-lg leading-relaxed max-w-2xl drop-shadow">
            {banners[currentSlide]?.subtitle || 'Experience warm hospitality, clean air-conditioned rooms, free Wi-Fi, and 24/7 service at budget-friendly rates.'}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/book"
              prefetch={false}
              className="bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-charcoal font-bold px-7 py-3 rounded-full text-sm sm:text-base shadow-lg shadow-gold-500/25 active:scale-95 transition-all"
            >
              Book Your Stay Online
            </Link>
            <a
              href="https://wa.me/923224845461"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-full text-sm sm:text-base backdrop-blur-md transition-all border border-white/20"
            >
              WhatsApp Front Desk
            </a>
          </div>
        </div>
      </div>

      {/* Booking Search Engine Widget - Completely contained with zero background split */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16 w-full mt-4 sm:mt-6">
        <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-7 border border-neutral-100">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center">
            {/* Check-In */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="check-in-date" className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold-500" />
                <span>Check-In</span>
              </label>
              <input
                id="check-in-date"
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm text-neutral-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                required
              />
            </div>

            {/* Check-Out */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="check-out-date" className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold-500" />
                <span>Check-Out</span>
              </label>
              <input
                id="check-out-date"
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm text-neutral-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                required
              />
            </div>

            {/* Adults & Children */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="adults-count" className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-gold-500" />
                <span>Guests</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  id="adults-count"
                  aria-label="Number of Adults"
                  value={adults}
                  onChange={(e) => setAdults(e.target.value)}
                  className="bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-2.5 text-xs sm:text-sm text-neutral-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="1">1 Adult</option>
                  <option value="2">2 Adults</option>
                  <option value="3">3 Adults</option>
                  <option value="4">4 Adults</option>
                  <option value="6">6 Adults</option>
                </select>
                <select
                  aria-label="Number of Children"
                  value={children}
                  onChange={(e) => setChildren(e.target.value)}
                  className="bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-2.5 text-xs sm:text-sm text-neutral-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="0">0 Kids</option>
                  <option value="1">1 Child</option>
                  <option value="2">2 Kids</option>
                  <option value="3">3 Kids</option>
                </select>
              </div>
            </div>

            {/* Room Preference */}
            <div className="flex flex-col space-y-1">
              <label htmlFor="room-suite-type" className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center space-x-1.5">
                <BedDouble className="w-3.5 h-3.5 text-gold-500" />
                <span>Room Suite</span>
              </label>
              <select
                id="room-suite-type"
                value={roomSlug}
                onChange={(e) => setRoomSlug(e.target.value)}
                className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2.5 text-sm text-neutral-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="any">All Available Suites</option>
                <option value="executive-suite">Executive Suite</option>
                <option value="deluxe-king-room">Deluxe King Room</option>
                <option value="family-quad-suite">Family Quad Suite</option>
                <option value="standard-double-room">Standard Double Room</option>
                <option value="master-presidential-suite">Presidential Suite</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col justify-end pt-2 sm:pt-0">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-charcoal font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-gold-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Check Rates</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
